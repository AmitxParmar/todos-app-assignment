"use client";

import Image from "next/image"
import { Checkbox } from "../ui/checkbox"
import { type Todo } from "@/types"
import { useUpdateTodo, useDeleteTodo } from "@/hooks/useTodos"
import { Button } from "../ui/button"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { AddEditTodoForm } from "@/components/forms/add-edit-todo"

const Todo = ({ todo }: { todo: Todo }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const { mutate: updateTodo } = useUpdateTodo();
    const { mutate: deleteTodo } = useDeleteTodo();

    const handleCheckedChange = (checked: boolean) => {
        updateTodo({ id: todo._id, updates: { isCompleted: checked } })
    }

    const handleDelete = () => {
        deleteTodo(todo._id);
    }

    return (
        <>
            <div className="flex items-center justify-between py-5 border-b">
                <div className="flex items-center gap-3">
                    <Checkbox onCheckedChange={handleCheckedChange} checked={todo?.isCompleted} className="h-5 w-5 border border-custom-blue rounded-none data-[state=checked]:bg-white data-[state=checked]:text-custom-blue" />
                    <span className={`text-sm font-medium ${todo.isCompleted ? 'line-through' : ''}`}>
                        {todo.title}
                    </span>
                </div>
                <div className="flex gap-3 text-slate-300">
                    <Button variant="ghost" size="icon" onClick={handleDelete} className="bg-none border-none p-0 h-auto">
                        <Image src={`/assets/trash.svg`} alt="Trash" width={24} height={24} className="h-5 w-5 cursor-pointer hover:text-red-400 transition-colors" />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={() => setOpenEdit(true)} className="bg-none border-none p-0 h-auto">
                        <Image src={`/assets/edit.svg`} alt="Edit" width={24} height={24} className="h-5 w-5 cursor-pointer hover:text-blue-400 transition-colors" />
                    </Button>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="p-6 fixed inset-x-0 bottom-0 top-[35%] rounded-none translate-0 min-w-screen">
                    <DialogTitle className="mb-8">Edit Task</DialogTitle>
                    <AddEditTodoForm
                        todo={{
                            id: todo._id,
                            title: todo.title,
                            startTime: todo.startTime,
                            endTime: todo.endTime,
                            date: todo.date,
                            description: todo.description,
                            isCompleted: todo.isCompleted
                        }}
                        onSuccess={() => setOpenEdit(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Todo;
