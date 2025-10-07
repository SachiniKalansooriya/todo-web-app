package com.example.demo.dto;

import com.example.demo.entity.Task;

import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Task.Priority priority;
    private Task.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean overdue;

    // Constructors
    public TaskResponse() {}

    public TaskResponse(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.dueDate = task.getDueDate();
        this.priority = task.getPriority();
        this.status = task.getStatus();
        this.createdAt = task.getCreatedAt();
        this.updatedAt = task.getUpdatedAt();
        this.overdue = task.getDueDate() != null && task.getDueDate().isBefore(LocalDateTime.now()) && task.getStatus() != Task.Status.DONE;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean isOverdue() { return overdue; }
    public void setOverdue(boolean overdue) { this.overdue = overdue; }
}