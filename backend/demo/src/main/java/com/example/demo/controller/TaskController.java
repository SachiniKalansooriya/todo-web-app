package com.example.demo.controller;

import com.example.demo.dto.TaskRequest;
import com.example.demo.dto.TaskResponse;
import com.example.demo.entity.Task;
import com.example.demo.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(Authentication authentication) {
        String userEmail = authentication.getName();
        List<TaskResponse> tasks = taskService.getAllTasksByUser(userEmail);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskResponse>> getTasksByStatus(
            @PathVariable Task.Status status,
            Authentication authentication) {
        String userEmail = authentication.getName();
        List<TaskResponse> tasks = taskService.getTasksByStatus(userEmail, status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        TaskResponse task = taskService.getTaskById(userEmail, id);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest taskRequest,
            Authentication authentication) {
        String userEmail = authentication.getName();
        TaskResponse createdTask = taskService.createTask(userEmail, taskRequest);
        return ResponseEntity.ok(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest taskRequest,
            Authentication authentication) {
        String userEmail = authentication.getName();
        TaskResponse updatedTask = taskService.updateTask(userEmail, id, taskRequest);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @RequestParam Task.Status status,
            Authentication authentication) {
        String userEmail = authentication.getName();
        TaskResponse updatedTask = taskService.updateTaskStatus(userEmail, id, status);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        taskService.deleteTask(userEmail, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<TaskResponse>> getOverdueTasks(Authentication authentication) {
        String userEmail = authentication.getName();
        List<TaskResponse> overdueTasks = taskService.getOverdueTasks(userEmail);
        return ResponseEntity.ok(overdueTasks);
    }
}