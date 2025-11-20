import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '@/services/todo.service';

/**
 * Custom hook to fetch all todos.
 * @returns An object containing `todos` (the fetched data), `isLoading` status, and `error` object, consistent with `useQuery`'s return.
 */
export function useGetTodos() {
    return useQuery({
        queryKey: ['todos'],
        queryFn: todoService.getAll,
    });
}

/**
 * Custom hook to add a new todo.
 * Invalidates the 'todos' query cache on success to refetch the list.
 * @returns A React Query mutation object for adding todos.
 */
export function useAddTodo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: todoService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}

/**
 * Custom hook to update an existing todo's completion status.
 * Invalidates the 'todos' query cache on success to refetch the list.
 * @returns A React Query mutation object for updating todos.
 */
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

/**
 * Custom hook to delete a todo.
 * Invalidates the 'todos' query cache on success to refetch the list.
 * @returns A React Query mutation object for deleting todos.
 */
export function useDeleteTodo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: todoService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}
