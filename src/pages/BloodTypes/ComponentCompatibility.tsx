import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BloodComponentCompatibility } from '@/services/BloodInfoService';
import type { BloodInfo } from '@/services/BloodInfoService';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ComponentCompatibilityProps {
  compatibility: BloodComponentCompatibility[];
}

// Component name explanations
const componentDescriptions: Record<string, string> = {
  plasma: "Phần lỏng của máu chứa protein và kháng thể. Được sử dụng cho rối loạn đông máu, suy giảm miễn dịch và chấn thương.",
  platelets: "Các mảnh tế bào giúp đông máu. Được sử dụng cho bệnh nhân ung thư, phẫu thuật và rối loạn chảy máu.",
  red_cells: "Vận chuyển oxy khắp cơ thể. Được sử dụng cho thiếu máu, mất máu và nhiều ca phẫu thuật.",
  whole_blood: "Máu toàn phần với tất cả các thành phần. Được sử dụng trong chấn thương, mất máu cấp tính và một số ca phẫu thuật."
};

// Vietnamese labels for blood components
const componentLabels: Record<string, string> = {
  plasma: "Huyết tương",
  platelets: "Tiểu cầu",
  red_cells: "Hồng cầu",
  whole_blood: "Máu toàn phần"
};

// Color mapping for blood types
const getBloodTypeColor = (group: string, rh: string): string => {
  if (group === 'O') {
    return rh === '+' ? '#ef4444' : '#fca5a5';  // Red tones
  } else if (group === 'A') {
    return rh === '+' ? '#3b82f6' : '#93c5fd';  // Blue tones
  } else if (group === 'B') {
    return rh === '+' ? '#22c55e' : '#86efac';  // Green tones
  } else if (group === 'AB') {
    return rh === '+' ? '#8b5cf6' : '#c4b5fd';  // Purple tones
  }
  return '#d1d5db';  // Default gray
};

