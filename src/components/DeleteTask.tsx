import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation } from '@apollo/client';
import { DELETE_TASK } from '../mutations/taskMutations';
import { GET_TASKS } from '../queries/taskQueries';
import { useNavigate } from 'react-router-dom';

export const DeleteTask = ({ id, userId }: { id: number; userId: number }) => {
  const navigate = useNavigate();
  const [deleteTask] = useMutation<{ deleteTask: number }>(DELETE_TASK);

  const handleDeleteTask = async () => {
    try {
      await deleteTask({
        variables: { id },
        refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
      });
      alert('タスクが削除されました');
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('token');
        alert('tokenの有効期限が切れました。signinページへ遷移します');
        navigate('/signin');
        return;
      }
      console.error(err);
      alert('タスクの削除に失敗しました');
    }
  };
  return (
    <Tooltip title='Delete'>
      <IconButton onClick={handleDeleteTask}>
        <DeleteIcon color='action' />
      </IconButton>
    </Tooltip>
  );
};
