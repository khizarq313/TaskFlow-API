package com.taskflow.api.service;

import com.taskflow.api.dto.CommentRequest;
import com.taskflow.api.dto.TaskRequest;
import com.taskflow.api.dto.TaskResponse;
import com.taskflow.api.exception.ResourceNotFoundException;
import com.taskflow.api.model.*;
import com.taskflow.api.model.enums.TaskStatus;
import com.taskflow.api.repository.CommentRepository;
import com.taskflow.api.repository.ProjectRepository;
import com.taskflow.api.repository.SubtaskRepository;
import com.taskflow.api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer owning all business logic for Task management.
 * Enforces user-scoped data isolation — every operation verifies task ownership
 * through the authenticated user, ensuring a user can never access another
 * user's tasks.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final SubtaskRepository subtaskRepository;
    private final CommentRepository commentRepository;
    private final ProjectRepository projectRepository;

    /**
     * Retrieves all tasks belonging to the authenticated user.
     *
     * @param owner the authenticated user
     * @return list of task response DTOs
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(User owner) {
        return taskRepository.findByOwnerOrderByPositionAsc(owner).stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves tasks filtered by status for the authenticated user.
     *
     * @param owner  the authenticated user
     * @param status the task status to filter by
     * @return filtered list of task response DTOs
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByStatus(User owner, TaskStatus status) {
        return taskRepository.findByOwnerAndStatusOrderByPositionAsc(owner, status).stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single task by ID, scoped to the authenticated user.
     *
     * @param owner  the authenticated user
     * @param taskId the task ID
     * @return the task response DTO
     * @throws ResourceNotFoundException if the task does not exist or is not owned by the user
     */
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(User owner, Long taskId) {
        Task task = findOwnedTask(owner, taskId);
        return TaskResponse.fromEntity(task);
    }

    /**
     * Creates a new task for the authenticated user.
     * Assigns ownership, sets defaults, and optionally creates subtasks.
     *
     * @param owner   the authenticated user
     * @param request the task creation request
     * @return the created task response DTO
     */
    @Transactional
    public TaskResponse createTask(User owner, TaskRequest request) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : com.taskflow.api.model.enums.TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .position(request.getPosition() != null ? request.getPosition() : 0)
                .owner(owner)
                .subtasks(new ArrayList<>())
                .comments(new ArrayList<>())
                .build();

        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", request.getProjectId()));
            task.setProject(project);
        }

        Task saved = taskRepository.save(task);

        if (request.getSubtasks() != null && !request.getSubtasks().isEmpty()) {
            for (int i = 0; i < request.getSubtasks().size(); i++) {
                TaskRequest.SubtaskRequest sr = request.getSubtasks().get(i);
                Subtask subtask = Subtask.builder()
                        .title(sr.getTitle())
                        .completed(sr.getCompleted() != null ? sr.getCompleted() : false)
                        .position(sr.getPosition() != null ? sr.getPosition() : i)
                        .task(saved)
                        .build();
                saved.getSubtasks().add(subtask);
            }
            saved = taskRepository.save(saved);
        }

        log.info("Task created: id={}, title='{}', owner={}", saved.getId(), saved.getTitle(), owner.getEmail());
        return TaskResponse.fromEntity(saved);
    }

    /**
     * Updates an existing task belonging to the authenticated user.
     * Only non-null fields in the request are applied.
     *
     * @param owner   the authenticated user
     * @param taskId  the ID of the task to update
     * @param request the update request
     * @return the updated task response DTO
     */
    @Transactional
    public TaskResponse updateTask(User owner, Long taskId, TaskRequest request) {
        Task task = findOwnedTask(owner, taskId);

        TaskStatus oldStatus = task.getStatus();

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getPosition() != null) {
            task.setPosition(request.getPosition());
        }
        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", request.getProjectId()));
            task.setProject(project);
        }

        if (request.getSubtasks() != null) {
            task.getSubtasks().clear();
            for (int i = 0; i < request.getSubtasks().size(); i++) {
                TaskRequest.SubtaskRequest sr = request.getSubtasks().get(i);
                Subtask subtask = Subtask.builder()
                        .title(sr.getTitle())
                        .completed(sr.getCompleted() != null ? sr.getCompleted() : false)
                        .position(sr.getPosition() != null ? sr.getPosition() : i)
                        .task(task)
                        .build();
                task.getSubtasks().add(subtask);
            }
        }

        Task updated = taskRepository.save(task);

        if (request.getStatus() != null && oldStatus != request.getStatus()) {
            Comment systemComment = Comment.builder()
                    .content(String.format("Status changed from %s to %s", oldStatus, request.getStatus()))
                    .authorName("System")
                    .isSystemMessage(true)
                    .task(updated)
                    .build();
            commentRepository.save(systemComment);
        }

        log.info("Task updated: id={}, owner={}", taskId, owner.getEmail());
        return TaskResponse.fromEntity(updated);
    }

    /**
     * Deletes a task belonging to the authenticated user.
     *
     * @param owner  the authenticated user
     * @param taskId the ID of the task to delete
     */
    @Transactional
    public void deleteTask(User owner, Long taskId) {
        Task task = findOwnedTask(owner, taskId);
        taskRepository.delete(task);
        log.info("Task deleted: id={}, owner={}", taskId, owner.getEmail());
    }

    /**
     * Adds a comment to a task owned by the authenticated user.
     *
     * @param owner   the authenticated user
     * @param taskId  the task ID
     * @param request the comment request
     * @return the updated task response DTO
     */
    @Transactional
    public TaskResponse addComment(User owner, Long taskId, CommentRequest request) {
        Task task = findOwnedTask(owner, taskId);

        Comment comment = Comment.builder()
                .content(request.getContent())
                .authorName(owner.getDisplayName())
                .authorPhotoUrl(owner.getPhotoUrl())
                .isSystemMessage(false)
                .task(task)
                .build();
        commentRepository.save(comment);

        return TaskResponse.fromEntity(taskRepository.findByIdAndOwner(taskId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId)));
    }

    /**
     * Internal helper to find a task that belongs to the given owner.
     * Guarantees user-scoped data isolation at the service layer.
     */
    private Task findOwnedTask(User owner, Long taskId) {
        return taskRepository.findByIdAndOwner(taskId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
    }
}
