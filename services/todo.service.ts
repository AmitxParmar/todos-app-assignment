import axiosInstance from '@/lib/axios';
import { Todo, ApiResponse, Dashboard, PaginatedResponse, SearchParams } from '@/types';

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

    update: async (id: string, updates: Partial<Todo>): Promise<Todo> => {
        const response = await axiosInstance.put<ApiResponse<Todo>>(`/todos/${id}`, updates);
        return response.data.data!;
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/todos/${id}`);
    },

    search: async (params: SearchParams): Promise<PaginatedResponse<Todo>> => {
        const queryParams = new URLSearchParams();
        if (params.q) queryParams.append('q', params.q);
        if (params.cursor) queryParams.append('cursor', params.cursor);
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const response = await axiosInstance.get<PaginatedResponse<Todo>>(`/todos?${queryParams.toString()}`);
        return response.data;
    },
};
