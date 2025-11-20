# Todo App

A mobile-first Todo application built with Next.js, ShadCN UI, Tailwind CSS, and MongoDB.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **State Management / Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js
- MongoDB (Local or Atlas)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Set up environment variables:
    Create a `.env.local` file in the root directory and add your MongoDB URI:
    ```env
    MONGODB_URI=mongodb://localhost:27017/todo-app
    ```
4.  Run the development server:
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── app
│   ├── api
│   │   └── todos
│   │       ├── [id]
│   │       │   └── route.ts   # PUT, DELETE
│   │       └── route.ts       # GET, POST
│   ├── home
│   │   └── page.tsx           # Home Page (Dashboard)
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout with Providers
│   └── page.tsx               # Onboarding Page
├── components
│   ├── ui                     # ShadCN UI components
│   └── providers.tsx          # QueryClientProvider
├── hooks
│   ├── useDebounce.ts         # Debounce hook
│   └── useTodos.ts            # React Query hooks for Todos
├── lib
│   ├── axios.ts               # Axios instance configuration
│   ├── mongodb.ts             # MongoDB connection helper
│   └── utils.ts               # Utility functions
├── models
│   └── Todo.ts                # Mongoose Todo model
├── public
│   └── assets                 # Static assets
├── services
│   └── todo.service.ts        # API service functions
├── types
│   └── index.ts               # TypeScript interfaces
└── README.md
```

## API Documentation

The API is built using Next.js Route Handlers.

### Todos

#### Get All Todos
- **URL**: `/api/todos`
- **Method**: `GET`
- **Response**:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "...",
          "text": "Buy groceries",
          "isCompleted": false,
          "createdAt": "..."
        }
      ]
    }
    ```

#### Create Todo
- **URL**: `/api/todos`
- **Method**: `POST`
- **Body**:
    ```json
    {
      "text": "New Task"
    }
    ```
- **Response**:
    ```json
    {
      "success": true,
      "data": { ... }
    }
    ```

#### Update Todo
- **URL**: `/api/todos/:id`
- **Method**: `PUT`
- **Body**:
    ```json
    {
      "isCompleted": true
    }
    ```
- **Response**:
    ```json
    {
      "success": true,
      "data": { ... }
    }
    ```

#### Delete Todo
- **URL**: `/api/todos/:id`
- **Method**: `DELETE`
- **Response**:
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
