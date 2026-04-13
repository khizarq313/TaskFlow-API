package com.taskflow.api.service;

import com.taskflow.api.dto.ProjectRequest;
import com.taskflow.api.dto.ProjectResponse;
import com.taskflow.api.exception.ResourceNotFoundException;
import com.taskflow.api.exception.UnauthorizedException;
import com.taskflow.api.model.Project;
import com.taskflow.api.model.ProjectMember;
import com.taskflow.api.model.User;
import com.taskflow.api.model.enums.ProjectRole;
import com.taskflow.api.repository.ProjectMemberRepository;
import com.taskflow.api.repository.ProjectRepository;
import com.taskflow.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ProjectService demonstrating the testability
 * of the layered architecture with mocked repositories.
 */
@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectService projectService;

    private User testOwner;
    private User testMember;
    private Project testProject;

    @BeforeEach
    void setUp() {
        testOwner = User.builder()
                .id(1L)
                .firebaseUid("owner-uid")
                .email("owner@taskflow.dev")
                .displayName("Owner User")
                .build();

        testMember = User.builder()
                .id(2L)
                .firebaseUid("member-uid")
                .email("member@taskflow.dev")
                .displayName("Member User")
                .build();

        testProject = Project.builder()
                .id(1L)
                .name("Test Project")
                .description("A test project")
                .owner(testOwner)
                .members(new ArrayList<>())
                .tasks(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Nested
    @DisplayName("createProject")
    class CreateProject {

        @Test
        @DisplayName("should create a project and auto-add owner as a member")
        void createsProjectWithOwnerMember() {
            ProjectRequest request = ProjectRequest.builder()
                    .name("New Project")
                    .description("Project description")
                    .build();

            when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
                Project p = invocation.getArgument(0);
                p.setId(5L);
                p.setCreatedAt(LocalDateTime.now());
                return p;
            });
            when(projectMemberRepository.save(any(ProjectMember.class))).thenAnswer(invocation -> {
                ProjectMember pm = invocation.getArgument(0);
                pm.setId(1L);
                return pm;
            });

            ProjectResponse result = projectService.createProject(testOwner, request);

            assertThat(result.getId()).isEqualTo(5L);
            assertThat(result.getName()).isEqualTo("New Project");
            verify(projectMemberRepository).save(argThat(pm ->
                    pm.getRole() == ProjectRole.OWNER
                            && pm.getUser().equals(testOwner)));
        }
    }

    @Nested
    @DisplayName("addMember")
    class AddMember {

        @Test
        @DisplayName("should add a member to a project owned by the user")
        void addsMemberSuccessfully() {
            when(projectRepository.findByIdAndOwner(1L, testOwner))
                    .thenReturn(Optional.of(testProject));
            when(userRepository.findByEmail("member@taskflow.dev"))
                    .thenReturn(Optional.of(testMember));
            when(projectMemberRepository.existsByProjectIdAndUserId(1L, 2L))
                    .thenReturn(false);
            when(projectMemberRepository.save(any(ProjectMember.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            ProjectResponse result = projectService.addMember(testOwner, 1L, "member@taskflow.dev");

            assertThat(result.getMembers()).hasSize(1);
            verify(projectMemberRepository).save(argThat(pm ->
                    pm.getRole() == ProjectRole.MEMBER));
        }

        @Test
        @DisplayName("should throw UnauthorizedException when non-owner tries to add member")
        void throwsForNonOwner() {
            when(projectRepository.findByIdAndOwner(1L, testMember))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() ->
                    projectService.addMember(testMember, 1L, "new@taskflow.dev"))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessageContaining("Only the project owner");
        }

        @Test
        @DisplayName("should throw when user is already a member")
        void throwsForDuplicateMember() {
            when(projectRepository.findByIdAndOwner(1L, testOwner))
                    .thenReturn(Optional.of(testProject));
            when(userRepository.findByEmail("member@taskflow.dev"))
                    .thenReturn(Optional.of(testMember));
            when(projectMemberRepository.existsByProjectIdAndUserId(1L, 2L))
                    .thenReturn(true);

            assertThatThrownBy(() ->
                    projectService.addMember(testOwner, 1L, "member@taskflow.dev"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("already a member");
        }
    }
}
