import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, FormControl, FormHelperText, InputLabel, MenuItem as MuiMenuItem, Modal, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Table, Column } from '../../components/Table';

// 定義菜單項目介面
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  available: boolean;
  [key: string]: unknown;
}

// 模擬菜單資料
const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: '鹽烤鯖魚',
    price: 220,
    category: '主菜',
    description: '新鮮鯖魚，鹽烤而成，保留魚肉原味。',
    available: true
  },
  {
    id: '2',
    name: '蒜香奶油明蝦',
    price: 320,
    category: '主菜',
    description: '鮮甜明蝦，搭配蒜香奶油醬汁。',
    available: true
  },
  {
    id: '3',
    name: '香煎雞腿排',
    price: 180,
    category: '主菜',
    description: '嫩煎雞腿排，搭配特製醬汁。',
    available: true
  },
  {
    id: '4',
    name: '季節生菜沙拉',
    price: 120,
    category: '前菜',
    description: '新鮮當季蔬菜，搭配特製沙拉醬。',
    available: true
  },
  {
    id: '5',
    name: '香濃南瓜湯',
    price: 90,
    category: '湯品',
    description: '使用新鮮南瓜熬煮而成，濃郁香甜。',
    available: true
  },
  {
    id: '6',
    name: '提拉米蘇',
    price: 110,
    category: '甜點',
    description: '經典義大利甜點，層次豐富。',
    available: true
  },
  {
    id: '7',
    name: '特調冰咖啡',
    price: 70,
    category: '飲料',
    description: '使用精選咖啡豆，冰涼爽口。',
    available: true
  },
  {
    id: '8',
    name: '白酒蛤蠣義大利麵',
    price: 260,
    category: '主菜',
    description: '新鮮蛤蠣，白酒提味，搭配義大利麵。',
    available: false
  }
];

const Menus = () => {
  // 狀態設定
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: '',
    description: '',
    available: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初次載入時獲取菜單數據
  useEffect(() => {
    setLoading(true);
    // 模擬API延遲
    setTimeout(() => {
      setMenuItems(MOCK_MENU_ITEMS);
      setLoading(false);
    }, 500);
  }, []);

  // 表格列定義
  const columns: Column<MenuItem>[] = [
    { id: 'name', label: '名稱' },
    { id: 'price', label: '價格', format: (value) => `NT$ ${value}` },
    { id: 'category', label: '分類' },
    { id: 'description', label: '描述' },
    { 
      id: 'available', 
      label: '供應狀態', 
      format: (value) => value ? '供應中' : '已停售' 
    }
  ];

  // 開啟新增菜單項目表單
  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: 0,
      category: '',
      description: '',
      available: true
    });
    setErrors({});
    setOpenModal(true);
  };

  // 開啟編輯菜單項目表單
  const handleEdit = (menuItem: MenuItem) => {
    setEditingId(menuItem.id);
    setFormData({ ...menuItem });
    setErrors({});
    setOpenModal(true);
  };

  // 關閉表單
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // 調整handleChange函數以處理一般欄位
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: name === 'price' ? Number(value) : value,
    });

    // 清除對應欄位的錯誤
    if (errors[name as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  };

  // 專門處理 available 欄位
  const handleAvailableChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value === 'true',
    });

    // 清除對應欄位的錯誤
    if (errors[name as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  };

  // 表單驗證
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = '菜單名稱不能為空';
    }
    
    if (formData.price === undefined || formData.price <= 0) {
      newErrors.price = '價格必須大於0';
    }
    
    if (!formData.category) {
      newErrors.category = '請選擇分類';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 儲存菜單項目
  const handleSave = () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    // 模擬API請求延遲
    setTimeout(() => {
      if (editingId) {
        // 編輯現有項目
        setMenuItems(prev => 
          prev.map(item => 
            item.id === editingId ? { ...formData, id: editingId } as MenuItem : item
          )
        );
      } else {
        // 新增項目
        const newItem: MenuItem = {
          ...formData,
          id: Date.now().toString(),
        } as MenuItem;
        
        setMenuItems(prev => [...prev, newItem]);
      }
      
      setLoading(false);
      setOpenModal(false);
    }, 800);
  };

  // 刪除菜單項目
  const handleDelete = (menuItem: MenuItem) => {
    if (window.confirm(`確定要刪除 ${menuItem.name} 嗎？`)) {
      setLoading(true);
      
      // 模擬API請求延遲
      setTimeout(() => {
        setMenuItems(prev => prev.filter(item => item.id !== menuItem.id));
        setLoading(false);
      }, 500);
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h1">
          <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          菜單管理
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpenAddForm}
        >
          新增菜單項目
        </Button>
      </Stack>
      
      <Divider sx={{ mb: 3 }} />
      
      <Table
        columns={columns}
        rows={menuItems}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      {/* 新增/編輯菜單項目表單 */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="menu-item-form-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1
        }}>
          <Typography id="menu-item-form-title" variant="h6" component="h2" mb={2}>
            {editingId ? '編輯菜單項目' : '新增菜單項目'}
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              name="name"
              label="菜單名稱"
              fullWidth
              value={formData.name || ''}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            
            <TextField
              name="price"
              label="價格"
              type="number"
              fullWidth
              value={formData.price || 0}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
            />
            
            <FormControl fullWidth margin="normal" error={!!errors.category}>
              <InputLabel id="category-label">類別</InputLabel>
              <Select
                labelId="category-label"
                label="類別"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <MuiMenuItem value="主餐">主餐</MuiMenuItem>
                <MuiMenuItem value="點心">點心</MuiMenuItem>
                <MuiMenuItem value="飲料">飲料</MuiMenuItem>
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
            
            <TextField
              name="description"
              label="描述"
              fullWidth
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
            />
            
            <FormControl fullWidth error={!!errors.available}>
              <InputLabel id="available-label">供應狀態</InputLabel>
              <Select
                labelId="available-label"
                id="available"
                name="available"
                value={formData.available ? 'true' : 'false'}
                label="供應狀態"
                onChange={handleAvailableChange}
              >
                <MuiMenuItem value="true">供應中</MuiMenuItem>
                <MuiMenuItem value="false">暫停供應</MuiMenuItem>
              </Select>
              {errors.available && <FormHelperText>{errors.available}</FormHelperText>}
            </FormControl>
            
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button onClick={handleCloseModal}>取消</Button>
              <Button 
                variant="contained" 
                onClick={handleSave}
                disabled={loading}
              >
                儲存
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default Menus; 