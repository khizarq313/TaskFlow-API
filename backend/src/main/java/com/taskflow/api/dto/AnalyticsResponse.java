package com.taskflow.api.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Aggregated analytics response combining task statistics,
 * completion trends, and status distribution for the dashboard.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponse {

    private long totalTasks;
    private long completedTasks;
    private long overdueTasks;
    private double completionRate;

    /** Tasks completed per day for the last 7 days: { "2026-04-10": 5, ... } */
    private Map<LocalDate, Long> dailyCompletions;

    /** Task count by status: { "TODO": 12, "IN_PROGRESS": 5, "DONE": 20 } */
    private Map<String, Long> statusDistribution;

    /** Recent activity entries across all tasks. */
    private List<ActivityEntry> recentActivity;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivityEntry {
        private String description;
        private String taskTitle;
        private Long taskId;
        private String authorName;
        private String authorPhotoUrl;
        private String timestamp;
    }
}
