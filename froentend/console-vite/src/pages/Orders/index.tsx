import React from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Table } from '../../components/Table';

interface OrderItem {
  item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  options?: string;
}

interface Order {
  order_id: string;
  order_number: string;
  order_type: 'dine_in' | 'takeout';
  table_number?: string;
  status: string;
  total_amount: number;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  const columns = [
    { id: 'order_number', label: '訂單編號', minWidth: 130 },
    {
      id: 'order_type',
      label: '用餐方式',
      minWidth: 100,
      format: (value: string) => (value === 'dine_in' ? '內用' : '外帶'),
    },
    {
      id: 'table_number',
      label: '桌號',
      minWidth: 80,
      format: (value: string) => value || '-',
    },
    {
      id: 'status',
      label: '狀態',
      minWidth: 100,
      format: (value: string) => (
        <Chip
          label={value === 'completed' ? '已完成' : '已取消'}
          color={value === 'completed' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      id: 'total_amount',
      label: '金額',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number) => `NT$ ${value.toLocaleString()}`,
    },
    {
      id: 'payment_method',
      label: '付款方式',
      minWidth: 100,
      format: (value: string) => (value === 'cash' ? '現金' : '其他'),
    },
    {
      id: 'created_at',
      label: '建立時間',
      minWidth: 170,
      format: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  const mockData: Order[] = [
    {
      order_id: '1',
      order_number: 'ORD001',
      order_type: 'dine_in',
      table_number: 'A1',
      status: 'completed',
      total_amount: 280,
      payment_method: 'cash',
      created_at: '2024-03-09T10:00:00Z',
      items: [
        {
          item_id: '1',
          name: '炒麵',
          quantity: 2,
          unit_price: 80,
        },
        {
          item_id: '2',
          name: '炒飯',
          quantity: 1,
          unit_price: 120,
        },
      ],
    },
    {
      order_id: '2',
      order_number: 'ORD002',
      order_type: 'takeout',
      status: 'completed',
      total_amount: 160,
      payment_method: 'cash',
      created_at: '2024-03-09T11:00:00Z',
      items: [
        {
          item_id: '1',
          name: '炒麵',
          quantity: 2,
          unit_price: 80,
        },
      ],
    },
  ];

  const handleView = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleClose = () => {
    setSelectedOrder(null);
  };

  return (
    <Box>
      <Table
        title="訂單管理"
        columns={columns}
        rows={mockData}
        onEdit={handleView}
        showActions={true}
      />

      <Dialog open={!!selectedOrder} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          訂單詳情 - {selectedOrder?.order_number}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                用餐方式
              </Typography>
              <Typography variant="body1">
                {selectedOrder?.order_type === 'dine_in' ? '內用' : '外帶'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                桌號
              </Typography>
              <Typography variant="body1">
                {selectedOrder?.table_number || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                訂單內容
              </Typography>
              <List disablePadding>
                {selectedOrder?.items.map((item) => (
                  <ListItem key={item.item_id} disablePadding>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.quantity} x NT$ ${item.unit_price}`}
                    />
                    <Typography variant="body2">
                      NT$ {item.quantity * item.unit_price}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">總計</Typography>
                <Typography variant="subtitle1">
                  NT$ {selectedOrder?.total_amount.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>關閉</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders; 