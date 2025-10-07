// filepath: d:\todo-webapp\backend\demo\src\main\java\com\example\demo\repository\TaskRepository.java
package com.example.demo.repository;

import com.example.demo.entity.Task;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByUserOrderByCreatedAtDesc(User user);
    
    List<Task> findByUserAndStatusOrderByCreatedAtDesc(User user, Task.Status status);
    
    List<Task> findByUserAndPriorityOrderByCreatedAtDesc(User user, Task.Priority priority);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.dueDate BETWEEN :start AND :end ORDER BY t.dueDate ASC")
    List<Task> findByUserAndDueDateBetween(@Param("user") User user, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.dueDate < :now AND t.status != 'DONE' ORDER BY t.dueDate ASC")
    List<Task> findOverdueTasks(@Param("user") User user, @Param("now") LocalDateTime now);
    
    long countByUserAndStatus(User user, Task.Status status);
}