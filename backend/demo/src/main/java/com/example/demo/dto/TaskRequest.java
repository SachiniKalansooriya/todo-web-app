package com.example.demo.dto;

import com.example.demo.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private LocalDateTime dueDate;
    
    @NotNull(message = "Priority is required")
    private Task.Priority priority;
    
    private Task.Status status;

    // Constructors
    public TaskRequest() {}

    public TaskRequest(String title, String description, LocalDateTime dueDate, Task.Priority priority, Task.Status status) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public Task.Priority getPriority() { return priority; }
    public void setPriority(Task.Priority priority) { this.priority = priority; }

    public Task.Status getStatus() { return status; }
    public void setStatus(Task.Status status) { this.status = status; }
}