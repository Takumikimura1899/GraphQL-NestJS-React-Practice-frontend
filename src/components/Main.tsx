import { jwtDecode } from 'jwt-decode';
import { Header } from './Header';
import { TaskTable } from './TaskTable';
import { Payload } from '../types/payload';
import { useQuery } from '@apollo/client';
import { Task } from '../types/task';
import { GET_TASKS } from '../queries/taskQueries';

export const Main = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode<Payload>(token!);
  const userId = decodedToken.sub;

  const { loading, data, error } = useQuery<{ getTasks: Task[] }>(GET_TASKS, {
    variables: { userId },
  });
  console.log(data);

  return (
    <>
      <Header />
      <TaskTable />
    </>
  );
};
