import { gql } from '@apollo/client';

// Auth Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        createdAt
        updatedAt
      }
    }
  }
`;

// User Queries
export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      createdAt
      updatedAt
    }
  }
`;

// Thread Queries
export const THREADS_QUERY = gql`
  query Threads {
    threads {
      id
      participants {
        id
        username
      }
      messages {
        id
        content
        sender {
          id
          username
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const THREAD_QUERY = gql`
  query Thread($id: ID!) {
    thread(id: $id) {
      id
      participants {
        id
        username
      }
      messages {
        id
        content
        sender {
          id
          username
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

// Thread Mutations
export const CREATE_THREAD_MUTATION = gql`
  mutation CreateThread($participantUsername: String!) {
    createThread(participantUsername: $participantUsername) {
      id
      participants {
        id
        username
      }
      messages {
        id
        content
        sender {
          id
          username
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

// Message Queries
export const MESSAGES_QUERY = gql`
  query Messages($threadId: ID!) {
    messages(threadId: $threadId) {
      id
      content
      sender {
        id
        username
      }
      createdAt
    }
  }
`;

// Message Mutations
export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($threadId: ID!, $content: String!) {
    sendMessage(threadId: $threadId, content: $content) {
      id
      content
      sender {
        id
        username
      }
      createdAt
    }
  }
`;

// Subscriptions
export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription MessageAdded($threadId: ID!) {
    messageAdded(threadId: $threadId) {
      id
      content
      sender {
        id
        username
      }
      createdAt
    }
  }
`;

export const THREAD_UPDATED_SUBSCRIPTION = gql`
  subscription ThreadUpdated {
    threadUpdated {
      id
      participants {
        id
        username
      }
      messages {
        id
        content
        sender {
          id
          username
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;
