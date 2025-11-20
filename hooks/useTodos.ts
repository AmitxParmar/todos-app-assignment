import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '@/services/todo.service';
import { Dashboard } from '@/types';

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
 * Custom hook to fetch today's todos and analytics (eg. completed & pending tasks, and progress percentage).
 * @returns An object containing `todosForToday` (an array of today's todos), `completedTasks` (number of completed tasks), `pendingTasks` (number of pending tasks), `progressPercent` (percentage of progress), `isLoading` status, and `error` object, consistent with `useQuery`'s return.
 */
export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: todoService.getDashboard,
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
        onSuccess: (newTodo) => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            queryClient.setQueryData(['dashboard'], (oldDashboardData: any) => {
                if (!oldDashboardData) {
                    return {
                        todosForToday: [newTodo],
                        completedTasks: newTodo.isCompleted ? 1 : 0,
                        pendingTasks: newTodo.isCompleted ? 0 : 1,
                        progressPercent: newTodo.isCompleted ? 100 : 0,
                    };
                }

                const updatedTodosForToday = [...(oldDashboardData.todosForToday || []), newTodo];
                let updatedPendingTasks = oldDashboardData.pendingTasks || 0;
                let updatedCompletedTasks = oldDashboardData.completedTasks || 0;

                if (newTodo.isCompleted) {
                    updatedCompletedTasks++;
                } else {
                    updatedPendingTasks++;
                }

                const totalTasks = updatedPendingTasks + updatedCompletedTasks;
                const updatedProgressPercent = totalTasks > 0 ? (updatedCompletedTasks / totalTasks) * 100 : 0;

                return {
                    ...oldDashboardData,
                    todosForToday: updatedTodosForToday,
                    pendingTasks: updatedPendingTasks,
                    completedTasks: updatedCompletedTasks,
                    progressPercent: updatedProgressPercent,
                };
            });
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
        onMutate: async ({ id, isCompleted: newIsCompleted }) => {
            // Cancel any outgoing refetches for both 'todos' and 'dashboard' queries
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            await queryClient.cancelQueries({ queryKey: ['dashboard'] });

            // Snapshot the previous values
            const previousTodos = queryClient.getQueryData(['todos']);
            const previousDashboard = queryClient.getQueryData(['dashboard']);

            // Optimistically update the 'todos' cache
            queryClient.setQueryData(['todos'], (old: any[] | undefined) => {
                if (!old) return old;
                return old.map(todo =>
                    todo.id === id ? { ...todo, isCompleted: newIsCompleted } : todo
                );
            });

            // Optimistically update the 'dashboard' cache
            queryClient.setQueryData(['dashboard'], (oldDashboardData: Dashboard) => {
                if (!oldDashboardData || !oldDashboardData.todosForToday) {
                    return oldDashboardData; // Cannot update if no data or no todosForToday
                }

                let { todosForToday, completedTasks, pendingTasks } = oldDashboardData;
                let originalIsCompleted: boolean | undefined;

                const updatedTodosForToday = todosForToday.map((todo: any) => {
                    if (todo.id === id) {
                        originalIsCompleted = todo.isCompleted;
                        return { ...todo, isCompleted: newIsCompleted };
                    }
                    return todo;
                });

                // Only update counts if the completion status actually changed
                if (originalIsCompleted !== undefined && originalIsCompleted !== newIsCompleted) {
                    if (newIsCompleted) { // Was pending, now completed
                        pendingTasks = (pendingTasks || 0) - 1;
                        completedTasks = (completedTasks || 0) + 1;
                    } else { // Was completed, now pending
                        completedTasks = (completedTasks || 0) - 1;
                        pendingTasks = (pendingTasks || 0) + 1;
                    }
                }

                const totalTasks = (pendingTasks || 0) + (completedTasks || 0);
                const progressPercent = totalTasks > 0 ? ((completedTasks || 0) / totalTasks) * 100 : 0;

                return {
                    ...oldDashboardData,
                    todosForToday: updatedTodosForToday,
                    completedTasks,
                    pendingTasks,
                    progressPercent,
                };
            });

            // Return a context object with the snapshotted values
            return { previousTodos, previousDashboard };
        },
        onError: (err, newTodo, context) => {
            // Roll back to the previous values on error
            queryClient.setQueryData(['todos'], context?.previousTodos);
            queryClient.setQueryData(['dashboard'], context?.previousDashboard);
        },
        onSettled: () => {
            // Invalidate and refetch after the mutation is settled (either success or error)
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
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
