import { CheckSquare, XSquare } from "lucide-react"
import { Card } from "./ui/card"
import { Dashboard } from "@/types";
import { Progress } from "./ui/progress";
import Image from "next/image";

const TodoStats = ({ stats }: { stats: Omit<Dashboard, "todosForToday"> | undefined }) => {
    const pad = (n: number | undefined) => n?.toString().padStart(2, "0");

    return (
        <>
            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="p-4 h-[96px] w-[162px] rounded-none bg-[#EFF2FF] border-none flex flex-row gap-2">
                    <Image src="/assets/completed.jpg" alt="completed" width={28} height={28} className="shrink-0 size-[28px] object-contain" />
                    <div className="py px-0.5">
                        <p className="text-nowrap text-xs leading-[28px] font-medium">Task Complete</p>
                        <p className="text-xl font-semibold text-slate-900">{pad(stats?.completedTasks)} <span className="text-[10px] font-normal text-[#6E7180]">This Week</span></p>
                    </div>
                </Card>
                <Card className="p-4 h-[96px] w-[162px] rounded-none bg-[#FFE6E7] border-none flex flex-row gap-2">
                    <Image src="/assets/pending.jpg" alt="pending" width={28} height={28} className="shrink-0 size-[28px] object-contain" />
                    <div>
                        <p className="text-nowrap text-xs leading-[28px] font-medium">Task Pending</p>
                        <p className="text-xl font-bold text-slate-900">{pad(stats?.pendingTasks)} <span className="text-[10px] font-normal text-[#6E7180]">This Week</span></p>
                    </div>
                </Card>
            </div>

            {/* Weekly Progress */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Weekly Progress</h2>
                <Progress className="h-[24px] rounded-none border-2 bg-[#DADAFF]  overflow-hidden flex" value={stats?.progressPercent || 0} />

            </div >
        </>
    )
}

export default TodoStats;