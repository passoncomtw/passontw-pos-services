import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  AttachMoney,
  ShoppingCart,
  People,
  RestaurantMenu,
} from '@mui/icons-material';

const DashboardCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card elevation={0} sx={{ bgcolor: 'background.paper', height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography color="textSecondary" gutterBottom variant="subtitle2" sx={{ fontSize: '0.875rem' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: 2,
            padding: 1.5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const theme = useTheme();
  
  // 這裡應該從 Redux store 獲取實際數據
  const stats = {
    todayRevenue: 'NT$ 25,000',
    todayOrders: '45',
    activeUsers: '8',
    menuItems: '126',
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          mb: 4
        }}
      >
        儀表板
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <DashboardCard
            title="今日營收"
            value={stats.todayRevenue}
            icon={<AttachMoney sx={{ color: 'white', fontSize: 32 }} />}
            color={theme.palette.success.main}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <DashboardCard
            title="今日訂單"
            value={stats.todayOrders}
            icon={<ShoppingCart sx={{ color: 'white', fontSize: 32 }} />}
            color={theme.palette.primary.main}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <DashboardCard
            title="在職員工"
            value={stats.activeUsers}
            icon={<People sx={{ color: 'white', fontSize: 32 }} />}
            color={theme.palette.warning.main}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <DashboardCard
            title="菜品數量"
            value={stats.menuItems}
            icon={<RestaurantMenu sx={{ color: 'white', fontSize: 32 }} />}
            color={theme.palette.error.main}
          />
        </Box>
        
        {/* 圖表區域 */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              height: '400px',
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
              }}
            >
              營收趨勢
            </Typography>
            {/* 這裡可以加入營收圖表 */}
            <Box sx={{ 
              height: 'calc(100% - 60px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography color="text.secondary">
                圖表開發中...
              </Typography>
            </Box>
          </Paper>
        </Box>
        
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              height: '400px',
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
              }}
            >
              熱門商品
            </Typography>
            {/* 這裡可以加入熱門商品列表 */}
            <Box sx={{ 
              height: 'calc(100% - 60px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography color="text.secondary">
                列表開發中...
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 