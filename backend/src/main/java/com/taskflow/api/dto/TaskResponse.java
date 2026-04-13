package com.taskflow.api.dto;

import com.taskflow.api.model.Comment;
import com.taskflow.api.model.Subtask;
import com.taskflow.api.model.Task;
import com.taskflow.api.model.enums.TaskPriority;
import com.taskflow.api.model.enums.TaskStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Outbound DTO projecting Task entity data for API responses.
 * Static factory method {@link #fromEntity(Task)} handles the mapping.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private Integer position;
    private Long projectId;
    private String projectName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private List<SubtaskResponse> subtasks;
    private List<CommentResponse> comments;
    private int subtaskTotal;
    private int subtaskCompleted;

    /**
     * Maps a Task JPA entity to a response DTO, including nested subtasks
     * and comments. Avoids exposing internal entity relationships directly.
     */
    public static TaskResponse fromEntity(Task task) {
        List<SubtaskResponse> subtaskResponses = task.getSubtasks() != null
                ? task.getSubtasks().stream()
                    .map(SubtaskResponse::fromEntity)
                    .collect(Collectors.toList())
                : List.of();

        List<CommentResponse> commentResponses = task.getComments() != null
                ? task.getComments().stream()
                    .map(CommentResponse::fromEntity)
                    .collect(Collectors.toList())
                : List.of();

        int total = subtaskResponses.size();
        int completed = (int) subtaskResponses.stream()
                .filter(SubtaskResponse::getCompleted)
                .count();

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .position(task.getPosition())
                .projectId(task.getProject() != null ? task.getProject().getId() : null)
                .projectName(task.getProject() != null ? task.getProject().getName() : null)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .completedAt(task.getCompletedAt())
                .subtasks(subtaskResponses)
                .comments(commentResponses)
                .subtaskTotal(total)
                .subtaskCompleted(completed)
                .build();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubtaskResponse {
        private Long id;
        private String title;
        private Boolean completed;
        private Integer position;

        public static SubtaskResponse fromEntity(Subtask subtask) {
            return SubtaskResponse.builder()
                    .id(subtask.getId())
                    .title(subtask.getTitle())
                    .completed(subtask.getCompleted())
                    .position(subtask.getPosition())
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CommentResponse {
        private Long id;
        private String content;
        private String authorName;
        private String authorPhotoUrl;
        private Boolean isSystemMessage;
        private LocalDateTime createdAt;

        public static CommentResponse fromEntity(Comment comment) {
            return CommentResponse.builder()
                    .id(comment.getId())
                    .content(comment.getContent())
                    .authorName(comment.getAuthorName())
                    .authorPhotoUrl(comment.getAuthorPhotoUrl())
                    .isSystemMessage(comment.getIsSystemMessage())
                    .createdAt(comment.getCreatedAt())
                    .build();
        }
    }
}
