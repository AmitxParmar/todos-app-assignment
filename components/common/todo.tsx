import Image from "next/image"
import { Checkbox } from "../ui/checkbox"
import { type Todo } from "@/types"
import { useUpdateTodo } from "@/hooks/useTodos"

const Todo = ({ todo }: { todo: Todo }) => {
    const { mutate: updateTodo } = useUpdateTodo();

    const handleCheckedChange = (checked: boolean) => {
        updateTodo({ id: todo._id, isCompleted: checked })
    }

    return (
        <div className="flex items-center justify-between py-5 border-b">
            <div className="flex items-center gap-3">
                <Checkbox onCheckedChange={handleCheckedChange} checked={todo?.isCompleted} className="h-5 w-5 border border-custom-blue rounded-none data-[state=checked]:bg-white data-[state=checked]:text-custom-blue" />
                <span className={`text-sm font-medium ${todo.isCompleted ? 'line-through' : ''}`}>
                    {todo.title}
                </span>
            </div>
            <div className="flex gap-3 text-slate-300">
                <Image src={`/assets/trash.svg`} alt="Trash" width={24} height={24} className="h-5 w-5 cursor-pointer hover:text-red-400 transition-colors" />
                <Image src={`/assets/edit.svg`} alt="Edit" width={24} height={24} className="h-5 w-5 cursor-pointer hover:text-blue-400 transition-colors" />
            </div>
        </div>
    )
}

export default Todo;