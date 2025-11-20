import axiosInstance from '@/lib/axios';
import { Todo, ApiResponse } from '@/types';

export const todoService = {
    getAll: async (): Promise<Todo[]> => {
        const response = await axiosInstance.get<ApiResponse<Todo[]>>('/todos');
        return response.data.data || [];
    },

    create: async (text: string): Promise<Todo> => {
        const response = await axiosInstance.post<ApiResponse<Todo>>('/todos', { text });
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
