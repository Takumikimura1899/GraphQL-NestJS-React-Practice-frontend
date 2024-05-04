import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation createTask($createTaskInput: CreateTaskInput!) {
    createTask(createTaskInput: $createTaskInput) {
      id
      name
      dueDate
      status
      description
    }
  }
`;
