package com.taskflow.api.controller;

import com.taskflow.api.dto.CommentRequest;
import com.taskflow.api.dto.TaskRequest;
import com.taskflow.api.dto.TaskResponse;
import com.taskflow.api.model.User;
import com.taskflow.api.model.enums.TaskStatus;
import com.taskflow.api.service.TaskService;
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

/**
 * REST controller for Task CRUD operations.
 *
 * Responsibilities are limited to:
 * - HTTP request parsing and validation
 * - Delegating to the TaskService for all business logic
 * - Mapping responses to appropriate HTTP status codes
 *
 * The authenticated User is extracted from the SecurityContext
 * (set by FirebaseAuthFilter) — never from client-sent data.
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "CRUD operations for user task management")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get all tasks", description = "Retrieves all tasks belonging to the authenticated user")
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) TaskStatus status) {

        List<TaskResponse> tasks = (status != null)
                ? taskService.getTasksByStatus(user, status)
                : taskService.getAllTasks(user);

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID", description = "Retrieves a single task by ID, scoped to the authenticated user")
    public ResponseEntity<TaskResponse> getTaskById(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Task ID") @PathVariable Long id) {

        return ResponseEntity.ok(taskService.getTaskById(user, id));
    }

    @PostMapping
    @Operation(summary = "Create a task", description = "Creates a new task for the authenticated user")
    public ResponseEntity<TaskResponse> createTask(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TaskRequest request) {

        TaskResponse created = taskService.createTask(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a task", description = "Updates an existing task belonging to the authenticated user")
    public ResponseEntity<TaskResponse> updateTask(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Task ID") @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {

        return ResponseEntity.ok(taskService.updateTask(user, id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task", description = "Deletes a task belonging to the authenticated user")
    public ResponseEntity<Void> deleteTask(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Task ID") @PathVariable Long id) {

        taskService.deleteTask(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Add a comment", description = "Adds a comment to a task belonging to the authenticated user")
    public ResponseEntity<TaskResponse> addComment(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Task ID") @PathVariable Long id,
            @Valid @RequestBody CommentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.addComment(user, id, request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status", description = "Updates only the status of a task")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body
    ) {
        String status = body.get("status");

        TaskResponse updated = taskService.updateTaskStatus(user, id, status);

        return ResponseEntity.ok(updated);
    }
}
