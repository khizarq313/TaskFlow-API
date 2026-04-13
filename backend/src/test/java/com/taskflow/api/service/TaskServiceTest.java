package com.taskflow.api.service;

import com.taskflow.api.dto.TaskRequest;
import com.taskflow.api.dto.TaskResponse;
import com.taskflow.api.exception.ResourceNotFoundException;
import com.taskflow.api.model.Task;
import com.taskflow.api.model.User;
import com.taskflow.api.model.enums.TaskPriority;
import com.taskflow.api.model.enums.TaskStatus;
import com.taskflow.api.repository.CommentRepository;
import com.taskflow.api.repository.ProjectRepository;
import com.taskflow.api.repository.SubtaskRepository;
import com.taskflow.api.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for TaskService demonstrating testability of the layered architecture.
 * Mocks the Repository layer to isolate business logic testing.
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private SubtaskRepository subtaskRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private TaskService taskService;

    private User testUser;
    private Task testTask;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .firebaseUid("firebase-uid-123")
                .email("test@taskflow.dev")
                .displayName("Test User")
                .build();

        testTask = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Test description")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.HIGH)
                .dueDate(LocalDate.now().plusDays(7))
                .position(0)
                .owner(testUser)
                .subtasks(new ArrayList<>())
                .comments(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Nested
    @DisplayName("getAllTasks")
    class GetAllTasks {

        @Test
        @DisplayName("should return all tasks for the authenticated user")
        void returnsAllUserTasks() {
            Task task2 = Task.builder()
                    .id(2L)
                    .title("Second Task")
                    .status(TaskStatus.IN_PROGRESS)
                    .priority(TaskPriority.MEDIUM)
                    .position(1)
                    .owner(testUser)
                    .subtasks(new ArrayList<>())
                    .comments(new ArrayList<>())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            when(taskRepository.findByOwnerOrderByPositionAsc(testUser))
                    .thenReturn(List.of(testTask, task2));

            List<TaskResponse> result = taskService.getAllTasks(testUser);

            assertThat(result).hasSize(2);
            assertThat(result.get(0).getTitle()).isEqualTo("Test Task");
            assertThat(result.get(1).getTitle()).isEqualTo("Second Task");
            verify(taskRepository).findByOwnerOrderByPositionAsc(testUser);
        }

        @Test
        @DisplayName("should return empty list when user has no tasks")
        void returnsEmptyForNoTasks() {
            when(taskRepository.findByOwnerOrderByPositionAsc(testUser))
                    .thenReturn(List.of());

            List<TaskResponse> result = taskService.getAllTasks(testUser);

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("getTaskById")
    class GetTaskById {

        @Test
        @DisplayName("should return task when owned by the user")
        void returnsOwnedTask() {
            when(taskRepository.findByIdAndOwner(1L, testUser))
                    .thenReturn(Optional.of(testTask));

            TaskResponse result = taskService.getTaskById(testUser, 1L);

            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getTitle()).isEqualTo("Test Task");
            assertThat(result.getStatus()).isEqualTo(TaskStatus.TODO);
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when task does not belong to user")
        void throwsNotFoundForOtherUsersTask() {
            when(taskRepository.findByIdAndOwner(99L, testUser))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.getTaskById(testUser, 99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Task with id 99 not found");
        }
    }

    @Nested
    @DisplayName("createTask")
    class CreateTask {

        @Test
        @DisplayName("should create a task with default status TODO")
        void createsWithDefaultStatus() {
            TaskRequest request = TaskRequest.builder()
                    .title("New Task")
                    .description("A new task description")
                    .priority(TaskPriority.HIGH)
                    .build();

            when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
                Task saved = invocation.getArgument(0);
                saved.setId(10L);
                saved.setCreatedAt(LocalDateTime.now());
                saved.setUpdatedAt(LocalDateTime.now());
                return saved;
            });

            TaskResponse result = taskService.createTask(testUser, request);

            assertThat(result.getId()).isEqualTo(10L);
            assertThat(result.getTitle()).isEqualTo("New Task");
            assertThat(result.getStatus()).isEqualTo(TaskStatus.TODO);
            assertThat(result.getPriority()).isEqualTo(TaskPriority.HIGH);
            verify(taskRepository).save(any(Task.class));
        }

        @Test
        @DisplayName("should create a task with explicit status")
        void createsWithExplicitStatus() {
            TaskRequest request = TaskRequest.builder()
                    .title("In Progress Task")
                    .status(TaskStatus.IN_PROGRESS)
                    .priority(TaskPriority.MEDIUM)
                    .build();

            when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
                Task saved = invocation.getArgument(0);
                saved.setId(11L);
                saved.setCreatedAt(LocalDateTime.now());
                saved.setUpdatedAt(LocalDateTime.now());
                return saved;
            });

            TaskResponse result = taskService.createTask(testUser, request);

            assertThat(result.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        }
    }

    @Nested
    @DisplayName("updateTask")
    class UpdateTask {

        @Test
        @DisplayName("should update only the provided fields")
        void updatesPartialFields() {
            when(taskRepository.findByIdAndOwner(1L, testUser))
                    .thenReturn(Optional.of(testTask));
            when(taskRepository.save(any(Task.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            TaskRequest request = TaskRequest.builder()
                    .title("Updated Title")
                    .build();

            TaskResponse result = taskService.updateTask(testUser, 1L, request);

            assertThat(result.getTitle()).isEqualTo("Updated Title");
            assertThat(result.getStatus()).isEqualTo(TaskStatus.TODO);
        }

        @Test
        @DisplayName("should create a system comment when status changes")
        void createsSystemCommentOnStatusChange() {
            when(taskRepository.findByIdAndOwner(1L, testUser))
                    .thenReturn(Optional.of(testTask));
            when(taskRepository.save(any(Task.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            TaskRequest request = TaskRequest.builder()
                    .status(TaskStatus.IN_PROGRESS)
                    .build();

            taskService.updateTask(testUser, 1L, request);

            verify(commentRepository).save(argThat(comment ->
                    comment.getIsSystemMessage()
                            && comment.getContent().contains("TODO")
                            && comment.getContent().contains("IN_PROGRESS")));
        }
    }

    @Nested
    @DisplayName("deleteTask")
    class DeleteTask {

        @Test
        @DisplayName("should delete a task owned by the user")
        void deletesOwnedTask() {
            when(taskRepository.findByIdAndOwner(1L, testUser))
                    .thenReturn(Optional.of(testTask));
            doNothing().when(taskRepository).delete(testTask);

            taskService.deleteTask(testUser, 1L);

            verify(taskRepository).delete(testTask);
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException for non-owned task")
        void throwsNotFoundForNonOwnedTask() {
            when(taskRepository.findByIdAndOwner(99L, testUser))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.deleteTask(testUser, 99L))
                    .isInstanceOf(ResourceNotFoundException.class);

            verify(taskRepository, never()).delete(any());
        }
    }
}
