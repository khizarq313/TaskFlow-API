package com.taskflow.api.dto;

import com.taskflow.api.model.Project;
import com.taskflow.api.model.ProjectMember;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Outbound DTO projecting Project entity data for API responses.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private String ownerName;
    private String ownerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int taskCount;
    private List<MemberResponse> members;

    public static ProjectResponse fromEntity(Project project) {
        List<MemberResponse> memberList = project.getMembers() != null
                ? project.getMembers().stream()
                    .map(MemberResponse::fromEntity)
                    .collect(Collectors.toList())
                : List.of();

        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .ownerName(project.getOwner().getDisplayName())
                .ownerEmail(project.getOwner().getEmail())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .taskCount(project.getTasks() != null ? project.getTasks().size() : 0)
                .members(memberList)
                .build();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MemberResponse {
        private Long userId;
        private String email;
        private String displayName;
        private String role;

        public static MemberResponse fromEntity(ProjectMember pm) {
            return MemberResponse.builder()
                    .userId(pm.getUser().getId())
                    .email(pm.getUser().getEmail())
                    .displayName(pm.getUser().getDisplayName())
                    .role(pm.getRole().name())
                    .build();
        }
    }
}
