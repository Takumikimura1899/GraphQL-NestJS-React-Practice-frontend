import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Task } from '../types/task';
import { TaskStatus } from '../types/taskStatus';
import { UPDATE_TASK } from '../mutations/taskMutations';
import { useMutation } from '@apollo/client';
import { GET_TASKS } from '../queries/taskQueries';
import { useNavigate } from 'react-router-dom';

export const EditTask = ({ task, userId }: { task: Task; userId: number }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(task.name);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [description, setDescription] = useState(task.description);
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidDueDate, setIsInvalidDueDate] = useState(false);
  const navigate = useNavigate();

  const [updateTask] = useMutation<{ updateTask: Task }>(UPDATE_TASK);

  const resetState = () => {
    setName(task.name);
    setDueDate(task.dueDate);
    setStatus(task.status);
    setDescription(task.description);
    setIsInvalidName(false);
    setIsInvalidDueDate(false);
  };

  const handleEditTask = async () => {
    let canEdit = true;

    if (name === '') {
      setIsInvalidName(true);
      canEdit = false;
    } else {
      setIsInvalidName(false);
    }

    if (!Date.parse(dueDate)) {
      setIsInvalidDueDate(true);
      canEdit = false;
    } else {
      setIsInvalidDueDate(false);
    }

    if (!canEdit) {
      return;
    }

    const updateTaskInput = {
      id: task.id,
      name,
      dueDate,
      status,
      description,
    };

    try {
      await updateTask({
        variables: { updateTaskInput },
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
      alert('タスクの編集に失敗しました');
      console.error(error);
    }
  };

  const handleClickOpen = () => {
    resetState();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title='Edit'>
        <IconButton onClick={handleClickOpen}>
          <EditIcon color='action' />
        </IconButton>
      </Tooltip>
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
        <DialogTitle>Edit Task</DialogTitle>
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
          <FormControl fullWidth margin='normal'>
            <InputLabel id='taskStatusLabel'>Status</InputLabel>
            <Select
              labelId='taskStatusLabel'
              id='taskStatus'
              label='Status'
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <MenuItem value='NOT_STARTED'>Not Started</MenuItem>
              <MenuItem value='IN_PROGRESS'>In Progress</MenuItem>
              <MenuItem value='COMPLETED'>Completed</MenuItem>
            </Select>
          </FormControl>
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
          <Button onClick={handleEditTask}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
