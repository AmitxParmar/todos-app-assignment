import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get('date');

        let today: Date;
        let tomorrow: Date;

        if (dateParam) {
            // Parse the YYYY-MM-DD string as UTC midnight
            // This ensures consistent behavior regardless of server timezone
            const [year, month, day] = dateParam.split('-').map(Number);
            today = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            tomorrow = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, 0));
        } else {
            // Fallback: Get today's date at midnight in UTC
            const now = new Date();
            today = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                0, 0, 0, 0
            ));
            tomorrow = new Date(today);
            tomorrow.setUTCDate(today.getUTCDate() + 1);
        }

        console.log('Dashboard query - Date param:', dateParam, 'Today:', today.toISOString(), 'Tomorrow:', tomorrow.toISOString());

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