const ComponentCompatibility: React.FC<ComponentCompatibilityProps> = ({ compatibility }) => {
  const [activeTab, setActiveTab] = useState('plasma');
  const [donorChartData, setDonorChartData] = useState<any[]>([]);
  const [recipientChartData, setRecipientChartData] = useState<any[]>([]);

  // Find the selected component data
  const getSelectedComponentData = () => {
    return compatibility.find((comp) => comp.componentType === activeTab);
  };

  const selectedComponent = getSelectedComponentData();

  // Function to render blood type list
  const renderBloodTypeList = (bloodTypes: BloodInfo[]) => {
    return bloodTypes.map((blood) => {
      // Determine badge color based on blood type
      let bgColor = "bg-gray-100";

      if (blood.group === 'O') {
        bgColor = blood.rh === '+' ? "bg-red-100 text-red-800" : "bg-red-200 text-red-900";
      } else if (blood.group === 'A') {
        bgColor = blood.rh === '+' ? "bg-blue-100 text-blue-800" : "bg-blue-200 text-blue-900";
      } else if (blood.group === 'B') {
        bgColor = blood.rh === '+' ? "bg-green-100 text-green-800" : "bg-green-200 text-green-900";
      } else if (blood.group === 'AB') {
        bgColor = blood.rh === '+' ? "bg-purple-100 text-purple-800" : "bg-purple-200 text-purple-900";
      }

      return (
        <div key={`${blood.group}${blood.rh}`} className="flex items-center mb-2 p-2 border rounded-md">
          <Badge className={`${bgColor} mr-2`}>
            {blood.group}{blood.rh}
          </Badge>
          <span className="text-sm">{blood.frequency}</span>
        </div>
      );
    });
  };

  // Prepare chart data when the selected component changes
  useEffect(() => {
    if (!selectedComponent) return;

    // Process donor data
    const donors = [...selectedComponent.compatibleDonors];
    const donorFrequencies = donors.map(donor => {
      // Extract the numerical percentage from the frequency string (e.g., "7% of population")
      const match = donor.frequency.match(/(\d+(?:\.\d+)?)%/);
      const percentage = match ? parseFloat(match[1]) : 0;

      return {
        name: `${donor.group}${donor.rh}`,
        value: percentage,
        fullText: donor.frequency
      };
    });

    // Calculate total percentage covered by compatible donors
    const totalDonorPercentage = donorFrequencies.reduce((sum, item) => sum + item.value, 0);

    // Add "Others" segment if total is less than 100%
    if (totalDonorPercentage < 100) {
      donorFrequencies.push({
        name: 'Không tương thích',
        value: 100 - totalDonorPercentage,
        fullText: `${(100 - totalDonorPercentage).toFixed(1)}% dân số`
      });
    }

    setDonorChartData(donorFrequencies);

    // Process recipient data
    const recipients = [...selectedComponent.compatibleRecipients];
    const recipientFrequencies = recipients.map(recipient => {
      const match = recipient.frequency.match(/(\d+(?:\.\d+)?)%/);
      const percentage = match ? parseFloat(match[1]) : 0;

      return {
        name: `${recipient.group}${recipient.rh}`,
        value: percentage,
        fullText: recipient.frequency
      };
    });

    // Calculate total percentage covered by compatible recipients
    const totalRecipientPercentage = recipientFrequencies.reduce((sum, item) => sum + item.value, 0);

    // Add "Others" segment if total is less than 100%
    if (totalRecipientPercentage < 100) {
      recipientFrequencies.push({
        name: 'Không tương thích',
        value: 100 - totalRecipientPercentage,
        fullText: `${(100 - totalRecipientPercentage).toFixed(1)}% dân số`
      });
    }

    setRecipientChartData(recipientFrequencies);
  }, [selectedComponent]);

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{payload[0].payload.fullText}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-primary">
            Khả năng tương thích của các thành phần máu cụ thể hơn so với tương thích của máu toàn phần.
            Các thành phần khác nhau có các quy tắc tương thích khác nhau tùy thuộc vào kháng nguyên
            và kháng thể mà chúng chứa.
          </p>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          {compatibility.map((comp) => (
            <TabsTrigger key={comp.componentType} value={comp.componentType}>
              {componentLabels[comp.componentType] || comp.componentType.replace('_', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>

        {selectedComponent && (
          <>
            <CardDescription className="mb-4">
              {componentDescriptions[selectedComponent.componentType] ||
                `Thông tin tương thích ${selectedComponent.componentType.replace('_', ' ')}`}
            </CardDescription>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Người hiến tương thích</CardTitle>
                  <CardDescription>
                    Những nhóm máu này có thể hiến {componentLabels[selectedComponent.componentType]} cho nhóm máu của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donorChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {donorChartData.map((entry, index) => {
                            // Use custom color for blood types, gray for "Not Compatible"
                            const color = entry.name === 'Không tương thích'
                              ? '#d1d5db'
                              : getBloodTypeColor(entry.name.charAt(0), entry.name.charAt(1));
                            return <Cell key={`cell-${index}`} fill={color} />;
                          })}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 max-h-40 overflow-y-auto">
                    {renderBloodTypeList(selectedComponent.compatibleDonors)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Người nhận tương thích</CardTitle>
                  <CardDescription>
                    Nhóm máu của bạn có thể hiến {componentLabels[selectedComponent.componentType]} cho những nhóm máu này
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={recipientChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {recipientChartData.map((entry, index) => {
                            // Use custom color for blood types, gray for "Not Compatible"
                            const color = entry.name === 'Không tương thích'
                              ? '#d1d5db'
                              : getBloodTypeColor(entry.name.charAt(0), entry.name.charAt(1));
                            return <Cell key={`cell-${index}`} fill={color} />;
                          })}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 max-h-40 overflow-y-auto">
                    {renderBloodTypeList(selectedComponent.compatibleRecipients)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ComponentCompatibility;