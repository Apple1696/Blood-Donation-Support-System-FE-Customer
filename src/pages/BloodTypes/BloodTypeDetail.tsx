import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import BloodInfoService from '@/services/BloodInfoService';
import type { BloodInfo, BloodComponentCompatibility } from '@/services/BloodInfoService';
import CompatibilityChart from './CompatibilityChart';
import ComponentCompatibility from './ComponentCompatibility';

const BloodTypeDetail: React.FC = () => {
  // Get group and rh from URL params
  const { group, rh } = useParams<{ group: string; rh: string }>();
  
  const [bloodInfo, setBloodInfo] = useState<BloodInfo | null>(null);
  const [componentCompatibility, setComponentCompatibility] = useState<BloodComponentCompatibility[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBloodTypeDetails = async () => {
      if (!group || !rh) {
        setError('Thông số nhóm máu không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch blood info
        const bloodData = await BloodInfoService.getBloodInfoByType(group, rh);
        setBloodInfo(bloodData);
        
        // Fetch component compatibility
        const compatibilityData = await BloodInfoService.getComponentCompatibility(group, rh);
        setComponentCompatibility(compatibilityData);
        
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin chi tiết nhóm máu');
        setLoading(false);
      }
    };

    fetchBloodTypeDetails();
  }, [group, rh]);

  // If loading or error, show appropriate UI
  if (loading) {
    return (
      <div className="container mx-auto px-16 pb-8 max-w-7xl">
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !bloodInfo) {
    return (
      <div className="container mx-auto px-16 pb-8 max-w-7xl">
        <p className="text-center text-red-500">{error || 'Không tìm thấy nhóm máu'}</p>
        <div className="text-center mt-4">
          <Link to="/blood-types">
            <Button variant="outline">Quay lại tất cả nhóm máu</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Destructure blood info for easier access
  const { 
    description, 
    characteristics, 
    canDonateTo, 
    canReceiveFrom, 
    frequency, 
    specialNotes 
  } = bloodInfo;

  return (
    <div className="container mx-auto px-16 pb-8 max-w-7xl">
      <div className="flex justify-between items-center mb-4 mt-8">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Nhóm máu {bloodInfo.group}{bloodInfo.rh}</h2>
          <Badge variant="outline">{frequency}</Badge>
        </div>
        <Link to="/blood-types">
          <Button variant="ghost">Quay lại tất cả nhóm máu</Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Thông tin chung</TabsTrigger>
          <TabsTrigger value="basic">Khả năng tương thích cơ bản</TabsTrigger>
          <TabsTrigger value="component">Tương thích thành phần</TabsTrigger>
          <TabsTrigger value="medical">Thông tin y tế</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-2 text-primary">Mô tả</h3>
                  <p className="text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-2 text-primary">Đặc điểm</h3>
                  <p className="text-muted-foreground">{characteristics}</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead colSpan={2} className="text-center text-primary">Thông tin nhóm máu {bloodInfo.group}{bloodInfo.rh}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Tần suất</TableCell>
                      <TableCell>{frequency}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Có thể hiến cho</TableCell>
                      <TableCell>{canDonateTo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Có thể nhận từ</TableCell>
                      <TableCell>{canReceiveFrom}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ghi chú đặc biệt</TableCell>
                      <TableCell>{specialNotes}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="basic" className="mt-4">
          <CompatibilityChart bloodInfo={bloodInfo} />
        </TabsContent>
        
        <TabsContent value="component" className="mt-4">
          <ComponentCompatibility compatibility={componentCompatibility} />
        </TabsContent>
        
        <TabsContent value="medical" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2 text-primary">Ý nghĩa y tế</h3>
              <p className="text-muted-foreground">{specialNotes}</p>
              {/* Additional medical information could be added here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BloodTypeDetail;