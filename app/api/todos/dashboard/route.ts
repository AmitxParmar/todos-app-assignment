import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function GET() {
    try {
        await dbConnect();

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setUTCDate(today.getUTCDate() + 1);

        // Use Date objects for comparison
        const todosForToday = await Todo.find({
            date: {
                $gte: today,
                $lt: tomorrow,
            },
        });

        const completedTasks = await Todo.countDocuments({ isCompleted: true });
        const totalTasks = await Todo.countDocuments({});
        const pendingTasks = totalTasks - completedTasks;

        const progressPercent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

        return NextResponse.json({
            success: true,
            data: {
                todosForToday,
                completedTasks,
                pendingTasks,
                progressPercent,
            }
        });
    } catch (error) {

        return NextResponse.json({ message: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
