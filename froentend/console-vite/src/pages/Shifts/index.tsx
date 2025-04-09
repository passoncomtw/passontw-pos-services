import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Chip, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import HourglassIcon from '@mui/icons-material/HourglassEmpty';
import { Table, Column } from '../../components/Table';

// 類型定義
interface User {
  user_id: string;
  tenant_id: string;
  username: string;
  full_name: string;
  role: 'admin' | 'manager' | 'staff';
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface Shift {
  shift_id: string;
  tenant_id: string;
  start_time: string;
  start_user_id: string;
  start_cash_amount: number;
  end_time: string | null;
  end_user_id: string | null;
  end_cash_amount: number | null;
  status: 'active' | 'closed';
  notes: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

interface ShiftFormData {
  start_cash_amount: number;
  end_cash_amount?: number;
  notes?: string;
}

// 使用者模擬資料
const MOCK_USERS: Record<string, User> = {
  'user-001': {
    user_id: 'user-001',
    tenant_id: 'tenant-001',
    username: 'admin',
    full_name: '管理員',
    role: 'admin',
    active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  'user-002': {
    user_id: 'user-002',
    tenant_id: 'tenant-001',
    username: 'cashier1',
    full_name: '收銀員 1',
    role: 'staff',
    active: true,
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  },
  'user-003': {
    user_id: 'user-003',
    tenant_id: 'tenant-001',
    username: 'cashier2',
    full_name: '收銀員 2',
    role: 'staff',
    active: true,
    created_at: '2023-01-03T00:00:00Z',
    updated_at: '2023-01-03T00:00:00Z'
  }
};

// 班次模擬資料
const MOCK_SHIFTS: Shift[] = [
  {
    shift_id: 'shift-001',
    tenant_id: 'tenant-001',
    start_time: '2023-06-01T08:00:00Z',
    start_user_id: 'user-001',
    start_cash_amount: 5000,
    end_time: '2023-06-01T17:00:00Z',
    end_user_id: 'user-001',
    end_cash_amount: 15000,
    status: 'closed',
    notes: '交接正常',
    created_at: '2023-06-01T08:00:00Z',
    updated_at: '2023-06-01T17:00:00Z'
  },
  {
    shift_id: 'shift-002',
    tenant_id: 'tenant-001',
    start_time: '2023-06-02T08:00:00Z',
    start_user_id: 'user-002',
    start_cash_amount: 5000,
    end_time: '2023-06-02T17:00:00Z',
    end_user_id: 'user-002',
    end_cash_amount: 18000,
    status: 'closed',
    notes: '下午客流較多',
    created_at: '2023-06-02T08:00:00Z',
    updated_at: '2023-06-02T17:00:00Z'
  },
  {
    shift_id: 'shift-003',
    tenant_id: 'tenant-001',
    start_time: '2023-06-03T08:00:00Z',
    start_user_id: 'user-003',
    start_cash_amount: 5000,
    end_time: null,
    end_user_id: null,
    end_cash_amount: null,
    status: 'active',
    notes: null,
    created_at: '2023-06-03T08:00:00Z',
    updated_at: '2023-06-03T08:00:00Z'
  }
];

// 格式化日期時間的函數
const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// 格式化貨幣的函數
const formatCurrency = (amount: number): string => {
  return `NT$ ${amount.toLocaleString()}`;
};

const Shifts: React.FC = () => {
  // 狀態管理
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState<ShiftFormData>({
    start_cash_amount: 0
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 載入資料
  useEffect(() => {
    // 模擬 API 請求載入班次資料
    setLoading(true);
    setTimeout(() => {
      setShifts(MOCK_SHIFTS);
      setLoading(false);
    }, 1000);
  }, []);

  // 欄位定義
  const columns: Column<Shift>[] = [
    {
      id: 'start_time',
      label: '開始時間',
      minWidth: 170,
      format: (value: unknown) => {
        if (typeof value === 'string') {
          return formatDateTime(value);
        }
        return '-';
      }
    },
    {
      id: 'start_user_id',
      label: '開始人員',
      minWidth: 120,
      format: (value: unknown) => {
        if (typeof value === 'string') {
          return MOCK_USERS[value]?.full_name || '未知';
        }
        return '-';
      }
    },
    {
      id: 'start_cash_amount',
      label: '初始金額',
      minWidth: 100,
      align: 'right',
      format: (value: unknown) => {
        if (typeof value === 'number') {
          return formatCurrency(value);
        }
        return '-';
      }
    },
    {
      id: 'end_time',
      label: '結束時間',
      minWidth: 170,
      format: (value: unknown) => {
        if (typeof value === 'string') {
          return formatDateTime(value);
        }
        return '-';
      }
    },
    {
      id: 'end_user_id',
      label: '結束人員',
      minWidth: 120,
      format: (value: unknown) => {
        if (typeof value === 'string') {
          return MOCK_USERS[value]?.full_name || '未知';
        }
        return '-';
      }
    },
    {
      id: 'end_cash_amount',
      label: '結束金額',
      minWidth: 100,
      align: 'right',
      format: (value: unknown) => {
        if (typeof value === 'number') {
          return formatCurrency(value);
        }
        return '-';
      }
    },
    {
      id: 'status',
      label: '狀態',
      minWidth: 100,
      format: (value: unknown) => {
        if (typeof value === 'string') {
          return (
            <Chip
              label={value === 'active' ? '進行中' : '已結束'}
              color={value === 'active' ? 'success' : 'default'}
              size="small"
              icon={value === 'active' ? <HourglassIcon fontSize="small" /> : undefined}
              sx={{ fontWeight: 500 }}
            />
          );
        }
        return '-';
      }
    }
  ];

  // 表單輸入處理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('amount') ? parseFloat(value) || 0 : value
    }));
  };

  // 驗證表單
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (formData.start_cash_amount < 0) {
      errors.start_cash_amount = '初始金額不能為負數';
    }

    if (formData.end_cash_amount !== undefined && formData.end_cash_amount < 0) {
      errors.end_cash_amount = '結束金額不能為負數';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 開啟新增班次對話框
  const handleOpen = () => {
    setSelectedShift(null);
    setFormData({ start_cash_amount: 0 });
    setFormErrors({});
    setOpen(true);
  };

  // 關閉對話框
  const handleClose = () => {
    setOpen(false);
  };

  // 提交表單
  const handleSubmit = () => {
    if (!validateForm()) return;

    setLoading(true);
    
    // 模擬 API 請求
    setTimeout(() => {
      try {
        if (selectedShift) {
          // 編輯現有班次
          const updatedShift: Shift = {
            ...selectedShift,
            start_cash_amount: formData.start_cash_amount,
            updated_at: new Date().toISOString()
          };

          // 如果是結束班次操作
          if (formData.end_cash_amount && selectedShift.status === 'active') {
            updatedShift.end_cash_amount = formData.end_cash_amount;
            updatedShift.end_time = new Date().toISOString();
            updatedShift.end_user_id = 'user-001'; // 假設當前登入使用者
            updatedShift.status = 'closed';
          }

          updatedShift.notes = formData.notes || null;

          // 更新班次清單
          setShifts(prev => 
            prev.map(shift => 
              shift.shift_id === selectedShift.shift_id ? updatedShift : shift
            )
          );
          setSuccess('班次已成功更新！');
        } else {
          // 新增班次
          const newShift: Shift = {
            shift_id: `shift-${Date.now().toString().substring(0, 8)}`,
            tenant_id: 'tenant-001',
            start_time: new Date().toISOString(),
            start_user_id: 'user-001', // 假設當前登入使用者
            start_cash_amount: formData.start_cash_amount,
            end_time: null,
            end_user_id: null,
            end_cash_amount: null,
            status: 'active',
            notes: formData.notes || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          // 新增至班次清單
          setShifts(prev => [...prev, newShift]);
          setSuccess('新班次已成功建立！');
        }

        setOpen(false);
      } catch (err) {
        setError('處理班次時發生錯誤，請稍後再試');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  // 編輯班次
  const handleEdit = (shift: Shift) => {
    // 找到原始 shift 對象
    const shiftId = shift.shift_id;
    const foundShift = shifts.find(s => s.shift_id === shiftId);
    
    if (foundShift) {
      setSelectedShift(foundShift);
      setFormData({
        start_cash_amount: foundShift.start_cash_amount,
        end_cash_amount: foundShift.end_cash_amount || undefined,
        notes: foundShift.notes || undefined
      });
      setFormErrors({});
      setOpen(true);
    }
  };

  // 清除通知
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <h1 style={{ margin: 0 }}>班次管理</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: '8px' }}
        >
          新增班次
        </Button>
      </Stack>

      {/* 提示訊息 */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {/* 班次列表 */}
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Table
          columns={columns}
          rows={shifts}
          onEdit={handleEdit}
          loading={loading}
        />
      </Paper>

      {/* 班次表單對話框 */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedShift ? (selectedShift.status === 'active' ? '結束班次' : '編輯班次') : '新增班次'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="start_cash_amount"
              label="初始金額"
              name="start_cash_amount"
              autoFocus
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={formData.start_cash_amount}
              onChange={handleInputChange}
              error={!!formErrors.start_cash_amount}
              helperText={formErrors.start_cash_amount}
              disabled={selectedShift?.status === 'closed'}
            />
            {selectedShift?.status === 'active' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="end_cash_amount"
                label="結束金額"
                name="end_cash_amount"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={formData.end_cash_amount || ''}
                onChange={handleInputChange}
                error={!!formErrors.end_cash_amount}
                helperText={formErrors.end_cash_amount}
              />
            )}
            <TextField
              margin="normal"
              fullWidth
              id="notes"
              label="備註"
              name="notes"
              multiline
              rows={4}
              value={formData.notes || ''}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">取消</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {selectedShift ? (selectedShift.status === 'active' ? '結束班次' : '更新') : '建立'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Shifts; 