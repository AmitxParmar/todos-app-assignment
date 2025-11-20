import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '@/services/todo.service';

export function useGetTodos() {
    return useQuery({
        queryKey: ['todos'],
        queryFn: todoService.getAll,
    });
}

export function useAddTodo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: todoService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}

export function useUpdateTodo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
            todoService.update(id, isCompleted),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}

export function useDeleteTodo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: todoService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}
