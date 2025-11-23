import axiosInstance from '@/lib/axios';
import { Todo, ApiResponse, Dashboard, PaginatedResponse, SearchParams } from '@/types';

export const todoService = {
    getDashboard: async (): Promise<Dashboard> => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;


        const response = await axiosInstance.get<ApiResponse<Dashboard>>(`/todos/dashboard?date=${dateStr}`);

        return response?.data.data || ({} as Dashboard);
    },

    getAll: async (): Promise<Todo[]> => {
        const response = await axiosInstance.get<ApiResponse<Todo[]>>('/todos');
        return response.data.data || [];
    },

    create: async (todoData: Partial<Todo>): Promise<Todo> => {
        // Format date to YYYY-MM-DD if present to avoid timezone issues
        const payload = { ...todoData };
        if (payload.date instanceof Date) {
            const date = payload.date;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            (payload as any).date = `${year}-${month}-${day}`;
        }


        const response = await axiosInstance.post<ApiResponse<Todo>>('/todos', payload);
        return response.data.data!;
    },

    update: async (id: string, updates: Partial<Todo>): Promise<Todo> => {
        // Format date to YYYY-MM-DD if present to avoid timezone issues
        const payload = { ...updates };
        if (payload.date instanceof Date) {
            const date = payload.date;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            (payload as any).date = `${year}-${month}-${day}`;
        }

        const response = await axiosInstance.put<ApiResponse<Todo>>(`/todos/${id}`, payload);
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
