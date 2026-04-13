package com.taskflow.api.repository;

import com.taskflow.api.model.Task;
import com.taskflow.api.model.User;
import com.taskflow.api.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Data access layer for Task entities.
 * Every query method filters by owner to enforce user-scoped data isolation —
 * a user can never access another user's tasks through this repository.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /** All tasks belonging to a specific owner, ordered by position within status. */
    List<Task> findByOwnerOrderByPositionAsc(User owner);

    /** Tasks filtered by owner and status (for single-column queries). */
    List<Task> findByOwnerAndStatusOrderByPositionAsc(User owner, TaskStatus status);

    /** Tasks belonging to a specific project, scoped to the owner. */
    List<Task> findByOwnerAndProjectIdOrderByPositionAsc(User owner, Long projectId);

    /** Single task lookup scoped to the owner — prevents cross-user access. */
    Optional<Task> findByIdAndOwner(Long id, User owner);

    /** Count tasks by status for a specific owner (used in analytics). */
    long countByOwnerAndStatus(User owner, TaskStatus status);

    /** Count overdue tasks: status is not DONE and dueDate is before today. */
    @Query("SELECT COUNT(t) FROM Task t WHERE t.owner = :owner AND t.status <> 'DONE' AND t.dueDate < :today")
    long countOverdueByOwner(@Param("owner") User owner, @Param("today") LocalDate today);

    /** Tasks completed within a date range for trend analytics. */
    @Query("SELECT t FROM Task t WHERE t.owner = :owner AND t.completedAt BETWEEN :start AND :end ORDER BY t.completedAt DESC")
    List<Task> findCompletedBetween(
            @Param("owner") User owner,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    /** Total task count for a specific owner. */
    long countByOwner(User owner);
}
