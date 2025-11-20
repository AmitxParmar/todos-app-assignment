import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITodo extends Document {
    text: string;
    isCompleted: boolean;
    createdAt: Date;
}

const TodoSchema: Schema = new Schema({
    text: {
        type: String,
        required: [true, 'Please provide a text for this todo.'],
        maxlength: [60, 'Text cannot be more than 60 characters'],
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
