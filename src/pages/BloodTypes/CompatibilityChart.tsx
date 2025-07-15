import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { BloodInfo } from '@/services/BloodInfoService';
import BloodInfoService from '@/services/BloodInfoService';

interface CompatibilityChartProps {
  bloodInfo: BloodInfo;
}

const CompatibilityChart: React.FC<CompatibilityChartProps> = ({ bloodInfo }) => {
  const [compatibility, setCompatibility] = useState<{ 
    canDonate: string[], 
    canReceive: string[] 
  }>({ canDonate: [], canReceive: [] });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompatibility = async () => {
      try {
        const data = await BloodInfoService.getCompatibilityInfo(bloodInfo.group, bloodInfo.rh);
        setCompatibility(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching compatibility info:', error);
        setLoading(false);
      }
    };

    fetchCompatibility();
  }, [bloodInfo]);

  // Function to render blood type badges
  const renderBloodTypeBadges = (types: string[]) => {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {types.map((type) => {
          // Determine badge color based on blood type
          let bgColor = "bg-gray-100";
          
          if (type.startsWith('O')) {
            bgColor = "bg-red-100 text-red-800";
          } else if (type.startsWith('A')) {
            bgColor = "bg-blue-100 text-blue-800";
          } else if (type.startsWith('B')) {
            bgColor = "bg-green-100 text-green-800";
          } else if (type.startsWith('AB')) {
            bgColor = "bg-purple-100 text-purple-800";
          }
          
          return (
            <span 
              key={type} 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
            >
              {type}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <Tabs defaultValue="receive">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="receive">Tôi có thể nhận từ ai?</TabsTrigger>
          <TabsTrigger value="donate">Tôi có thể hiến cho ai?</TabsTrigger>
        </TabsList>
        
        <TabsContent value="receive">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Nhóm máu có thể hiến cho {bloodInfo.group}{bloodInfo.rh}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Đang tải thông tin tương thích...</p>
              ) : (
                <div className="space-y-4">
                  {renderBloodTypeBadges(compatibility.canReceive)}
                  
                  <div className="mt-6 bg-amber-50 p-4 rounded-md">
                    <h4 className="font-medium text-amber-800 mb-1">Lưu ý quan trọng</h4>
                    <p className="text-sm text-amber-700">
                      Khả năng tương thích có thể khác nhau đối với các thành phần máu khác nhau. Kiểm tra 
                      tab Tương thích thành phần để biết thông tin chi tiết hơn.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="donate">
          <Card>
            <CardHeader>
              <CardTitle className='text-primary'>{bloodInfo.group}{bloodInfo.rh} có thể hiến cho các nhóm máu này</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Đang tải thông tin tương thích...</p>
              ) : (
                <div className="space-y-4">
                  {renderBloodTypeBadges(compatibility.canDonate)}
                  
                  <div className="mt-6 bg-amber-50 p-4 rounded-md">
                    <h4 className="font-medium text-amber-800 mb-1">Lưu ý quan trọng</h4>
                    <p className="text-sm text-amber-700">
                      Khả năng tương thích có thể khác nhau đối với các thành phần máu khác nhau. Kiểm tra 
                      tab Tương thích thành phần để biết thông tin chi tiết hơn.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompatibilityChart;