import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Task, TaskRequest, Status, Priority, TaskStats } from '../models/task.model';
import { TaskListComponent } from '../components/task-list/task-list.component';
import { TaskFormComponent } from '../components/task-form/task-form.component';

interface User {
  id: number;
  email: string;
  name: string;
  profilePicture: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskListComponent, TaskFormComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  user$: Observable<User | null>;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  error = '';
  
  // Form and modal state
  showTaskForm = false;
  editingTask?: Task;
  
  // Filter and view state
  currentFilter: 'all' | Status = 'all';
  searchTerm = '';
  // Advanced filters
  filterPriority: Priority | 'ALL' = 'ALL';
  filterCategory: string = '';
  filterDueDateFrom: string = '';
  filterDueDateTo: string = '';

  // Sorting
  sortBy: 'RECENT' | 'DEADLINE' | 'PRIORITY' = 'RECENT';
  
  // Stats
  taskStats: TaskStats = {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0
  };

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    // Ensure user data is loaded
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe();
    }
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.error = '';
    
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tasks';
        this.loading = false;
        console.error('Error loading tasks:', err);
      }
    });
  }

  openTaskForm() {
    this.editingTask = undefined;
    this.showTaskForm = true;
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.showTaskForm = true;
  }

  saveTask(taskRequest: TaskRequest) {
    if (this.editingTask) {
      // Update existing task
      this.taskService.updateTask(this.editingTask.id, taskRequest).subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskForm();
        },
        error: (err) => {
          this.error = 'Failed to update task';
          console.error('Error updating task:', err);
        }
      });
    } else {
      // Create new task
      this.taskService.createTask(taskRequest).subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskForm();
        },
        error: (err) => {
          this.error = 'Failed to create task';
          console.error('Error creating task:', err);
        }
      });
    }
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => {
        this.error = 'Failed to delete task';
        console.error('Error deleting task:', err);
      }
    });
  }

  updateTaskStatus(data: {id: number, status: Status}) {
    this.taskService.updateTaskStatus(data.id, data.status).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => {
        this.error = 'Failed to update task status';
        console.error('Error updating task status:', err);
      }
    });
  }

  closeTaskForm() {
    this.showTaskForm = false;
    this.editingTask = undefined;
  }

  setFilter(filter: 'all' | Status) {
    this.currentFilter = filter;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.tasks];
    
    // Apply status filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(task => task.status === this.currentFilter);
    }
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) || 
        (task.description && task.description.toLowerCase().includes(term))
      );
    }

    // Apply priority filter
    if (this.filterPriority !== 'ALL') {
      filtered = filtered.filter(t => t.priority === this.filterPriority);
    }

    // Apply category filter
    if (this.filterCategory) {
      const cat = this.filterCategory.toLowerCase();
      filtered = filtered.filter(t => (t.category || '').toLowerCase().includes(cat));
    }

    // Apply due date range
    if (this.filterDueDateFrom) {
      const from = new Date(this.filterDueDateFrom);
      filtered = filtered.filter(t => t.dueDate && new Date(t.dueDate) >= from);
    }
    if (this.filterDueDateTo) {
      const to = new Date(this.filterDueDateTo);
      filtered = filtered.filter(t => t.dueDate && new Date(t.dueDate) <= to);
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'RECENT':
        filtered.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'DEADLINE':
        filtered.sort((a,b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case 'PRIORITY':
        const rank = (p: Priority) => p === Priority.HIGH ? 0 : p === Priority.MEDIUM ? 1 : 2;
        filtered.sort((a,b) => rank(a.priority) - rank(b.priority));
        break;
    }
    
    this.filteredTasks = filtered;
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  calculateStats() {
    this.taskStats = {
      total: this.tasks.length,
      todo: this.tasks.filter(t => t.status === Status.TODO).length,
      inProgress: this.tasks.filter(t => t.status === Status.IN_PROGRESS).length,
      done: this.tasks.filter(t => t.status === Status.DONE).length,
      overdue: this.tasks.filter(t => t.overdue).length
    };
  }

  get Priority() { return Priority; }
  get Status() { return Status; }

  getEmptyMessage(): string {
    if (this.searchTerm) {
      return `No tasks found matching "${this.searchTerm}"`;
    }
    
    switch (this.currentFilter) {
      case Status.TODO:
        return 'No tasks to do. Great job!';
      case Status.IN_PROGRESS:
        return 'No tasks in progress';
      case Status.DONE:
        return 'No completed tasks yet';
      default:
        return 'No tasks found. Create your first task to get started!';
    }
  }
}