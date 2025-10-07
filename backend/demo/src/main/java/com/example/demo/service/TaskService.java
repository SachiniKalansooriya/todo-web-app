package com.example.demo.service;

import com.example.demo.dto.TaskRequest;
import com.example.demo.dto.TaskResponse;
import com.example.demo.entity.Task;
import com.example.demo.model.User;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TaskResponse> getAllTasksByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return taskRepository.findByUserOrderByCreatedAtDesc(user)
            .stream()
            .map(TaskResponse::new)
            .collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByStatus(String userEmail, Task.Status status) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return taskRepository.findByUserAndStatusOrderByCreatedAtDesc(user, status)
            .stream()
            .map(TaskResponse::new)
            .collect(Collectors.toList());
    }

    public TaskResponse createTask(String userEmail, TaskRequest taskRequest) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDueDate(taskRequest.getDueDate());
        task.setPriority(taskRequest.getPriority());
        task.setStatus(taskRequest.getStatus() != null ? taskRequest.getStatus() : Task.Status.TODO);
        task.setUser(user);

        Task savedTask = taskRepository.save(task);
        return new TaskResponse(savedTask);
    }

    public TaskResponse updateTask(String userEmail, Long taskId, TaskRequest taskRequest) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this task");
        }

        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDueDate(taskRequest.getDueDate());
        task.setPriority(taskRequest.getPriority());
        if (taskRequest.getStatus() != null) {
            task.setStatus(taskRequest.getStatus());
        }

        Task updatedTask = taskRepository.save(task);
        return new TaskResponse(updatedTask);
    }

    public TaskResponse updateTaskStatus(String userEmail, Long taskId, Task.Status status) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this task");
        }

        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);
        return new TaskResponse(updatedTask);
    }

    public void deleteTask(String userEmail, Long taskId) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this task");
        }

        taskRepository.delete(task);
    }

    public TaskResponse getTaskById(String userEmail, Long taskId) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to access this task");
        }

        return new TaskResponse(task);
    }

    public List<TaskResponse> getOverdueTasks(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return taskRepository.findOverdueTasks(user, LocalDateTime.now())
            .stream()
            .map(TaskResponse::new)
            .collect(Collectors.toList());
    }
}