export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Analytics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  dailyCompletions: Record<string, number>;
  statusDistribution: Record<string, number>;
  recentActivity: ActivityEntry[];
}

export interface ActivityEntry {
  id: string;
  type: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  timestamp: string;
}
