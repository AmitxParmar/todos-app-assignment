# Todo App

A modern, mobile-first Todo application with search functionality, infinite scroll, and real-time updates. Built with Next.js, ShadCN UI, Tailwind CSS, and MongoDB.

## ✨ Features

- 📱 **Mobile-First Design** - Optimized for mobile devices with responsive layout
- 🔍 **Advanced Search** - Real-time search with debouncing and infinite scroll
- ⚡ **Cursor Pagination** - Efficient MongoDB cursor-based pagination
- 🎯 **Dashboard View** - Today's tasks with progress tracking
- ✅ **Task Management** - Create, edit, delete, and mark tasks as complete
- 🚀 **Optimistic Updates** - Instant UI updates with automatic rollback on error
- 📊 **Progress Tracking** - Visual progress indicators and statistics
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (Local or Atlas)
- npm/pnpm/yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todo-app
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/todo-app
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
.
├── app/
│   ├── api/
│   │   └── todos/
│   │       ├── [id]/
│   │       │   └── route.ts          # PUT, DELETE endpoints
│   │       ├── dashboard/
│   │       │   └── route.ts          # Dashboard data endpoint
│   │       └── route.ts              # GET (with search & pagination), POST
│   ├── home/
│   │   └── page.tsx                  # Dashboard/Home page
│   ├── search/
│   │   └── page.tsx                  # Search page with infinite scroll
│   ├── globals.css                   # Global styles & Tailwind config
│   ├── layout.tsx                    # Root layout with providers
│   └── page.tsx                      # Onboarding/Landing page
├── components/
│   ├── common/
│   │   └── todo.tsx                  # Todo item component
│   ├── forms/
│   │   └── add-edit-todo.tsx         # Todo form (create/edit)
│   ├── ui/                           # ShadCN UI components
│   ├── providers.tsx                 # QueryClientProvider wrapper
│   └── todo-stats.tsx                # Dashboard statistics component
├── hooks/
│   ├── useDebounce.ts                # Debounce hook for search
│   └── useTodos.ts                   # React Query hooks (CRUD + search)
├── lib/
│   ├── axios.ts                      # Axios instance with base config
│   ├── mongodb.ts                    # MongoDB connection singleton
│   └── utils.ts                      # Utility functions (cn, etc.)
├── models/
│   └── Todo.ts                       # Mongoose Todo schema & model
├── public/
│   └── assets/                       # Icons and static assets
├── services/
│   └── todo.service.ts               # API service layer
├── types/
│   └── index.ts                      # TypeScript interfaces & types
└── README.md
```

## 🔌 API Documentation

### Base URL
All API routes are prefixed with `/api`

### Endpoints

#### 1. Get Todos (with Search & Pagination)
- **URL**: `/api/todos`
- **Method**: `GET`
- **Query Parameters**:
  - `q` (optional): Search query string
  - `cursor` (optional): Cursor for pagination (last todo _id)
  - `limit` (optional): Number of items per page (default: 10)
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Buy groceries",
        "startTime": "09:00",
        "endTime": "10:00",
        "date": "2025-11-21T00:00:00.000Z",
        "description": "Get milk, eggs, bread",
        "isCompleted": false,
        "createdAt": "2025-11-20T10:30:00.000Z"
      }
    ],
    "nextCursor": "507f1f77bcf86cd799439012",
    "hasMore": true
  }
  ```

#### 2. Get Dashboard Data
- **URL**: `/api/todos/dashboard`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "todosForToday": [...],
      "completedTasks": 5,
      "pendingTasks": 3,
      "progressPercent": 62.5
    }
  }
  ```

#### 3. Create Todo
- **URL**: `/api/todos`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "title": "New Task",
    "startTime": "14:00",
    "endTime": "15:00",
    "date": "2025-11-21T00:00:00.000Z",
    "description": "Task description",
    "isCompleted": false
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

#### 4. Update Todo
- **URL**: `/api/todos/:id`
- **Method**: `PUT`
- **Body** (all fields optional):
  ```json
  {
    "title": "Updated Task",
    "isCompleted": true,
    "description": "Updated description"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

#### 5. Delete Todo
- **URL**: `/api/todos/:id`
- **Method**: `DELETE`
- **Response**:
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

## 🎯 Key Features Explained

### 1. Search with Infinite Scroll
- Debounced search input (300ms delay)
- Cursor-based pagination for efficient data loading
- Automatic loading on scroll
- Separate cache for each search query

### 2. Optimistic Updates
- Instant UI updates when creating, editing, or deleting todos
- Automatic rollback on API errors
- Seamless user experience

### 3. Smart Caching
- TanStack Query manages all data fetching and caching
- Automatic cache invalidation on mutations
- Background refetching for fresh data

### 4. Form Management
- React Hook Form with Zod validation
- Auto-reset on todo prop changes for edit mode
- Date picker, time picker, and textarea support

## 🧩 Custom Hooks

### `useGetTodos(options?)`
Unified hook for fetching todos with optional search and pagination.

```typescript
// Fetch all todos
const { data } = useGetTodos();
const todos = data?.pages.flatMap(page => page.data) ?? [];

// Search with infinite scroll
const { data, fetchNextPage, hasNextPage } = useGetTodos({ 
  searchQuery: 'meeting' 
});
```

### `useDashboard()`
Fetch today's todos and statistics.

```typescript
const { data: dashboard } = useDashboard();
// dashboard.todosForToday, completedTasks, pendingTasks, progressPercent
```

### `useAddTodo()`
Create a new todo with optimistic updates.

```typescript
const { mutate: addTodo } = useAddTodo();
addTodo({ title: 'New Task', ... });
```

### `useUpdateTodo()`
Update a todo with optimistic updates.

```typescript
const { mutate: updateTodo } = useUpdateTodo();
updateTodo({ id: '...', updates: { isCompleted: true } });
```

### `useDeleteTodo()`
Delete a todo with optimistic updates.

```typescript
const { mutate: deleteTodo } = useDeleteTodo();
deleteTodo(todoId);
```

## 🎨 UI Components

Built with ShadCN UI components:
- Button
- Input
- Textarea
- Dialog
- Calendar
- Checkbox
- Form (with React Hook Form integration)
- Popover
- Card

## 📝 Todo Schema

```typescript
{
  title: string;           // Required, max 60 chars
  startTime: string;       // Required, format: "HH:mm"
  endTime: string;         // Required, format: "HH:mm"
  date: Date;              // Optional
  description: string;     // Optional
  isCompleted: boolean;    // Default: false
  createdAt: Date;         // Auto-generated
}
```

## 🔧 Configuration

### Tailwind Custom Colors
```css
--custom-blue: #3B82F6
```

### MongoDB Connection
- Singleton pattern for connection reuse
- Automatic reconnection on failure
- Connection pooling

### Axios Configuration
- Base URL: `/api`
- Automatic error handling
- Request/response interceptors

## 🚦 Development

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js and MongoDB
