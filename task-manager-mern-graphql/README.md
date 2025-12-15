# GraphQL Todo Manager - Setup & Learning Guide

## 📋 Project Overview

This is a comprehensive GraphQL application demonstrating **enterprise-level patterns** including:

- **Query Complexity**: Filtering, sorting, pagination, aggregations
- **Mutations**: CRUD operations, bulk updates
- **Relationships**: User-Todo-Comment relationships with nested queries
- **Connection Pattern**: Cursor-based pagination (Relay specification)
- **Error Handling**: Structured GraphQL errors
- **Type Safety**: Strong typing with enums and input types
- **Field Resolvers**: Computed fields and relationships

## 🚀 Setup Instructions

### Server Setup

```bash

# Install dependencies
npm install

# Start server
npm run dev
```

Server will run on `http://localhost:4000/graphql`

### Client Setup

```bash
# Install dependencies
npm install

# Start server
npm run dev
```

Client will run on `http://localhost:5173`

## 📚 GraphQL Concepts Covered

### 1. Query Types

#### Simple Query
```graphql
query {
  users {
    id
    name
    email
  }
}
```

#### Query with Arguments
```graphql
query {
  user(id: "1") {
    name
    email
  }
}
```

#### Query with Variables
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    name
    todos {
      title
      completed
    }
  }
}
```
Variables: `{ "id": "1" }`

### 2. Filtering & Sorting

```graphql
query {
  todos(
    filter: {
      completed: false
      priority: HIGH
      userId: "1"
    }
    sort: {
      field: DUE_DATE
      direction: ASC
    }
  ) {
    edges {
      node {
        title
        dueDate
      }
    }
  }
}
```

### 3. Pagination (Connection Pattern)

```graphql
query {
  todos(pagination: { first: 5 }) {
    edges {
      node {
        id
        title
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

**Next Page:**
```graphql
query {
  todos(pagination: { first: 5, after: "LAST_CURSOR" }) {
    edges {
      node {
        title
      }
    }
  }
}
```

### 4. Nested Queries

```graphql
query {
  users {
    name
    todos {
      title
      comments {
        text
        user {
          name
        }
      }
    }
  }
}
```

### 5. Aggregations

```graphql
query {
  todoStats(userId: "1") {
    total
    completed
    pending
    overdue
    byPriority {
      priority
      count
    }
  }
}
```

### 6. Mutations

#### Create
```graphql
mutation {
  createTodo(input: {
    title: "Learn GraphQL"
    userId: "1"
    priority: HIGH
    dueDate: "2024-12-31"
  }) {
    id
    title
    user {
      name
    }
  }
}
```

#### Update
```graphql
mutation {
  updateTodo(
    id: "1"
    input: { completed: true }
  ) {
    id
    completed
  }
}
```

#### Bulk Operations
```graphql
mutation {
  bulkUpdateTodos(
    ids: ["1", "2", "3"]
    input: { priority: URGENT }
  ) {
    id
    priority
  }
}
```

### 7. Aliases & Fragments

#### Aliases
```graphql
query {
  highPriorityTodos: todos(filter: { priority: HIGH }) {
    totalCount
  }
  lowPriorityTodos: todos(filter: { priority: LOW }) {
    totalCount
  }
}
```

#### Fragments
```graphql
fragment TodoDetails on Todo {
  id
  title
  completed
  priority
  dueDate
}

query {
  todos {
    edges {
      node {
        ...TodoDetails
        user {
          name
        }
      }
    }
  }
}
```

### 8. Error Handling

Server returns structured errors:
```json
{
  "errors": [
    {
      "message": "User not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

## 🎯 Enterprise Patterns Demonstrated

### 1. **Input Types**
Structured inputs for mutations prevent parameter explosion:
```graphql
input CreateTodoInput {
  title: String!
  userId: ID!
  priority: Priority = MEDIUM
  dueDate: String
}
```

### 2. **Enums**
Type-safe constants:
```graphql
enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

### 3. **Connection Pattern**
Industry-standard pagination:
```graphql
type TodoConnection {
  edges: [TodoEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```

### 4. **Field Resolvers**
Computed fields and lazy loading:
```javascript
Todo: {
  user: (todo) => users.find(u => u.id === todo.userId),
  commentCount: (todo) => comments.filter(c => c.todoId === todo.id).length
}
```

### 5. **N+1 Problem Solution**
Use DataLoader in production (not shown for simplicity):
```javascript
// DataLoader batches and caches requests
const userLoader = new DataLoader(ids => batchGetUsers(ids));
```

### 6. **Context Pattern**
Authentication and authorization:
```javascript
context: async ({ req }) => {
  const token = req.headers.authorization;
  const user = await validateToken(token);
  return { user, loaders };
}
```

## 🔍 Testing Queries

### Using Apollo Server Playground

Visit `http://localhost:4000/graphql` and try:

```graphql
# Get all users with their todo counts
query {
  users {
    name
    todoCount
    todos(completed: false) {
      title
      priority
    }
  }
}

# Create a new todo
mutation {
  createTodo(input: {
    title: "Master GraphQL"
    userId: "1"
    priority: HIGH
  }) {
    id
    title
  }
}

# Search todos
query {
  searchTodos(query: "GraphQL") {
    title
    user {
      name
    }
  }
}

# Get statistics
query {
  todoStats {
    total
    completed
    pending
    byPriority {
      priority
      count
    }
  }
}
```

## 🎨 Client Features

The React client demonstrates:

- **Apollo Client** setup and configuration
- **useQuery** hook for data fetching
- **useMutation** hook for updates
- **refetchQueries** for cache updates
- **Optimistic UI** patterns
- **Loading and error states**
- **Real-time updates** with refetch
- **Bulk operations** with selections
- **Filtering and sorting** UI

## 🚀 Advanced Features to Add

1. **Subscriptions** - Real-time updates
2. **DataLoader** - Batch and cache DB queries
3. **Authentication** - JWT middleware
4. **Pagination** - Implement cursor-based properly
5. **File Upload** - Handle multipart requests
6. **Rate Limiting** - Protect against abuse
7. **Query Complexity** - Limit expensive queries
8. **Caching** - Redis for field-level caching
9. **Testing** - Unit tests for resolvers
10. **Documentation** - Auto-generate from schema

## 📖 Resources

- [GraphQL Official Docs](https://graphql.org/learn/)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [Relay Cursor Connections Spec](https://relay.dev/graphql/connections.htm)

## 🎓 Learning Path

1. **Basics**: Understand queries, mutations, types
2. **Resolvers**: Learn field resolvers and context
3. **Relationships**: Master nested queries
4. **Pagination**: Implement cursor-based pagination
5. **Performance**: DataLoader and caching
6. **Security**: Authentication and authorization
7. **Production**: Monitoring, logging, rate limiting
