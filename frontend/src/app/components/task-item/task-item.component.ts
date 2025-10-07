import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, Status, Priority } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html'
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() updateStatus = new EventEmitter<{id: number, status: Status}>();

  Status = Status;
  Priority = Priority;

  onEdit() {
    this.editTask.emit(this.task);
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.deleteTask.emit(this.task.id);
    }
  }

  onStatusChange(status: Status) {
    this.updateStatus.emit({ id: this.task.id, status });
  }

  getTaskCardClasses(): string {
    const baseClasses = 'bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 p-4';
    const priorityClasses = this.getPriorityBorderClass();
    const overdue = this.isOverdue() ? 'ring-2 ring-red-200 border-red-300' : 'border-gray-200';
    
    return `${baseClasses} ${priorityClasses} ${overdue}`;
  }

  getPriorityBorderClass(): string {
    switch (this.task.priority) {
      case Priority.HIGH: return 'border-l-4 border-l-red-500';
      case Priority.MEDIUM: return 'border-l-4 border-l-yellow-500';
      case Priority.LOW: return 'border-l-4 border-l-green-500';
      default: return 'border-l-4 border-l-gray-300';
    }
  }

  getPriorityClasses(): string {
    switch (this.task.priority) {
      case Priority.HIGH: return 'bg-red-100 text-red-800';
      case Priority.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case Priority.LOW: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityDotClasses(): string {
    switch (this.task.priority) {
      case Priority.HIGH: return 'bg-red-500';
      case Priority.MEDIUM: return 'bg-yellow-500';
      case Priority.LOW: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  getPriorityClass(): string {
    switch (this.task.priority) {
      case Priority.HIGH: return 'priority-high';
      case Priority.MEDIUM: return 'priority-medium';
      case Priority.LOW: return 'priority-low';
      default: return '';
    }
  }

  getStatusClass(): string {
    switch (this.task.status) {
      case Status.TODO: return 'status-todo';
      case Status.IN_PROGRESS: return 'status-in-progress';
      case Status.DONE: return 'status-done';
      default: return '';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  isOverdue(): boolean {
    return this.task.overdue && this.task.status !== Status.DONE;
  }
}