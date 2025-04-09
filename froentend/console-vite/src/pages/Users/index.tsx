import React, { useState, useEffect } from 'react';
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
  FormControlLabel,
  Switch,
  Typography,
  Chip,
  Paper,
  IconButton,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  PersonAdd as PersonAddIcon,
  Security as SecurityIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { Table, Column } from '../../components/Table';
import { User as UserType } from '../../types';
// import { userApi } from '../../services/api';

// 確保 User 類型滿足 Record<string, unknown> 約束
interface User extends UserType {
  [key: string]: unknown;
}

// 表單狀態介面
interface UserFormData {
  username: string;
  full_name: string;
  password?: string;
  role: 'admin' | 'manager' | 'staff';
  active: boolean;
}

// 假資料
const MOCK_USERS: User[] = [
  {
    user_id: '1',
    tenant_id: 'tenant1',
    username: 'admin',
    full_name: '系統管理員',
    role: 'admin',
    active: true,
    created_at: '2024-03-09T10:00:00Z',
    updated_at: '2024-03-09T10:00:00Z'
  },
  {
    user_id: '2',
    tenant_id: 'tenant1',
    username: 'manager1',
    full_name: '李主管',
    role: 'manager',
    active: true,
    created_at: '2024-03-09T11:00:00Z',
    updated_at: '2024-03-09T11:00:00Z'
  },
  {
    user_id: '3',
    tenant_id: 'tenant1',
    username: 'staff1',
    full_name: '王小明',
    role: 'staff',
    active: true,
    created_at: '2024-03-09T12:00:00Z',
    updated_at: '2024-03-09T12:00:00Z'
  },
  {
    user_id: '4',
    tenant_id: 'tenant1',
    username: 'staff2',
    full_name: '林小華',
    role: 'staff',
    active: false,
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-10T15:00:00Z'
  }
];

