import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();



        if (body.date) {
            // Handle YYYY-MM-DD string from frontend
            if (typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
                const [year, month, day] = body.date.split('-').map(Number);
                body.date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            } else {
                // Fallback for other formats
                const parsedDate = new Date(body.date);
                body.date = new Date(Date.UTC(
                    parsedDate.getUTCFullYear(),
                    parsedDate.getUTCMonth(),
                    parsedDate.getUTCDate(),
                    0, 0, 0, 0
                ));
            }

        }

        const todo = await Todo.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!todo) {
            return NextResponse.json({ success: false, error: 'Todo not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: todo });
    } catch (error) {
        console.error('PUT /api/todos/[id] error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update todo' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const deletedTodo = await Todo.deleteOne({ _id: id });
        if (!deletedTodo) {
            return NextResponse.json({ success: false, error: 'Todo not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete todo' }, { status: 400 });
    }
}
