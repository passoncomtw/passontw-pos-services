import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  bgColor: string;
}

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬獲取儀表板數據
    const timer = setTimeout(() => {
      setStats([
        {
          title: '今日營收',
          value: 'NT$ 12,500',
          icon: '💰',
          bgColor: 'bg-blue-50',
        },
        {
          title: '今日訂單',
          value: 32,
          icon: '📋',
          bgColor: 'bg-green-50',
        },
        {
          title: '本週營收',
          value: 'NT$ 87,250',
          icon: '📈',
          bgColor: 'bg-purple-50',
        },
        {
          title: '熱門商品',
          value: '牛肉麵',
          icon: '🍜',
          bgColor: 'bg-orange-50',
        },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">歡迎回來，{user?.name || '商家管理員'}</h1>
        <p className="text-gray-600">這是您的儀表板概覽</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg shadow-sm ${stat.bgColor} border border-gray-200`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-600 text-sm">{stat.title}</h3>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">近期訂單</h2>
              <div className="border-t border-gray-200">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">訂單 #{202400 + item}</p>
                        <p className="text-sm text-gray-600">10 分鐘前</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        已完成
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="text-primary hover:underline text-sm font-medium">
                  查看所有訂單 →
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">庫存提醒</h2>
              <div className="border-t border-gray-200">
                {[
                  { name: '牛肉', level: '低', color: 'bg-red-100 text-red-800' },
                  { name: '高麗菜', level: '中', color: 'bg-yellow-100 text-yellow-800' },
                  { name: '紅蘿蔔', level: '中', color: 'bg-yellow-100 text-yellow-800' },
                ].map((item, index) => (
                  <div key={index} className="py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{item.name}</p>
                      <span className={`px-3 py-1 ${item.color} rounded-full text-sm`}>
                        庫存{item.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="text-primary hover:underline text-sm font-medium">
                  管理庫存 →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 