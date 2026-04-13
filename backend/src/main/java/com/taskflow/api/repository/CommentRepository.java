package com.taskflow.api.repository;

import com.taskflow.api.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Data access layer for Comment entities.
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTaskIdOrderByCreatedAtDesc(Long taskId);

    /** Recent comments across all tasks owned by a specific user (for activity feed). */
    @Query("SELECT c FROM Comment c WHERE c.task.owner.id = :ownerId ORDER BY c.createdAt DESC")
    List<Comment> findRecentByOwnerId(@Param("ownerId") Long ownerId);
}
