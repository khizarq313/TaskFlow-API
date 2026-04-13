package com.taskflow.api.repository;

import com.taskflow.api.model.Project;
import com.taskflow.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Data access layer for Project entities.
 * Queries are scoped to projects where the user is either owner or member.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    /** Projects owned by the user. */
    List<Project> findByOwnerOrderByCreatedAtDesc(User owner);

    /** All projects the user has access to (owned or member). */
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members m " +
           "WHERE p.owner = :user OR m.user = :user ORDER BY p.createdAt DESC")
    List<Project> findAccessibleByUser(@Param("user") User user);

    /** Project lookup scoped to ownership — only the owner can manage membership. */
    Optional<Project> findByIdAndOwner(Long id, User owner);
}
