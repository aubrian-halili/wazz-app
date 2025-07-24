export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  createdAt: string;
}

export interface Thread {
  id: string;
  participants: User[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

// GraphQL Query/Mutation types
export interface LoginMutationVariables {
  username: string;
  password: string;
}

export interface LoginMutationResponse {
  login: AuthPayload;
}

export interface ThreadsQueryResponse {
  threads: Thread[];
}

export interface ThreadQueryVariables {
  id: string;
}

export interface ThreadQueryResponse {
  thread: Thread;
}

export interface CreateThreadMutationVariables {
  participantUsername: string;
}

export interface CreateThreadMutationResponse {
  createThread: Thread;
}

export interface MessagesQueryVariables {
  threadId: string;
}

export interface MessagesQueryResponse {
  messages: Message[];
}

export interface SendMessageMutationVariables {
  threadId: string;
  content: string;
}

export interface SendMessageMutationResponse {
  sendMessage: Message;
}

export interface MeQueryResponse {
  me: User;
}
