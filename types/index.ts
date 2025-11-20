export interface Todo {
    _id: string;
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    description: string;
    isCompleted: boolean;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface Dashboard {
    todosForToday: Todo[];
    completedTasks: number;
    pendingTasks: number;
    progressPercent: number;
}
