import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITodo extends Document {
    title: string;
    startTime: string;
    endTime: string;
    date?: Date; // Storing as Date object
    description?: string;
    isCompleted: boolean;
    createdAt: Date;
}

const TodoSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a text for this todo.'],
        maxlength: [60, 'Text cannot be more than 60 characters'],
    },
    startTime: {
        type: String,
        required: [true, 'Please provide a start time for this todo.'],
    },
    endTime: {
        type: String,
        required: [true, 'Please provide an end time for this todo.'],
    },
    date: {
        type: Date,
        set: (v: string | Date) => new Date(v),
    },

    description: {
        type: String,
        required: false,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Todo: Model<ITodo> = mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);

export default Todo;
