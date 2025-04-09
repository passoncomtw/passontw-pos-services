import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Table } from '../../components/Table';

interface Shift {
  shift_id: string;
  start_time: string;
  end_time: string | null;
  start_user_id: string;
  end_user_id: string | null;
  start_cash_amount: number;
  end_cash_amount: number | null;
  notes: string | null;
  status: 'active' | 'closed';
}

const Shifts: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedShift, setSelectedShift] = React.useState<Shift | null>(null);

  const columns = [
    {
      id: 'start_time',
      label: '開始時間',
      minWidth: 170,
      format: (value: string) => new Date(value).toLocaleString(),
    },
    {
      id: 'end_time',
      label: '結束時間',
      minWidth: 170,
      format: (value: string | null) =>
        value ? new Date(value).toLocaleString() : '-',
    },
    {
      id: 'start_cash_amount',
      label: '初始金額',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number) => `NT$ ${value.toLocaleString()}`,
    },
    {
      id: 'end_cash_amount',
      label: '結束金額',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number | null) =>
        value ? `NT$ ${value.toLocaleString()}` : '-',
    },
    {
      id: 'status',
      label: '狀態',
      minWidth: 100,
      format: (value: string) => (
        <Chip
          label={value === 'active' ? '進行中' : '已結束'}
          color={value === 'active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
  ];

  const mockData: Shift[] = [
    {
      shift_id: '1',
      start_time: '2024-03-09T08:00:00Z',
      end_time: '2024-03-09T16:00:00Z',
      start_user_id: 'user1',
      end_user_id: 'user1',
      start_cash_amount: 1000,
      end_cash_amount: 15000,
      notes: '正常交接',
      status: 'closed',
    },
    {
      shift_id: '2',
      start_time: '2024-03-09T16:00:00Z',
      end_time: null,
      start_user_id: 'user2',
      end_user_id: null,
      start_cash_amount: 15000,
      end_cash_amount: null,
      notes: null,
      status: 'active',
    },
  ];

  const handleAdd = () => {
    setSelectedShift(null);
    setOpen(true);
  };

  const handleEdit = (shift: Shift) => {
    setSelectedShift(shift);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedShift(null);
  };

  const handleSave = () => {
    // 處理儲存邏輯
    handleClose();
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          開始新班次
        </Button>
      </Box>

      <Table
        title="班次管理"
        columns={columns}
        rows={mockData}
        onEdit={handleEdit}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedShift ? '編輯班次' : '開始新班次'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="初始金額"
              type="number"
              defaultValue={selectedShift?.start_cash_amount || ''}
              margin="normal"
            />
            {selectedShift?.status === 'active' && (
              <>
                <TextField
                  fullWidth
                  label="結束金額"
                  type="number"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="交接備註"
                  multiline
                  rows={4}
                  margin="normal"
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedShift?.status === 'active' ? '結束班次' : '開始班次'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Shifts; 