const Users: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // 狀態
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    full_name: '',
    password: '',
    role: 'staff',
    active: true
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 欄位定義
  const columns: Column<User>[] = [
    { id: 'username', label: '使用者名稱', minWidth: 120 },
    { id: 'full_name', label: '姓名', minWidth: 150 },
    { 
      id: 'role', 
      label: '角色', 
      minWidth: 100,
      format: (value: unknown): React.ReactNode => {
        const roleValue = value as string;
        const roleMap: Record<string, {label: string, color: string}> = {
          'admin': {label: '管理員', color: theme.palette.error.main},
          'manager': {label: '主管', color: theme.palette.warning.main},
          'staff': {label: '店員', color: theme.palette.info.main}
        };
        const role = roleMap[roleValue];
        return (
          <Chip 
            label={role?.label || roleValue}
            size="small"
            sx={{ 
              bgcolor: role?.color + '20',
              color: role?.color,
              fontWeight: 500
            }}
          />
        );
      }
    },
    {
      id: 'active',
      label: '狀態',
      minWidth: 100,
      format: (value: unknown): React.ReactNode => (
        <Chip
          label={(value as boolean) ? '啟用' : '停用'}
          size="small"
          color={(value as boolean) ? 'success' : 'default'}
          sx={{ 
            fontWeight: 500
          }}
        />
      ),
    },
    {
      id: 'created_at',
      label: '建立時間',
      minWidth: 170,
      format: (value: unknown): string => new Date(value as string).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
    }
  ];

  // 載入使用者資料
  const loadUsers = async () => {
    setLoading(true);
    try {
      // 使用模擬資料
      setTimeout(() => {
        setUsers(MOCK_USERS);
        setLoading(false);
      }, 600);
    } catch (err) {
      setError('載入使用者資料時發生錯誤');
      console.error(err);
      setLoading(false);
    }
  };

  // 初始載入
  useEffect(() => {
    loadUsers();
  }, []);

  // 表單驗證
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      errors.username = '請輸入使用者名稱';
    } else if (formData.username.length < 3) {
      errors.username = '使用者名稱至少需要3個字元';
    }
    
    if (!formData.full_name.trim()) {
      errors.full_name = '請輸入姓名';
    }
    
    if (!selectedUser && !formData.password) {
      errors.password = '請設定密碼';
    } else if (!selectedUser && formData.password && formData.password.length < 6) {
      errors.password = '密碼至少需要6個字元';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 處理表單變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'active' ? checked : value
    }));
    
    // 清除該欄位的錯誤
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 處理選擇變更
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  // 打開新增對話框
  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      full_name: '',
      password: '',
      role: 'staff',
      active: true
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  // 打開編輯對話框
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      active: user.active
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  // 確認刪除對話框
  const handleDeleteConfirm = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  // 執行刪除
  const handleDelete = async () => {
    if (!userToDelete) return;
    
    setLoading(true);
    
    try {
      // 模擬 API 請求
      setTimeout(() => {
        setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userToDelete.user_id));
        setSuccess('使用者已成功刪除');
        setLoading(false);
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
      }, 600);
    } catch (err) {
      setError('刪除使用者時發生錯誤');
      console.error(err);
      setLoading(false);
    }
  };

  // 關閉對話框
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormErrors({});
  };

  // 表單提交處理
  const handleSubmit = async () => {
    // 表單驗證
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      if (selectedUser) {
        // 模擬 API 請求
        setTimeout(() => {
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.user_id === selectedUser.user_id
                ? {
                    ...user,
                    full_name: formData.full_name,
                    role: formData.role,
                    active: formData.active,
                    updated_at: new Date().toISOString()
                  }
                : user
            )
          );
          setSuccess('使用者已更新');
          handleCloseDialog();
          setLoading(false);
        }, 600);
      } else {
        // 模擬 API 請求
        setTimeout(() => {
          const newUser: User = {
            user_id: `user_${Date.now()}`, // 產生臨時 ID
            tenant_id: 'tenant1',
            username: formData.username,
            full_name: formData.full_name,
            role: formData.role,
            active: formData.active,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUsers(prevUsers => [...prevUsers, newUser]);
          setSuccess('新使用者已建立');
          handleCloseDialog();
          setLoading(false);
        }, 600);
      }
    } catch (err) {
      setError('處理使用者資料時發生錯誤');
      console.error(err);
      setLoading(false);
    }
  };

  // 清除訊息
  const handleClearMessage = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* 標題與操作按鈕 */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          使用者管理
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="重新整理">
            <IconButton 
              color="primary" 
              onClick={loadUsers}
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            sx={{ px: 3 }}
            fullWidth={isMobile}
          >
            新增使用者
          </Button>
        </Box>
      </Box>

      {/* 使用者列表 */}
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ 
          minHeight: users.length === 0 && !loading ? '200px' : 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {users.length === 0 && !loading ? (
            <Typography color="text.secondary" sx={{ p: 3 }}>
              尚未有任何使用者資料
            </Typography>
          ) : (
            <Table<User>
              columns={columns}
              rows={users}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
              loading={loading}
            />
          )}
        </Box>
      </Paper>

      {/* 新增/編輯對話框 */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth 
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2
        }}>
          {selectedUser ? '編輯使用者' : '新增使用者'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="使用者名稱"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!!selectedUser}
              autoFocus
              error={!!formErrors.username}
              helperText={formErrors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="姓名"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              error={!!formErrors.full_name}
              helperText={formErrors.full_name}
            />
            <TextField
              margin="normal"
              fullWidth
              label="密碼"
              name="password"
              type="password"
              value={formData.password || ''}
              onChange={handleInputChange}
              required={!selectedUser}
              helperText={selectedUser ? "若不修改密碼請留空" : (formErrors.password || "請設定至少6個字元的密碼")}
              error={!!formErrors.password}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>角色</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                label="角色"
              >
                <MenuItem value="admin">管理員</MenuItem>
                <MenuItem value="manager">主管</MenuItem>
                <MenuItem value="staff">店員</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.active}
                  onChange={handleInputChange}
                  name="active"
                  color="primary"
                />
              }
              label="啟用帳號"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? '處理中...' : '儲存'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 刪除確認對話框 */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2,
          color: theme.palette.error.main
        }}>
          確認刪除
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography>
            確定要刪除使用者 "<strong>{userToDelete?.full_name}</strong>" 嗎？
          </Typography>
          <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
            此操作將永久刪除該使用者，無法復原。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={() => setDeleteConfirmOpen(false)}>取消</Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? '處理中...' : '刪除'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 提示訊息 */}
      <Snackbar 
        open={!!error || !!success} 
        autoHideDuration={6000} 
        onClose={handleClearMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleClearMessage} 
          severity={error ? "error" : "success"} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users; 