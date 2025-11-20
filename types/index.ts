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

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
}

export interface SearchParams {
    q?: string;
    cursor?: string;
    limit?: number;
}
