import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { todoService } from '@/services/todo.service';
import { Dashboard, Todo } from '@/types';

/**
 * Custom hook to fetch todos with optional search and infinite scroll support.
 * @param options - Configuration options
 * @param options.searchQuery - Optional search query string
 * @param options.limit - Number of items per page (default: 10 for search, 100 for regular)
 * @param options.enabled - Whether the query should run (default: true)
 * @returns An infinite query object with pages of todos
 */
export function useGetTodos(options?: {
    searchQuery?: string;
    limit?: number;
    enabled?: boolean;
}) {
    const { searchQuery = '', limit, enabled = true } = options || {};

    // Use higher limit for non-search queries to get all todos at once
    const itemsPerPage = limit ?? (searchQuery ? 10 : 100);

    return useInfiniteQuery({
        queryKey: searchQuery ? ['todos', 'search', searchQuery] : ['todos'],
        queryFn: ({ pageParam }) => {
            return todoService.search({
                q: searchQuery,
                cursor: pageParam,
                limit: itemsPerPage,
            });
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        initialPageParam: undefined as string | undefined,
        enabled,
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
 * Custom hook to update an existing todo.
 * Invalidates the 'todos' and 'dashboard' query caches on success to refetch the lists.
 * @returns A React Query mutation object for updating todos.
 */
export function useUpdateTodo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: {
            id: string; updates: Partial<Todo
            >
        }) =>
            todoService.update(id, updates),
        onMutate: async ({ id, updates }) => {
            // Cancel any outgoing refetches for both 'todos' and 'dashboard' queries
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            await queryClient.cancelQueries({ queryKey: ['dashboard'] });

            // Snapshot the previous values
            const previousTodos = queryClient.getQueryData(['todos']);
            const previousDashboard = queryClient.getQueryData<Dashboard>(['dashboard']);

            // Optimistically update the 'todos' infinite query cache
            queryClient.setQueriesData({ queryKey: ['todos'] }, (old: any) => {
                if (!old?.pages) return old;

                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.map((todo: Todo) =>
                            todo._id === id ? { ...todo, ...updates } : todo
                        )
                    }))
                };
            });

            // Optimistically update the 'dashboard' cache if relevant
            queryClient.setQueryData(['dashboard'], (oldDashboardData: Dashboard | undefined) => {
                if (!oldDashboardData || !oldDashboardData.todosForToday) {
                    return oldDashboardData; // Cannot update if no data or no todosForToday
                }

                let { todosForToday, completedTasks, pendingTasks } = oldDashboardData;
                let originalIsCompleted: boolean | undefined;
                let todoFoundInDashboard = false;

                const updatedTodosForToday = todosForToday.map((todo: Todo) => {
                    if (todo._id === id) {
                        todoFoundInDashboard = true;
                        originalIsCompleted = todo.isCompleted;
                        return { ...todo, ...updates };
                    }
                    return todo;
                });

                // Only update counts if the todo was found in dashboard's todosForToday
                // and if the completion status was part of the update and actually changed
                if (todoFoundInDashboard && updates.isCompleted !== undefined && originalIsCompleted !== updates.isCompleted) {
                    if (updates.isCompleted) { // Was pending, now completed
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

export function useDeleteTodo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: todoService.delete,
        onMutate: async (todoId: string) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            await queryClient.cancelQueries({ queryKey: ['dashboard'] });

            const previousTodos = queryClient.getQueryData(['todos']);
            const previousDashboard = queryClient.getQueryData<Dashboard>(['dashboard']);

            // Optimistically remove from infinite query cache
            queryClient.setQueriesData({ queryKey: ['todos'] }, (old: any) => {
                if (!old?.pages) return old;

                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.filter((todo: Todo) => todo._id !== todoId)
                    }))
                };
            });

            queryClient.setQueryData(['dashboard'], (oldDashboardData: Dashboard | undefined) => {
                if (!oldDashboardData) {
                    return oldDashboardData;
                }

                let { todosForToday, completedTasks, pendingTasks } = oldDashboardData;
                const deletedTodo = todosForToday.find(todo => todo._id === todoId);

                if (deletedTodo) {
                    todosForToday = todosForToday.filter(todo => todo._id !== todoId);

                    if (deletedTodo.isCompleted) {
                        completedTasks = (completedTasks || 0) - 1;
                    } else {
                        pendingTasks = (pendingTasks || 0) - 1;
                    }
                }

                const totalTasks = (pendingTasks || 0) + (completedTasks || 0);
                const progressPercent = totalTasks > 0 ? ((completedTasks || 0) / totalTasks) * 100 : 0;

                return {
                    ...oldDashboardData,
                    todosForToday,
                    completedTasks,
                    pendingTasks,
                    progressPercent,
                };
            });

            return { previousTodos, previousDashboard };
        },
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['todos'], context?.previousTodos);
            queryClient.setQueryData(['dashboard'], context?.previousDashboard);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}
