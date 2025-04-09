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
  Chip,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Grid as MuiGrid,
  SelectChangeEvent,
  Tooltip,
  IconButton,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  RestaurantMenu as MenuIcon,
  Category as CategoryIcon,
  LocalOffer as PriceIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AddAPhoto as AddPhotoIcon,
  Alert as AlertIcon
} from '@mui/icons-material';
import { Table, Column } from '../../components/Table';
import { MenuItem as MenuItemType, Category as CategoryType } from '../../types';

// 擴展 Category 類型以包含必要的屬性
interface Category extends CategoryType {
  order?: number;
  tenant_id: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// 確保 MenuItem 類型滿足 Record<string, unknown> 約束
interface MenuItem extends MenuItemType {
  [key: string]: unknown;
}

// 模擬分類資料
const MOCK_CATEGORIES: Category[] = [
  { 
    category_id: '1', 
    name: '咖啡', 
    active: true, 
    tenant_id: 'tenant-001',
    display_order: 1,
    created_at: '2023-06-01T08:00:00Z',
    updated_at: '2023-06-01T08:00:00Z'
  },
  { 
    category_id: '2', 
    name: '茶飲', 
    active: true, 
    tenant_id: 'tenant-001',
    display_order: 2,
    created_at: '2023-06-01T08:00:00Z',
    updated_at: '2023-06-01T08:00:00Z'
  },
  { 
    category_id: '3', 
    name: '甜點', 
    active: true, 
    tenant_id: 'tenant-001',
    display_order: 3,
    created_at: '2023-06-01T08:00:00Z',
    updated_at: '2023-06-01T08:00:00Z'
  },
  { 
    category_id: '4', 
    name: '輕食', 
    active: true, 
    tenant_id: 'tenant-001',
    display_order: 4,
    created_at: '2023-06-01T08:00:00Z',
    updated_at: '2023-06-01T08:00:00Z'
  },
];

// 模擬菜單資料
const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    item_id: '1',
    category_id: '1',
    tenant_id: 'tenant-001',
    name: '美式咖啡',
    description: '使用高海拔阿拉比卡豆，濃郁香醇',
    price: 80,
    active: true,
    image_url: 'https://picsum.photos/id/431/300/200',
    options: [],
    created_at: '2023-06-01T08:00:00Z',
    updated_at: '2023-06-01T08:00:00Z'
  },
  {
    item_id: '2',
    category_id: '1',
    tenant_id: 'tenant-001',
    name: '拿鐵咖啡',
    description: '濃縮咖啡與絲滑牛奶的完美結合',
    price: 100,
    active: true,
    image_url: 'https://picsum.photos/id/225/300/200',
    options: [],
    created_at: '2023-06-01T08:05:00Z',
    updated_at: '2023-06-01T08:05:00Z'
  },
  {
    item_id: '3',
    category_id: '2',
    tenant_id: 'tenant-001',
    name: '烏龍茶',
    description: '台灣高山烏龍，清香回甘',
    price: 70,
    active: true,
    image_url: 'https://picsum.photos/id/493/300/200',
    options: [],
    created_at: '2023-06-01T09:00:00Z',
    updated_at: '2023-06-01T09:00:00Z'
  },
  {
    item_id: '4',
    category_id: '3',
    tenant_id: 'tenant-001',
    name: '提拉米蘇',
    description: '義式經典甜點，咖啡與馬斯卡彭起司的絕妙組合',
    price: 150,
    active: true,
    image_url: 'https://picsum.photos/id/292/300/200',
    options: [],
    created_at: '2023-06-02T10:30:00Z',
    updated_at: '2023-06-02T10:30:00Z'
  },
  {
    item_id: '5',
    category_id: '4',
    tenant_id: 'tenant-001',
    name: '帕尼尼',
    description: '義式烤三明治，搭配新鮮蔬菜和肉類',
    price: 180,
    active: false,
    image_url: 'https://picsum.photos/id/312/300/200',
    options: [],
    created_at: '2023-06-03T11:00:00Z',
    updated_at: '2023-06-03T11:00:00Z'
  }
];

// 表單資料介面
interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  active: boolean;
  image_url: string;
}

