
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  AlertColor,
  Collapse,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface AddFormProps {
  onSubmitForm: (
    taskId:number,
    formData: {
    title: string;
    description: string;
    startDate: Date | null;
    dueDate: Date | null;
    priority: string;
  }) => void;
  initialData?: {
    title: string;
    description: string;
    startDate: Date | null;
    dueDate: Date | null;
    priority: string;
  };
  editMode:boolean;
  closeForm: () => void; 
}

interface FormErrors {
  title?: string;
  dates?: string;
}


export default function AddForm({ onSubmitForm, initialData, editMode, closeForm }: AddFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startDate, setStartDate] = useState<Date | null>(initialData?.startDate || null);
  const [dueDate, setDueDate] = useState<Date | null>(initialData?.dueDate || null);
  const [priority, setPriority] = useState<string>(initialData?.priority || 'Medium');
  const [errors, setErrors] = useState<FormErrors>({});
  const [alert, setAlert] = useState<{ show: boolean; message: string; severity: AlertColor }>({
    show: false,
    message: '',
    severity: 'error',
  });



  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (startDate && dueDate && startDate > dueDate) {
      newErrors.dates = 'Due date must be after start date';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setAlert({
        show: true,
        message: 'Please fix the errors in the form',
        severity: 'error',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmitForm(0, { title, description, startDate, dueDate, priority });
    
    // Show success message if needed
    setAlert({
      show: true,
      message: editMode ? 'Task updated successfully!' : 'Task added successfully!',
      severity: 'success',
    });
    
    setTimeout(() => closeForm(), 1000);
  };


  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const datePickerPopper = document.querySelector('.MuiPopper-root');
      const selectMenu = document.querySelector('.MuiMenu-root');
      const popover = document.querySelector('.MuiPopover-root');
  
      if (
        (datePickerPopper && datePickerPopper.contains(event.target as Node)) ||
        (selectMenu && selectMenu.contains(event.target as Node)) ||
        (popover && popover.contains(event.target as Node))
      ) {
        return;
      }
  
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        closeForm();
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeForm]);




  return (
    <div className="absolute left-1/2 top-20 transform -translate-x-1/2 w-full max-w-3xl z-50" ref={formRef}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: '#1e1e1e',
          color: 'white',
        }}>

          <Collapse in={alert.show}>
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, show: false })}
            sx={{ mb: 2 }}
          >
            {alert.message}
          </Alert>
        </Collapse>


        <Stack spacing={2}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: undefined });
            }}
            error={!!errors.title}
            helperText={errors.title}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { color: 'white' } }}
            style={{ border: 1, borderColor: '#404040' }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#404040',
                },
               
                '&.Mui-focused fieldset': {
                  border: 0.2,
                  borderColor: '#4c98f5',
                },
              },
            }}
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { color: 'white' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#404040',
                },
             
                '&.Mui-focused fieldset': {
                  border: 0.2,
                  borderColor: '#4c98f5',
                },
              },
            }}
          />
          

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="flex gap-4">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  if (errors.dates) setErrors({ ...errors, dates: undefined });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputLabelProps: { style: { color: '#ccc' } },
                    InputProps: { style: { color: 'white' } },
                    sx: {
                        '& .MuiSvgIcon-root': {
                          color: '#ccc',
                        },
                        '& fieldset': {
                          borderColor: '#404040',
                        },
                       
                        '&.Mui-focused fieldset': {
                          border: 0.2,
                          borderColor: '#4c98f5',
                        },
                      },
                  },
                }}
              />

              <DatePicker
                label="Due Date"
                value={dueDate}
                onChange={(newValue) => {
                  setDueDate(newValue);
                  if (errors.dates) setErrors({ ...errors, dates: undefined });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputLabelProps: { style: { color: '#ccc' } },
                    InputProps: { style: { color: 'white' } },
                    sx: {
                      '& .MuiSvgIcon-root': {
                        color: '#ccc',
                      },
                      '& fieldset': {
                        borderColor: '#404040',
                      },
                      '&:hover fieldset': {
                        borderColor: '#404040',
                      },
                      '&.Mui-focused fieldset': {
                        border: 0.2,
                        borderColor: '#4c98f5',
                      },
                    },
                  },
                }}
              />
            </div>
          </LocalizationProvider>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="priority-label" sx={{ color: '#ccc' }}>
              Priority
            </InputLabel>
            <Select
              labelId="priority-label"
              id="priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
              sx={{
                color: 'white',
                '& .MuiSelect-icon': {
                  color: 'white',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#404040',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#404040',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 0.2,
                  borderColor: '#4c98f5',
                },
              }}>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 1, backgroundColor: '#1976d2' }}>
              {editMode ? "Update Task" : "Add Task"}
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
