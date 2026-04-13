package com.taskflow.api.dto;

import com.taskflow.api.model.enums.TaskPriority;
import com.taskflow.api.model.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Inbound DTO for creating or updating a task.
 * Validated at the controller boundary before entering the service layer.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskRequest {

    @NotBlank(message = "Task title is required")
    @Size(max = 255, message = "Title must be 255 characters or fewer")
    private String title;

    @Size(max = 5000, message = "Description must be 5000 characters or fewer")
    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    private LocalDate dueDate;

    private Long projectId;

    private Integer position;

    private List<SubtaskRequest> subtasks;

    /**
     * Nested DTO for subtask creation within a task request.
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubtaskRequest {
        @NotBlank(message = "Subtask title is required")
        private String title;
        private Boolean completed;
        private Integer position;
    }
}