const Menu: React.FC = () => {
  // 狀態管理
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    active: true,
    image_url: '',
  });
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 定義表格欄位
  const columns: Column<MenuItem>[] = [
    {
      id: 'image_url',
      label: '圖片',
      minWidth: 80,
      format: (value: unknown) => (
        <Box sx={{ width: 50, height: 50, borderRadius: 1, overflow: 'hidden' }}>
          <img
            src={value as string || 'https://via.placeholder.com/150'}
            alt="商品圖片"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      ),
    },
    { id: 'name', label: '名稱', minWidth: 120 },
    {
      id: 'category_id',
      label: '分類',
      minWidth: 100,
      format: (value: unknown) => {
        const category = categories.find(c => c.category_id === value);
        return (
          <Chip
            label={category?.name || '未分類'}
            size="small"
            color="primary"
            variant="outlined"
            icon={<CategoryIcon fontSize="small" />}
            sx={{ fontWeight: 500 }}
          />
        );
      },
    },
    {
      id: 'price',
      label: '價格',
      minWidth: 100,
      format: (value: unknown) => `NT$ ${value}`,
    },
    {
      id: 'active',
      label: '狀態',
      minWidth: 100,
      format: (value: unknown) => (
        <Chip
          label={(value as boolean) ? '上架中' : '已下架'}
          color={(value as boolean) ? 'success' : 'default'}
          variant={(value as boolean) ? 'filled' : 'outlined'}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'created_at',
      label: '建立時間',
      minWidth: 170,
      format: (value: unknown) => new Date(value as string).toLocaleString('zh-TW'),
    },
  ];

  // 載入資料
  const loadData = async () => {
    setLoading(true);
    try {
      // 模擬 API 呼叫延遲
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 已在上方初始化了 MOCK_CATEGORIES 和 MOCK_MENU_ITEMS
      setCategories(MOCK_CATEGORIES);
      setMenuItems(MOCK_MENU_ITEMS);
    } catch (error) {
      console.error('載入資料錯誤:', error);
      setErrorMessage('載入資料失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  // 頁面載入時獲取資料
  useEffect(() => {
    loadData();
  }, []);

  // 處理表單輸入改變
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'price' ? (value === '' ? 0 : parseFloat(value)) : 
              value,
    }));
    
    // 清除該欄位的錯誤訊息
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 處理下拉選單改變
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 驗證表單
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name) {
      errors.name = '請輸入品項名稱';
    }
    
    if (!formData.category_id) {
      errors.category_id = '請選擇商品分類';
    }
    
    if (formData.price <= 0) {
      errors.price = '價格必須大於零';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 新增菜單項目
  const handleAddItem = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category_id: '',
      active: true,
      image_url: '',
    });
    setFormErrors({});
    setOpen(true);
  };

  // 編輯菜單項目
  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category_id: item.category_id,
      active: item.active,
      image_url: item.image_url || '',
    });
    setFormErrors({});
    setOpen(true);
  };

  // 處理表單提交
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 模擬 API 延遲
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newItem: MenuItem = {
        ...(selectedItem || {}),
        item_id: selectedItem ? selectedItem.item_id : `item-${Date.now()}`,
        tenant_id: 'tenant-001',
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category_id: formData.category_id,
        active: formData.active,
        image_url: formData.image_url,
        options: [],
        created_at: selectedItem ? (selectedItem.created_at as string) : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (selectedItem) {
        // 編輯現有項目
        setMenuItems(prevItems => 
          prevItems.map(item => item.item_id === selectedItem.item_id ? newItem : item)
        );
        setSuccessMessage('菜單項目更新成功！');
      } else {
        // 新增項目
        setMenuItems(prevItems => [...prevItems, newItem]);
        setSuccessMessage('菜單項目新增成功！');
      }

      // 關閉對話框並重置表單
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('保存菜單項目錯誤:', error);
      setErrorMessage('操作失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  // 確認刪除對話框
  const handleDeleteConfirm = (item: MenuItem) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  // 刪除菜單項目
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    setLoading(true);
    try {
      // 模擬 API 延遲
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 從列表中移除
      setMenuItems(prevItems => 
        prevItems.filter(item => item.item_id !== itemToDelete.item_id)
      );
      
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      setSuccessMessage('菜單項目已成功刪除');
    } catch (error) {
      console.error('刪除菜單項目錯誤:', error);
      setErrorMessage('刪除失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  // 關閉訊息提示
  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 頁面標題與操作按鈕 */}
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="重新載入菜單資料">
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadData}
              disabled={loading}
            >
              重新整理
            </Button>
          </Tooltip>
          <Tooltip title="新增菜單項目">
            <Button
              variant="contained"
              startIcon={<MenuIcon />}
              onClick={handleAddItem}
              disabled={loading}
              sx={{ px: 3 }}
            >
              新增菜單項目
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* 菜單列表 */}
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Table
          columns={columns}
          rows={menuItems}
          onEdit={handleEditItem}
          onDelete={handleDeleteConfirm}
          loading={loading}
        />
      </Paper>

      {/* 新增/編輯菜單項目對話框 */}
      <Dialog
        open={open}
        onClose={() => !loading && setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedItem ? '編輯菜單項目' : '新增菜單項目'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <MuiGrid container spacing={2}>
            <MuiGrid item xs={12} md={6}>
              <MuiGrid container spacing={2}>
                <MuiGrid item xs={12}>
                  <TextField
                    fullWidth
                    label="名稱"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    size="small"
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <MenuIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                      ),
                    }}
                  />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }} error={!!formErrors.category_id}>
                    <InputLabel id="category-label">分類</InputLabel>
                    <Select
                      labelId="category-label"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleSelectChange}
                      label="分類"
                      startAdornment={
                        <CategoryIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                      }
                    >
                      {categories.map(category => (
                        <MenuItem key={category.category_id} value={category.category_id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.category_id && (
                      <FormHelperText>{formErrors.category_id}</FormHelperText>
                    )}
                  </FormControl>
                </MuiGrid>
                <MuiGrid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="價格"
                    name="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    error={!!formErrors.price}
                    helperText={formErrors.price}
                    size="small"
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <PriceIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                      ),
                      endAdornment: <InputAdornment position="end">NT$</InputAdornment>,
                    }}
                  />
                </MuiGrid>
                <MuiGrid item xs={12}>
                  <TextField
                    fullWidth
                    label="描述"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    size="small"
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    placeholder="輸入商品描述、特色或成分說明..."
                  />
                </MuiGrid>
                <MuiGrid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.active}
                        onChange={handleInputChange}
                        name="active"
                        color="success"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">
                          {formData.active ? '上架銷售' : '下架不顯示'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formData.active ? '商品將顯示在前台菜單中' : '商品將不會顯示在前台菜單中'}
                        </Typography>
                      </Box>
                    }
                  />
                </MuiGrid>
              </MuiGrid>
            </MuiGrid>
            <MuiGrid item xs={12}>
              <Box sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                p: 2,
                height: '100%',
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  商品圖片
                </Typography>
                
                {formData.image_url ? (
                  <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
                    <img
                      src={formData.image_url}
                      alt="商品預覽"
                      style={{ 
                        width: '100%', 
                        height: 200, 
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'error.light', color: 'white' }
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 200, 
                      bgcolor: '#f5f5f5',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      mb: 2
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      尚未上傳圖片
                    </Typography>
                  </Box>
                )}
                
                <TextField
                  fullWidth
                  label="圖片網址"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  size="small"
                  placeholder="輸入圖片網址"
                  InputProps={{
                    startAdornment: (
                      <AddPhotoIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                    ),
                  }}
                />
              </Box>
            </MuiGrid>
          </MuiGrid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={() => setOpen(false)} 
            disabled={loading}
          >
            取消
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {selectedItem ? '更新' : '建立'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 刪除確認對話框 */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => !loading && setDeleteConfirmOpen(false)}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon fontSize="small" /> 確認刪除菜單項目
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            您確定要刪除以下菜單項目嗎？此操作無法復原。
          </Typography>
          
          {itemToDelete && (
            <Box sx={{ 
              display: 'flex',
              bgcolor: '#f9f9f9', 
              p: 2, 
              borderRadius: 1,
              mb: 2,
              gap: 2,
              border: '1px solid #eee'
            }}>
              {itemToDelete.image_url && (
                <Box sx={{ flexShrink: 0 }}>
                  <img
                    src={itemToDelete.image_url}
                    alt={itemToDelete.name}
                    style={{ 
                      width: 80, 
                      height: 80, 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </Box>
              )}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <strong style={{ marginRight: '8px', minWidth: '45px' }}>名稱：</strong> {itemToDelete.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <strong style={{ marginRight: '8px', minWidth: '45px' }}>分類：</strong> {
                    categories.find(c => c.category_id === itemToDelete.category_id)?.name || '未分類'
                  }
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <strong style={{ marginRight: '8px', minWidth: '45px' }}>價格：</strong> NT$ {itemToDelete.price}
                </Typography>
              </Box>
            </Box>
          )}
          
          <Typography variant="body2" color="error" sx={{ 
            fontWeight: 500, 
            bgcolor: 'error.light', 
            color: 'error.dark', 
            p: 1.5, 
            borderRadius: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <DeleteIcon fontSize="small" /> 刪除菜單項目將可能影響關聯的訂單記錄
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={loading}
            color="inherit"
            sx={{ fontWeight: 500 }}
          >
            取消
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteItem}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ fontWeight: 500 }}
          >
            確認刪除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 訊息提示 */}
      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Menu; 