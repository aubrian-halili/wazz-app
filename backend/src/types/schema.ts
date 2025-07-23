import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Thread {
    id: ID!
    participants: [User!]!
    messages: [Message!]!
    createdAt: String!
    updatedAt: String!
  }

  type Message {
    id: ID!
    content: String!
    sender: User!
    thread: Thread!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    threads: [Thread!]!
    thread(id: ID!): Thread
    messages(threadId: ID!): [Message!]!
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    createThread(participantUsername: String!): Thread!
    sendMessage(threadId: ID!, content: String!): Message!
  }

  type Subscription {
    messageAdded(threadId: ID!): Message!
    threadUpdated: Thread!
  }
`;
