import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskRequest, Priority, Status } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  @Input() task?: Task;
  @Input() isVisible = false;
  @Input() prefillDate?: string;
  @Output() saveTask = new EventEmitter<TaskRequest>();
  @Output() cancel = new EventEmitter<void>();

  Priority = Priority;
  Status = Status;

  formData: TaskRequest = {
    title: '',
    description: '',
    dueDate: '',
    priority: Priority.MEDIUM,
    status: Status.TODO
  };

  ngOnInit() {
    if (this.task) {
      this.formData = {
        title: this.task.title,
        description: this.task.description || '',
        dueDate: this.task.dueDate ? this.formatDateForInput(this.task.dueDate) : '',
        priority: this.task.priority,
        status: this.task.status
      };
    }
  }

  ngOnChanges() {
    if (this.task) {
      this.formData = {
        title: this.task.title,
        description: this.task.description || '',
        dueDate: this.task.dueDate ? this.formatDateForInput(this.task.dueDate) : '',
        priority: this.task.priority,
        status: this.task.status
      };
    } else if (this.isVisible && this.prefillDate) {
      // If opening for new task and a prefill date is present, use it
      this.formData.dueDate = this.formatDateForInput(this.prefillDate);
    } else {
      this.resetForm();
    }
  }

  onSubmit() {
    if (this.formData.title.trim()) {
      const taskRequest: TaskRequest = {
        ...this.formData,
        dueDate: this.formData.dueDate || undefined
      };
      this.saveTask.emit(taskRequest);
      this.resetForm();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      title: '',
      description: '',
      dueDate: '',
      priority: Priority.MEDIUM,
      status: Status.TODO
    };
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  get isEditMode(): boolean {
    return !!this.task;
  }
}