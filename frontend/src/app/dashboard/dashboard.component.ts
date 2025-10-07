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
  filterDueDateFrom: string = '';
  filterDueDateTo: string = '';
  // Additional UI state
  viewMode: 'board' | 'calendar' = 'board';
  showOverdueOnly = false;
  calendarDays: Array<{date: string | null, label: string, tasks?: Task[]}> = [];
  calendarPrefillDate?: string;
  todayIso: string = '';
  // Calendar modal state
  selectedDateIso?: string | null;
  selectedDateTasks: Task[] = [];
  showDateModal = false;
  // Calendar navigation state (visible month/year)
  calendarYear: number;
  calendarMonth: number; // 0-based month index

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

  // Upcoming tasks (next 4 excluding completed; only TODO or IN_PROGRESS)
  upcomingTasks: Task[] = [];
  upcomingTasksLeft: Task[] = [];
  upcomingTasksRight: Task[] = [];
  upcomingOverallProgress = 0; // percent

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {
    this.user$ = this.authService.user$;
    const today = new Date();
    this.calendarYear = today.getFullYear();
    this.calendarMonth = today.getMonth();
    this.todayIso = this.formatDateLocal(today);
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
        this.generateCalendar();
        this.computeUpcoming();
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
    this.calendarPrefillDate = undefined;
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

    // Show only overdue if toggled
    if (this.showOverdueOnly) {
      filtered = filtered.filter(t => t.overdue === true);
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
    // Update calendar when filters change
    this.generateCalendar(filtered);
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  clearFilters() {
    this.filterPriority = 'ALL';
    this.filterDueDateFrom = '';
    this.filterDueDateTo = '';
    this.sortBy = 'RECENT';
    this.applyFilters();
  }

  setView(view: 'board' | 'calendar') {
    this.viewMode = view;
    if (view === 'calendar') {
      this.generateCalendar();
    }
  }

  // Generate a simple month calendar for the currently selected month/year
  generateCalendar(sourceTasks?: Task[]) {
    const tasksToUse = sourceTasks ?? this.filteredTasks ?? this.tasks;
    const year = this.calendarYear;
    const month = this.calendarMonth;

    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{date: string | null, label: string, tasks?: Task[]}> = [];

    // leading empty slots
    for (let i = 0; i < startDay; i++) {
      days.push({ date: null, label: '' });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = this.formatDateLocal(dateObj);
      const tasksOnDay = tasksToUse.filter(t => t.dueDate && this.formatDateLocal(t.dueDate) === dateStr);
      days.push({ date: dateStr, label: String(d), tasks: tasksOnDay });
    }

    this.calendarDays = days;
  }

  // Calendar navigation helpers
  prevMonth() {
    if (this.calendarMonth === 0) {
      this.calendarMonth = 11;
      this.calendarYear -= 1;
    } else {
      this.calendarMonth -= 1;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.calendarMonth === 11) {
      this.calendarMonth = 0;
      this.calendarYear += 1;
    } else {
      this.calendarMonth += 1;
    }
    this.generateCalendar();
  }

  goToToday() {
    const today = new Date();
    this.calendarYear = today.getFullYear();
    this.calendarMonth = today.getMonth();
    this.generateCalendar();
  }

  onCalendarDayClick(dateIso: string | null) {
    if (!dateIso) return;
    // Prepare and open calendar day modal showing tasks for the selected date
    this.selectedDateIso = dateIso;
    this.selectedDateTasks = this.tasks.filter(t => t.dueDate && this.formatDateLocal(t.dueDate) === dateIso);
    this.showDateModal = true;
  }

  // Compute upcoming 6 tasks excluding completed and split into left/right columns
  private computeUpcoming() {
    const upcoming = this.tasks
      .filter(t => t.dueDate && (t.status === Status.TODO || t.status === Status.IN_PROGRESS))
      .map(t => ({ t, due: new Date(t.dueDate!) }))
      .sort((a,b) => a.due.getTime() - b.due.getTime())
      .slice(0, 4)
      .map(x => x.t);

    this.upcomingTasks = upcoming;
    this.upcomingTasksLeft = upcoming.slice(0, 2);
    this.upcomingTasksRight = upcoming.slice(2, 4);

    // Progress: percent of upcoming tasks that are IN_PROGRESS
    if (upcoming.length === 0) {
      this.upcomingOverallProgress = 0;
    } else {
      const inProg = upcoming.filter(t => t.status === Status.IN_PROGRESS).length;
      this.upcomingOverallProgress = Math.round((inProg / upcoming.length) * 100);
    }
  }

  closeDateModal() {
    this.showDateModal = false;
    this.selectedDateIso = undefined;
    this.selectedDateTasks = [];
  }

  openCreateForSelectedDate() {
    if (!this.selectedDateIso) return;
    this.editingTask = undefined;
    this.calendarPrefillDate = this.selectedDateIso;
    this.showTaskForm = true;
    this.closeDateModal();
  }

  openEditFromModal(task: Task) {
    this.editingTask = task;
    this.showTaskForm = true;
    this.closeDateModal();
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

  // Helper to format a Date or date string into local YYYY-MM-DD without timezone shifts
  private formatDateLocal(dateLike: Date | string): string {
    const d = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
    // create a date using local year/month/day
    const year = d.getFullYear();
    const month = d.getMonth() + 1; // 1..12
    const day = d.getDate();
    const mm = month < 10 ? `0${month}` : `${month}`;
    const dd = day < 10 ? `0${day}` : `${day}`;
    return `${year}-${mm}-${dd}`;
  }

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