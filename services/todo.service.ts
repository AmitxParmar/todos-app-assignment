import axiosInstance from '@/lib/axios';
import { Todo, ApiResponse, Dashboard } from '@/types';

export const todoService = {
    getDashboard: async (): Promise<Dashboard> => {
        const response = await axiosInstance.get<ApiResponse<Dashboard>>('/todos/dashboard');

        return response?.data.data || ({} as Dashboard);
    },

    getAll: async (): Promise<Todo[]> => {
        const response = await axiosInstance.get<ApiResponse<Todo[]>>('/todos');
        return response.data.data || [];
    },

    create: async (todoData: Partial<Todo>): Promise<Todo> => {
        const response = await axiosInstance.post<ApiResponse<Todo>>('/todos', todoData);
        return response.data.data!;
    },

    update: async (id: string, isCompleted: boolean): Promise<Todo> => {
        const response = await axiosInstance.put<ApiResponse<Todo>>(`/todos/${id}`, { isCompleted });
        return response.data.data!;
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/todos/${id}`);
    },
};
