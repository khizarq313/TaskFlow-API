package com.taskflow.api.controller;

import com.taskflow.api.dto.ProjectRequest;
import com.taskflow.api.dto.ProjectResponse;
import com.taskflow.api.model.User;
import com.taskflow.api.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for Project CRUD and membership management.
 *
 * Controllers handle HTTP only — all business logic, authorization,
 * and data access is delegated to ProjectService.
 */
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Project management and membership operations")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "Get accessible projects",
            description = "Retrieves all projects the user owns or is a member of")
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.getAccessibleProjects(user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID")
    public ResponseEntity<ProjectResponse> getProjectById(
            @Parameter(description = "Project ID") @PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    @Operation(summary = "Create a project",
            description = "Creates a new project with the authenticated user as owner")
    public ResponseEntity<ProjectResponse> createProject(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(user, request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a project",
            description = "Updates project details. Only the owner can update.")
    public ResponseEntity<ProjectResponse> updateProject(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Project ID") @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(user, id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project",
            description = "Deletes a project and all associated data. Only the owner can delete.")
    public ResponseEntity<Void> deleteProject(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Project ID") @PathVariable Long id) {
        projectService.deleteProject(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/members")
    @Operation(summary = "Add a member to a project",
            description = "Only the project owner can add members. Send the member's email.")
    public ResponseEntity<ProjectResponse> addMember(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Project ID") @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String email = body.get("email");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.addMember(user, id, email));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @Operation(summary = "Remove a member from a project",
            description = "Only the project owner can remove members.")
    public ResponseEntity<ProjectResponse> removeMember(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Project ID") @PathVariable Long id,
            @Parameter(description = "User ID to remove") @PathVariable Long userId) {
        return ResponseEntity.ok(projectService.removeMember(user, id, userId));
    }
}
