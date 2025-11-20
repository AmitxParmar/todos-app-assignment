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
            body.date = new Date(body.date);
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
