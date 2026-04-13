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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Project management.
 * Handles project CRUD, membership management,
 * and access control verification.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    /**
     * Retrieves all projects accessible by the authenticated user
     * (both owned and member projects).
     */
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAccessibleProjects(User user) {
        return projectRepository.findAccessibleByUser(user).stream()
                .map(ProjectResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single project by ID.
     */
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));
        return ProjectResponse.fromEntity(project);
    }

    /**
     * Creates a new project with the authenticated user as owner.
     * Automatically adds the owner as a member with OWNER role.
     */
    @Transactional
    public ProjectResponse createProject(User owner, ProjectRequest request) {
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .members(new ArrayList<>())
                .tasks(new ArrayList<>())
                .build();

        Project saved = projectRepository.save(project);

        ProjectMember ownerMember = ProjectMember.builder()
                .project(saved)
                .user(owner)
                .role(ProjectRole.OWNER)
                .build();
        projectMemberRepository.save(ownerMember);
        saved.getMembers().add(ownerMember);

        log.info("Project created: id={}, name='{}', owner={}", saved.getId(), saved.getName(), owner.getEmail());
        return ProjectResponse.fromEntity(saved);
    }

    /**
     * Updates a project. Only the project owner can perform this action.
     */
    @Transactional
    public ProjectResponse updateProject(User owner, Long projectId, ProjectRequest request) {
        Project project = projectRepository.findByIdAndOwner(projectId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));

        if (request.getName() != null) {
            project.setName(request.getName());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }

        Project updated = projectRepository.save(project);
        log.info("Project updated: id={}, owner={}", projectId, owner.getEmail());
        return ProjectResponse.fromEntity(updated);
    }

    /**
     * Deletes a project. Only the project owner can perform this action.
     */
    @Transactional
    public void deleteProject(User owner, Long projectId) {
        Project project = projectRepository.findByIdAndOwner(projectId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));

        projectRepository.delete(project);
        log.info("Project deleted: id={}, owner={}", projectId, owner.getEmail());
    }

    /**
     * Adds a member to a project. Only the project owner can add members.
     *
     * @param owner       the authenticated user (must be the project owner)
     * @param projectId   the project to add a member to
     * @param memberEmail the email of the user to add
     * @return updated project response
     */
    @Transactional
    public ProjectResponse addMember(User owner, Long projectId, String memberEmail) {
        Project project = projectRepository.findByIdAndOwner(projectId, owner)
                .orElseThrow(() -> new UnauthorizedException(
                        "Only the project owner can add members"));

        User memberUser = userRepository.findByEmail(memberEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User with email " + memberEmail + " not found"));

        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, memberUser.getId())) {
            throw new IllegalArgumentException("User is already a member of this project");
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(memberUser)
                .role(ProjectRole.MEMBER)
                .build();
        projectMemberRepository.save(member);
        project.getMembers().add(member);

        log.info("Member added to project: projectId={}, member={}", projectId, memberEmail);
        return ProjectResponse.fromEntity(project);
    }

    /**
     * Removes a member from a project. Only the project owner can remove members.
     */
    @Transactional
    public ProjectResponse removeMember(User owner, Long projectId, Long userId) {
        Project project = projectRepository.findByIdAndOwner(projectId, owner)
                .orElseThrow(() -> new UnauthorizedException(
                        "Only the project owner can remove members"));

        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Member not found in this project"));

        if (member.getRole() == ProjectRole.OWNER) {
            throw new IllegalArgumentException("Cannot remove the project owner");
        }

        project.getMembers().remove(member);
        projectMemberRepository.delete(member);

        log.info("Member removed from project: projectId={}, userId={}", projectId, userId);
        return ProjectResponse.fromEntity(project);
    }
}
