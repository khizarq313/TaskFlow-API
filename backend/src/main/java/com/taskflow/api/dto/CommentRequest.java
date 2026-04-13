package com.taskflow.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Inbound DTO for adding a comment to a task.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRequest {

    @NotBlank(message = "Comment content is required")
    private String content;
}
