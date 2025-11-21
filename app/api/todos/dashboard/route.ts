import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function GET() {
    try {
        await dbConnect();

        // Get today's date at midnight in local timezone
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get tomorrow's date at midnight
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        console.log('Dashboard query - Today:', today, 'Tomorrow:', tomorrow);

        // Find todos for today using Date objects
        const todosForToday = await Todo.find({
            date: {
                $gte: today,
                $lt: tomorrow,
            },
        }).sort({ createdAt: -1 }).lean();

        console.log('Found todos for today:', todosForToday.length);

        // Count completed and total tasks for today only
        const completedTasksToday = todosForToday.filter(todo => todo.isCompleted).length;
        const totalTasksToday = todosForToday.length;
        const pendingTasksToday = totalTasksToday - completedTasksToday;

        const progressPercent = totalTasksToday === 0 ? 0 : (completedTasksToday / totalTasksToday) * 100;

        return NextResponse.json({
            success: true,
            data: {
                todosForToday,
                completedTasks: completedTasksToday,
                pendingTasks: pendingTasksToday,
                progressPercent,
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch dashboard data'
        }, { status: 500 });
    }
}
