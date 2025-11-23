import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const cursor = searchParams.get('cursor');
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        // Build the MongoDB query
        let mongoQuery: any = {};

        // Add search filter if query exists
        if (query) {
            mongoQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        // Add cursor filter for pagination
        if (cursor) {
            mongoQuery._id = { $lt: cursor };
        }

        // Fetch todos with limit + 1 to check if there are more
        const todos = await Todo.find(mongoQuery)
            .sort({ createdAt: -1, _id: -1 })
            .limit(limit + 1)
            .lean();

        // Check if there are more results
        const hasMore = todos.length > limit;
        const paginatedTodos = hasMore ? todos.slice(0, limit) : todos;
        const nextCursor = hasMore && paginatedTodos.length > 0
            ? paginatedTodos[paginatedTodos.length - 1]._id.toString()
            : null;

        return NextResponse.json({
            success: true,
            data: paginatedTodos,
            nextCursor,
            hasMore
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch todos' }, { status: 400 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();



        if (body.date) {
            // Handle YYYY-MM-DD string from frontend
            if (typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
                const [year, month, day] = body.date.split('-').map(Number);
                body.date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            } else {
                // Fallback for other formats (though frontend should send YYYY-MM-DD)
                const parsedDate = new Date(body.date);
                body.date = new Date(Date.UTC(
                    parsedDate.getUTCFullYear(),
                    parsedDate.getUTCMonth(),
                    parsedDate.getUTCDate(),
                    0, 0, 0, 0
                ));
            }

        }

        const todo = await Todo.create(body);
        return NextResponse.json({ success: true, data: todo }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create todo' }, { status: 400 });
    }
}
