import { gql } from "@apollo/client";
export const GET_TODOS = gql`
  query GetTodos(
    $filter: TodoFilter
    $sort: TodoSort
    $pagination: Pagination
  ) {
    todos(filter: $filter, sort: $sort, pagination: $pagination) {
      edges {
        node {
          id
          title
          completed
          priority
          dueDate
          createdAt
          user {
            id
            name
            email
          }
          commentCount
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
`;

export const GET_TODO_STATS = gql`
  query GetTodoStats($userId: ID) {
    todoStats(userId: $userId) {
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
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      todoCount
    }
  }
`;

export const CREATE_TODO = gql`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      title
      completed
      priority
      dueDate
      user {
        name
      }
    }
  }
`;

export const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!) {
    toggleTodo(id: $id) {
      id
      completed
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      success
      message
    }
  }
`;

export const BULK_UPDATE_TODOS = gql`
  mutation BulkUpdateTodos($ids: [ID!]!, $input: UpdateTodoInput!) {
    bulkUpdateTodos(ids: $ids, input: $input) {
      id
      completed
      priority
    }
  }
`;
