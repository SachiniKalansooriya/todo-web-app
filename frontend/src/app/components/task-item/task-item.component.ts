import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, Status, Priority } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
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