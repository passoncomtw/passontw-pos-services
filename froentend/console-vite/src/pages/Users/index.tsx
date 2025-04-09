import React from 'react';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Table, Column } from '../../components/Table';

interface User extends Record<string, unknown> {
  username: string;
  full_name: string;
  role: string;
  active: boolean;
  created_at: string;
}

const Users: React.FC = () => {
  const columns: Column<User>[] = [
    { id: 'username', label: '使用者名稱', minWidth: 170 },
    { id: 'full_name', label: '姓名', minWidth: 170 },
    { id: 'role', label: '角色', minWidth: 100 },
    {
      id: 'active',
      label: '狀態',
      minWidth: 100,
      format: (value: unknown): string => ((value as boolean) ? '啟用' : '停用'),
    },
    {
      id: 'created_at',
      label: '建立時間',
      minWidth: 170,
      format: (value: unknown): string => new Date(value as string).toLocaleString(),
    },
  ];

  const mockData: User[] = [
    {
      username: 'admin',
      full_name: '系統管理員',
      role: '管理員',
      active: true,
      created_at: '2024-03-09T10:00:00Z',
    },
    {
      username: 'staff1',
      full_name: '王小明',
      role: '店員',
      active: true,
      created_at: '2024-03-09T11:00:00Z',
    },
  ];

  const handleEdit = (row: User): void => {
    console.log('Edit:', row);
  };

  const handleDelete = (row: User): void => {
    console.log('Delete:', row);
  };

  const handleAddUser = (): void => {
    console.log('Add new user');
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          新增使用者
        </Button>
      </Box>
      <Table<User>
        title="使用者列表"
        columns={columns}
        rows={mockData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default Users; 