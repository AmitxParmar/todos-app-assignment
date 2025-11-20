export interface Todo {
    _id: string;
    text: string;
    isCompleted: boolean;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
