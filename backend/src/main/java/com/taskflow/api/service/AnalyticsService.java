package com.taskflow.api.service;

import com.taskflow.api.dto.AnalyticsResponse;
import com.taskflow.api.model.Comment;
import com.taskflow.api.model.Task;
import com.taskflow.api.model.User;
import com.taskflow.api.model.enums.TaskStatus;
import com.taskflow.api.repository.CommentRepository;
import com.taskflow.api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service layer for aggregated analytics data.
 * Computes task statistics, completion trends, status distribution,
 * and recent activity — all scoped to the authenticated user.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;

    /**
     * Generates a complete analytics snapshot for the authenticated user.
     *
     * @param user the authenticated user
     * @return aggregated analytics data
     */
    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics(User user) {
        long total = taskRepository.countByOwner(user);
        long completed = taskRepository.countByOwnerAndStatus(user, TaskStatus.DONE);
        long overdue = taskRepository.countOverdueByOwner(user, LocalDate.now());
        double completionRate = total > 0 ? Math.round((double) completed / total * 10000.0) / 100.0 : 0.0;

        Map<LocalDate, Long> dailyCompletions = computeDailyCompletions(user);
        Map<String, Long> statusDistribution = computeStatusDistribution(user);
        List<AnalyticsResponse.ActivityEntry> recentActivity = getRecentActivity(user);

        return AnalyticsResponse.builder()
                .totalTasks(total)
                .completedTasks(completed)
                .overdueTasks(overdue)
                .completionRate(completionRate)
                .dailyCompletions(dailyCompletions)
                .statusDistribution(statusDistribution)
                .recentActivity(recentActivity)
                .build();
    }

    /**
     * Computes the number of tasks completed per day for the last 7 days.
     */
    private Map<LocalDate, Long> computeDailyCompletions(User user) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(7).with(LocalTime.MIN);

        List<Task> completedTasks = taskRepository.findCompletedBetween(user, start, end);

        Map<LocalDate, Long> result = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            result.put(LocalDate.now().minusDays(i), 0L);
        }

        for (Task task : completedTasks) {
            if (task.getCompletedAt() != null) {
                LocalDate date = task.getCompletedAt().toLocalDate();
                result.merge(date, 1L, Long::sum);
            }
        }

        return result;
    }

    /**
     * Computes task count grouped by status.
     */
    private Map<String, Long> computeStatusDistribution(User user) {
        Map<String, Long> distribution = new LinkedHashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            distribution.put(status.name(), taskRepository.countByOwnerAndStatus(user, status));
        }
        return distribution;
    }

    /**
     * Retrieves the 20 most recent activity entries (comments and system messages).
     */
    private List<AnalyticsResponse.ActivityEntry> getRecentActivity(User user) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, HH:mm");

        return commentRepository.findRecentByOwnerId(user.getId()).stream()
                .limit(20)
                .map(comment -> AnalyticsResponse.ActivityEntry.builder()
                        .description(comment.getContent())
                        .taskTitle(comment.getTask().getTitle())
                        .taskId(comment.getTask().getId())
                        .authorName(comment.getAuthorName())
                        .authorPhotoUrl(comment.getAuthorPhotoUrl())
                        .timestamp(comment.getCreatedAt().format(formatter))
                        .build())
                .collect(Collectors.toList());
    }
}
