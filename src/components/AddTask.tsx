import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useMutation } from '@apollo/client';
import { CREATE_TASK } from '../mutations/taskMutations';
import { Task } from '../types/task';
import { GET_TASKS } from '../queries/taskQueries';
import { useNavigate } from 'react-router-dom';

export const AddTask = ({ userId }: { userId: number }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidDueDate, setIsInvalidDueDate] = useState(false);
  const navigate = useNavigate();

  const [createTask] = useMutation<{ createTask: Task }>(CREATE_TASK);

  const resetState = () => {
    setName('');
    setDueDate('');
    setDescription('');
    setIsInvalidName(false);
    setIsInvalidDueDate(false);
  };

  const handleAddTask = async () => {
    let canAdd = true;

    if (name === '') {
      setIsInvalidName(true);
      canAdd = false;
    } else {
      setIsInvalidName(false);
    }

    if (!Date.parse(dueDate)) {
      setIsInvalidDueDate(true);
      canAdd = false;
    } else {
      setIsInvalidDueDate(false);
    }

    if (!canAdd) {
      return;
    }

    const createTaskInput = {
      name,
      dueDate,
      description,
      userId,
    };

    try {
      await createTask({
        variables: { createTaskInput },
        refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
      });
      resetState();
      setOpen(false);
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        localStorage.removeItem('token');
        alert('tokenの有効期限が切れました。signinページに戻ります。');
        navigate('/signin');
        return;
      }
      alert('タスクの登録に失敗しました');
      console.error(error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    resetState();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant='contained'
        sx={{ width: '270px' }}
        onClick={handleClickOpen}
      >
        Add Task
      </Button>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin='normal'
            id='name'
            label='TaskName'
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={isInvalidName}
            helperText={isInvalidName && 'TaskNameを入力してください'}
          />
          <TextField
            autoFocus
            required
            margin='normal'
            id='dueDate'
            label='DueDate'
            placeholder='yyyy-mm-dd'
            fullWidth
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={isInvalidDueDate}
            helperText={isInvalidDueDate && 'yyyy-mm-dd形式で入力してください'}
          />
          <TextField
            autoFocus
            margin='normal'
            id='description'
            label='Description'
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddTask}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
