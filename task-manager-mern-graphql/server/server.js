const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { GraphQLError } = require("graphql");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();



// ========================================MONGODB==============================
// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/graphql-todo";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["ADMIN", "USER", "GUEST"], default: "USER" },
  createdAt: { type: Date, default: Date.now },
});

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
    default: "MEDIUM",
  },
  dueDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  todoId: { type: mongoose.Schema.Types.ObjectId, ref: "Todo", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// MongoDB Models
const User = mongoose.model("User", userSchema);
const Todo = mongoose.model("Todo", todoSchema);
const Comment = mongoose.model("Comment", commentSchema);

// ==========================GRAPHQL===============================================

// Type Definitions
const typeDefs = `
  type Query {
    # User queries
    users(limit: Int, offset: Int, role: UserRole): [User!]!
    user(id: ID!): User
    me: User
    
    # Todo queries with filtering, sorting, pagination
    todos(
      filter: TodoFilter
      sort: TodoSort
      pagination: Pagination
    ): TodoConnection!
    
    todo(id: ID!): Todo
    
    # Search across todos
    searchTodos(query: String!): [Todo!]!
    
    # Aggregate queries
    todoStats(userId: ID): TodoStats!
    
    # Comments
    comments(todoId: ID!): [Comment!]!
  }

  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): DeleteResponse!
    
    # Todo mutations
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(id: ID!, input: UpdateTodoInput!): Todo!
    deleteTodo(id: ID!): DeleteResponse!
    toggleTodo(id: ID!): Todo!
    bulkUpdateTodos(ids: [ID!]!, input: UpdateTodoInput!): [Todo!]!
    
    # Comment mutations
    addComment(input: AddCommentInput!): Comment!
    deleteComment(id: ID!): DeleteResponse!
  }

  type Subscription {
    todoAdded(userId: ID): Todo!
    todoUpdated(id: ID!): Todo!
    todoDeleted: ID!
  }

  # User types
  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    createdAt: String!
    todos(completed: Boolean): [Todo!]!
    todoCount: Int!
  }

  enum UserRole {
    ADMIN
    USER
    GUEST
  }

  # Todo types
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    priority: Priority!
    dueDate: String
    createdAt: String!
    user: User!
    comments: [Comment!]!
    commentCount: Int!
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  # Comment type
  type Comment {
    id: ID!
    text: String!
    todo: Todo!
    user: User!
    createdAt: String!
  }

  # Connection pattern for pagination
  type TodoConnection {
    edges: [TodoEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type TodoEdge {
    node: Todo!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  # Statistics
  type TodoStats {
    total: Int!
    completed: Int!
    pending: Int!
    byPriority: [PriorityCount!]!
    overdue: Int!
  }

  type PriorityCount {
    priority: Priority!
    count: Int!
  }

  # Input types
  input CreateUserInput {
    name: String!
    email: String!
    role: UserRole = USER
  }

  input UpdateUserInput {
    name: String
    email: String
    role: UserRole
  }

  input CreateTodoInput {
    title: String!
    userId: ID!
    priority: Priority = MEDIUM
    dueDate: String
  }

  input UpdateTodoInput {
    title: String
    completed: Boolean
    priority: Priority
    dueDate: String
  }

  input AddCommentInput {
    text: String!
    todoId: ID!
    userId: ID!
  }

  input TodoFilter {
    completed: Boolean
    priority: Priority
    userId: ID
    search: String
  }

  input TodoSort {
    field: TodoSortField!
    direction: SortDirection!
  }

  enum TodoSortField {
    TITLE
    CREATED_AT
    DUE_DATE
    PRIORITY
  }

  enum SortDirection {
    ASC
    DESC
  }

  input Pagination {
    first: Int
    after: String
    last: Int
    before: String
  }

  type DeleteResponse {
    success: Boolean!
    message: String
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: async (_, { limit = 10, offset = 0, role }) => {
      const query = role ? { role } : {};
      return await User.find(query).skip(offset).limit(limit);
    },

    user: async (_, { id }) => {
      const user = await User.findById(id);
      if (!user)
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      return user;
    },

    me: (_, __, { user }) => {
      if (!user)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      return user;
    },

    todos: async (_, { filter = {}, sort, pagination = {} }) => {
      // Build MongoDB query
      const query = {};

      if (filter.completed !== undefined) {
        query.completed = filter.completed;
      }
      if (filter.priority) {
        query.priority = filter.priority;
      }
      if (filter.userId) {
        query.userId = filter.userId;
      }
      if (filter.search) {
        query.title = { $regex: filter.search, $options: "i" };
      }

      // Build sort
      let sortObj = {};
      if (sort) {
        const sortField = {
          TITLE: "title",
          CREATED_AT: "createdAt",
          DUE_DATE: "dueDate",
          PRIORITY: "priority",
        }[sort.field];
        sortObj[sortField] = sort.direction === "ASC" ? 1 : -1;
      } else {
        sortObj.createdAt = -1;
      }

      // Get total count
      const totalCount = await Todo.countDocuments(query);

      // Apply pagination
      const { first = 10, after } = pagination;

      if (after) {
        query._id = { $gt: after };
      }

      const todos = await Todo.find(query)
        .sort(sortObj)
        .limit(first + 1);

      const hasNextPage = todos.length > first;
      const paginatedTodos = hasNextPage ? todos.slice(0, first) : todos;

      return {
        edges: paginatedTodos.map((todo) => ({
          node: todo,
          cursor: todo._id.toString(),
        })),
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          startCursor: paginatedTodos[0]?._id.toString(),
          endCursor: paginatedTodos[paginatedTodos.length - 1]?._id.toString(),
        },
        totalCount,
      };
    },

    todo: async (_, { id }) => {
      const todo = await Todo.findById(id);
      if (!todo)
        throw new GraphQLError("Todo not found", {
          extensions: { code: "NOT_FOUND" },
        });
      return todo;
    },

    searchTodos: async (_, { query }) => {
      return await Todo.find({ title: { $regex: query, $options: "i" } });
    },

    todoStats: async (_, { userId }) => {
      const query = userId ? { userId } : {};

      const [todos, priorityCounts] = await Promise.all([
        Todo.find(query),
        Todo.aggregate([
          ...(userId
            ? [{ $match: { userId: new mongoose.Types.ObjectId(userId) } }]
            : []),
          { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),
      ]);

      const now = new Date();
      const completed = todos.filter((t) => t.completed).length;
      const overdue = todos.filter(
        (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now
      ).length;

      const byPriority = ["LOW", "MEDIUM", "HIGH", "URGENT"].map(
        (priority) => ({
          priority,
          count: priorityCounts.find((p) => p._id === priority)?.count || 0,
        })
      );

      return {
        total: todos.length,
        completed,
        pending: todos.length - completed,
        byPriority,
        overdue,
      };
    },

    comments: async (_, { todoId }) => {
      return await Comment.find({ todoId });
    },
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const user = new User(input);
      await user.save();
      return user;
    },

    updateUser: async (_, { id, input }) => {
      const user = await User.findByIdAndUpdate(id, input, { new: true });
      if (!user)
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      return user;
    },

    deleteUser: async (_, { id }) => {
      const user = await User.findByIdAndDelete(id);
      if (!user)
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      await Todo.deleteMany({ userId: id });
      await Comment.deleteMany({ userId: id });
      return { success: true, message: "User deleted successfully" };
    },

    createTodo: async (_, { input }) => {
      const todo = new Todo(input);
      await todo.save();
      return todo;
    },

    updateTodo: async (_, { id, input }) => {
      const todo = await Todo.findByIdAndUpdate(id, input, { new: true });
      if (!todo)
        throw new GraphQLError("Todo not found", {
          extensions: { code: "NOT_FOUND" },
        });
      return todo;
    },

    deleteTodo: async (_, { id }) => {
      const todo = await Todo.findByIdAndDelete(id);
      if (!todo)
        throw new GraphQLError("Todo not found", {
          extensions: { code: "NOT_FOUND" },
        });
      await Comment.deleteMany({ todoId: id });
      return { success: true, message: "Todo deleted successfully" };
    },

    toggleTodo: async (_, { id }) => {
      const todo = await Todo.findById(id);
      if (!todo)
        throw new GraphQLError("Todo not found", {
          extensions: { code: "NOT_FOUND" },
        });
      todo.completed = !todo.completed;
      await todo.save();
      return todo;
    },

    bulkUpdateTodos: async (_, { ids, input }) => {
      await Todo.updateMany({ _id: { $in: ids } }, input);
      return await Todo.find({ _id: { $in: ids } });
    },

    addComment: async (_, { input }) => {
      const comment = new Comment(input);
      await comment.save();
      return comment;
    },

    deleteComment: async (_, { id }) => {
      const comment = await Comment.findByIdAndDelete(id);
      if (!comment)
        throw new GraphQLError("Comment not found", {
          extensions: { code: "NOT_FOUND" },
        });
      return { success: true, message: "Comment deleted successfully" };
    },
  },

  // Field resolvers
  User: {
    id: (user) => user._id.toString(),
    todos: async (user, { completed }) => {
      const query = { userId: user._id };
      if (completed !== undefined) {
        query.completed = completed;
      }
      return await Todo.find(query);
    },
    todoCount: async (user) => {
      return await Todo.countDocuments({ userId: user._id });
    },
  },

  Todo: {
    id: (todo) => todo._id.toString(),
    user: async (todo) => {
      return await User.findById(todo.userId);
    },
    comments: async (todo) => {
      return await Comment.find({ todoId: todo._id });
    },
    commentCount: async (todo) => {
      return await Comment.countDocuments({ todoId: todo._id });
    },
  },

  Comment: {
    id: (comment) => comment._id.toString(),
    todo: async (comment) => {
      return await Todo.findById(comment.todoId);
    },
    user: async (comment) => {
      return await User.findById(comment.userId);
    },
  },
};

// ===========================SEEDING=====================================
// Seed initial data
async function seedData() {
  const userCount = await User.countDocuments();

  if (userCount === 0) {
    console.log("Seeding initial data...");

    const users = await User.insertMany([
      { name: "John Doe", email: "john@example.com", role: "ADMIN" },
      { name: "Jane Smith", email: "jane@example.com", role: "USER" },
      { name: "Bob Johnson", email: "bob@example.com", role: "USER" },
    ]);

    const todos = await Todo.insertMany([
      {
        title: "Complete GraphQL tutorial",
        completed: false,
        userId: users[0]._id,
        priority: "HIGH",
        dueDate: new Date("2024-12-20"),
      },
      {
        title: "Review pull requests",
        completed: true,
        userId: users[0]._id,
        priority: "MEDIUM",
        dueDate: new Date("2024-12-18"),
      },
      {
        title: "Write documentation",
        completed: false,
        userId: users[1]._id,
        priority: "LOW",
        dueDate: new Date("2024-12-25"),
      },
      {
        title: "Fix bug in authentication",
        completed: false,
        userId: users[1]._id,
        priority: "HIGH",
        dueDate: new Date("2024-12-16"),
      },
    ]);

    await Comment.insertMany([
      {
        text: "This needs to be done ASAP",
        todoId: todos[0]._id,
        userId: users[1]._id,
      },
      {
        text: "Great job on completing this!",
        todoId: todos[1]._id,
        userId: users[1]._id,
      },
    ]);

    console.log("Initial data seeded");
  }
}

// Create schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// ========================================== APP ================================

// Initialize Express
const app = express();

// Create Apollo Server
const server = new ApolloServer({
  schema,
  formatError: (error) => {
    console.error(error);
    return error;
  },
});

// Start server
async function startServer() {
  await server.start();

  // Seed data after MongoDB connection
  await seedData();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Mock authentication - in production, verify JWT token
        const token = req.headers.authorization;
        let user = null;

        if (token) {
          // In production: decode JWT and find user
          user = await User.findOne(); // Mock: return first user
        }

        return { user };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
