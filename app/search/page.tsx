'use client'

import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetTodos } from "@/hooks/useTodos";
import Todo from "@/components/common/todo";
import Image from "next/image";
import { ArrowLeft, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { PaginatedResponse, Todo as TodoType } from "@/types";

export default function SearchPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const observerTarget = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useGetTodos({ searchQuery: debouncedSearchQuery });

    // Flatten all pages into a single array of todos
    const todos = data?.pages.flatMap((page: PaginatedResponse<TodoType>) => page.data) ?? [];

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <main className="min-h-screen w-screen px-6 py-8 pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="p-0 h-auto hover:bg-transparent"
                >
                    <ArrowLeft className="h-6 w-6 text-slate-700" />
                </Button>
                <h1 className="text-2xl font-bold text-slate-900">Search Tasks</h1>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
                <Input
                    type="text"
                    placeholder="Search for a task"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-4 pr-10 py-6 placeholder:text-xs placeholder:font-light rounded-sm bg-white border-[#E6E6E6]"
                    autoFocus
                />
                <Image
                    src={`/assets/search.svg`}
                    alt="Search"
                    width={24}
                    height={24}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                />
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-custom-blue" />
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="text-center py-20">
                    <p className="text-red-500">Error: {error?.message || 'Failed to load todos'}</p>
                </div>
            )}

            {/* Results */}
            {!isLoading && !isError && (
                <>
                    {/* Results Count */}
                    {searchQuery && (
                        <div className="mb-4">
                            <p className="text-sm text-slate-600">
                                {todos.length === 0
                                    ? 'No results found'
                                    : `Found ${todos.length} result${todos.length !== 1 ? 's' : ''}`
                                }
                            </p>
                        </div>
                    )}

                    {/* Todo List */}
                    {todos.length > 0 ? (
                        <div className="space-y-0">
                            {todos.map((todo: TodoType) => (
                                <Todo key={todo._id} todo={todo} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Search className="h-16 w-16 text-slate-300 mb-4" />
                            <p className="text-slate-500 text-center">
                                {searchQuery
                                    ? 'No tasks found matching your search'
                                    : 'Start typing to search for tasks'
                                }
                            </p>
                        </div>
                    )}

                    {/* Loading More Indicator */}
                    {isFetchingNextPage && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 size={32} className="animate-spin text-custom-blue" />
                        </div>
                    )}

                    {/* Intersection Observer Target */}
                    <div ref={observerTarget} className="h-4" />
                </>
            )}
        </main>
    );
}
