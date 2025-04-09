import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Table, Column } from '../../components/Table';

interface MenuItem {
  item_id: string;
  name: string;
  category_id: string;
  price: number;
  description: string;
  active: boolean;
  created_at: string;
  [key: string]: string | number | boolean;
}

const Menu: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<MenuItem | null>(null);

  const columns: Column<MenuItem>[] = [
    { id: 'name', label: '品項名稱', minWidth: 170 },
    { id: 'category_id', label: '分類', minWidth: 130 },
    {
      id: 'price',
      label: '價格',
      minWidth: 100,
      align: 'right',
      format: (value: unknown) => `NT$ ${(value as number).toLocaleString()}`,
    },
    {
      id: 'active',
      label: '狀態',
      minWidth: 100,
      format: (value: unknown) => (
        <Chip
          label={(value as boolean) ? '上架中' : '已下架'}
          color={(value as boolean) ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'created_at',
      label: '建立時間',
      minWidth: 170,
      format: (value: unknown) => new Date(value as string).toLocaleString(),
    },
  ];

  const mockData: MenuItem[] = [
    {
      item_id: '1',
      name: '炒麵',
      category_id: '主食',
      price: 80,
      description: '傳統炒麵',
      active: true,
      created_at: '2024-03-09T10:00:00Z',
    },
    {
      item_id: '2',
      name: '炒飯',
      category_id: '主食',
      price: 85,
      description: '蛋炒飯',
      active: true,
      created_at: '2024-03-09T10:00:00Z',
    },
  ];

  const handleAdd = () => {
    setSelectedItem(null);
    setOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleDelete = (item: MenuItem) => {
    console.log('Delete:', item);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    // 處理儲存邏輯
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          菜單管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ px: 3 }}
        >
          新增品項
        </Button>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Table<MenuItem>
          columns={columns}
          rows={mockData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ px: 3, py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedItem ? '編輯品項' : '新增品項'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="品項名稱"
              defaultValue={selectedItem?.name}
              margin="normal"
              size="small"
            />
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>分類</InputLabel>
              <Select
                value={selectedItem?.category_id || ''}
                label="分類"
              >
                <MenuItem value="主食">主食</MenuItem>
                <MenuItem value="飲料">飲料</MenuItem>
                <MenuItem value="小菜">小菜</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="價格"
              type="number"
              defaultValue={selectedItem?.price}
              margin="normal"
              size="small"
            />
            <TextField
              fullWidth
              label="描述"
              multiline
              rows={4}
              defaultValue={selectedItem?.description}
              margin="normal"
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose}>
            取消
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{ px: 3 }}
          >
            儲存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Menu; 