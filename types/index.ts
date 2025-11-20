export interface Todo {
    _id: string;
    title: string;
    date: string;
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
