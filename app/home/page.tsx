'use client'
import { Input } from "@/components/ui/input";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Plus, XSquare } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AddTodoForm } from "@/components/forms/add-todo";
import { Button } from "@/components/ui/button";
import { useGetTodos } from "@/hooks/useTodos";

export default function HomePage() {
    const [open, setOpen] = useState(false);
    const { data: todos, isLoading, error } = useGetTodos();

    return (
        <main className="min-h-screen w-screen bg-slate-50 px-6 py-8 pb-24 relative">
            {/* Search Bar */}
            <div className="relative mb-8">
                <Input
                    type="text"
                    placeholder="Search for a task"
                    className="pl-4 pr-10 py-6 rounded-none bg-white border-slate-100 shadow-sm"
                />
                <Image
                    src={`/assets/search.svg`}
                    alt="Search"
                    width={24}
                    height={24}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                />
            </div>

            {/* Date Strip (Static Mockup) */}
            <div className="flex justify-between items-center mb-8 overflow-x-auto no-scrollbar">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                    const date = 9 + i;
                    const isActive = day === 'Wed';
                    return (
                        <div key={day} className={`flex flex-col items-center gap-2 min-w-[40px] ${isActive ? '' : 'opacity-50'}`}>
                            <span className="text-xs text-slate-500">{day}</span>
                            <div className={`h-10 w-8 flex items-center justify-center rounded-lg text-sm font-medium ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-700'}`}>
                                {date}
                                {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></div>}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="p-4 rounded-none shadow-sm bg-blue-50 border-none flex flex-col gap-2">
                    <div className="h-8 w-8 bg-blue-200 flex items-center justify-center text-blue-600">
                        <CheckSquare className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium">Task Complete</p>
                        <p className="text-xl font-bold text-slate-900">50 <span className="text-xs font-normal text-slate-400">This Week</span></p>
                    </div>
                </Card>
                <Card className="p-4 rounded-none shadow-sm bg-red-50 border-none flex flex-col gap-2">
                    <div className="h-8 w-8 bg-red-200 flex items-center justify-center text-red-500">
                        <XSquare className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium">Task Pending</p>
                        <p className="text-xl font-bold text-slate-900">08 <span className="text-xs font-normal text-slate-400">This Week</span></p>
                    </div>
                </Card>
            </div>

            {/* Weekly Progress */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Weekly Progress</h2>
                <div className="h-[24px] w-full bg-blue-100 overflow-hidden flex">
                    <div className="h-full bg-blue-800 w-[65%]">
                        {/* You can add a percentage label here if needed */}
                    </div>
                </div>
            </div>

            {/* Tasks Today */}
            <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Tasks Today</h2>
                    <button className="text-sm text-blue-600 font-medium">View All</button>
                </div>

                <div className="space-y-4">
                    {todos?.map((todo) => (
                        <div key={todo._id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-50">
                            <div className="flex items-center gap-3">
                                <Checkbox checked={todo.isCompleted} className="h-5 w-5 border-2 border-blue-400 data-[state=checked]:bg-blue-400 data-[state=checked]:text-white rounded" />
                                <span className={`text-sm font-medium ${todo.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                    {todo.title}
                                </span>
                            </div>
                            <div className="flex gap-3 text-slate-300">
                                <Image src={`/assets/trash.svg`} alt="Trash" width={24} height={24} className="h-5 w-5 cursor-pointer hover:text-red-400 transition-colors" />
                                <Image src={`/assets/edit.svg`} alt="Edit" width={24} height={24} className="h-5 w-5 cursor-pointer hover:text-blue-400 transition-colors" />
                            </div>
                        </div>
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
                <DialogContent className="p-6 fixed inset-x-0 bottom-0 top-[35%] rounded-none translate-0 min-w-screen">
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <AddTodoForm />
                </DialogContent>
            </Dialog>
        </main>
    );
}
