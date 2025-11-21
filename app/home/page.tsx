'use client'
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AddEditTodoForm } from "@/components/forms/add-edit-todo";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useTodos";
import Todo from "@/components/common/todo";
import TodoStats from "@/components/todo-stats";

export default function HomePage() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { data: dashboard, isLoading, error } = useDashboard();


    if (error) return <div>{error.message}</div>

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 size={40} className="animate-spin" /></div>

    return (
        <main className="min-h-screen w-screen px-6 py-8 pb-24 relative overflow-x-hidden">
            {/* Search Bar */}
            <div className="relative mb-8 cursor-pointer" onClick={() => router.push('/search')}>
                <Input
                    type="text"
                    placeholder="Search for a task"
                    className="w-full pl-4 pr-10 py-6 placeholder:text-xs placeholder:font-light rounded-sm bg-white border-[#E6E6E6] cursor-pointer"
                    readOnly
                />
                <Image
                    src={`/assets/search.svg`}
                    alt="Search"
                    width={24}
                    height={24}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
            </div>

            {/* Date Strip (Static Mockup) */}
            <div className="flex justify-between items-center mb-8 overflow-x-auto no-scrollbar">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                    const date = 9 + i;
                    const isActive = day === 'Wed';
                    return (
                        <div
                            key={day}
                            className={`flex flex-col items-center min-w-[40px] p-2 transition-colors duration-200
                                ${isActive ? 'bg-custom-blue text-white shadow-lg shadow-custom-blue/30' : 'opacity-50'}
                            `}
                        >
                            <span className={`text-xs ${isActive ? 'text-white' : 'text-slate-500'}`}>{day}</span>
                            <div className={`h-10 w-8 flex items-center justify-center rounded-lg text-sm font-medium ${isActive ? 'text-white' : 'text-slate-700'}`}>
                                {date}
                                {isActive && <div className="absolute -bottom-1 w-1 h-1"></div>}
                            </div>
                        </div>
                    )
                })}
            </div>

            <TodoStats stats={dashboard} />

            {/* Tasks Today */}
            <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Tasks Today</h2>
                    <Button variant="ghost" onClick={() => router.push('/search')} className="text-sm text-blue-600 font-medium">View All</Button>
                </div>

                {/* Task list */}
                <div className="space-y-4">
                    {dashboard?.todosForToday?.map((todo) => (
                        <Todo key={todo._id} todo={todo} />
                    ))}
                </div>
            </div>

            {/* FAB and Dialog */}
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogTrigger asChild>
                    <Button
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 size-[76px] rounded-full bg-custom-blue hover:bg-blue-700 flex items-center justify-center"
                    >
                        <Plus className="size-8 text-white" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-4 fixed mx-auto inset-x-0 bottom-0 top-[35%] rounded-none translate-0 w-screen max-w-full">

                    <DialogTitle className="mb-8">Add New Task</DialogTitle>

                    <AddEditTodoForm onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </main>
    );
}
