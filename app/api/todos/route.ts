import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function GET() {
    try {
        await dbConnect();
        const todos = await Todo.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: todos });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch todos' }, { status: 400 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        if (body.date) {
            body.date = new Date(body.date);
        }
        const todo = await Todo.create(body);
        return NextResponse.json({ success: true, data: todo }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create todo' }, { status: 400 });
    }
}
