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
          <TabsTrigger value="receive">Who Can I Receive From?</TabsTrigger>
          <TabsTrigger value="donate">Who Can I Donate To?</TabsTrigger>
        </TabsList>
        
        <TabsContent value="receive">
          <Card>
            <CardHeader>
              <CardTitle>Blood Types That Can Donate to {bloodInfo.group}{bloodInfo.rh}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading compatibility information...</p>
              ) : (
                <div className="space-y-4">
                  {renderBloodTypeBadges(compatibility.canReceive)}
                  
                  <div className="mt-6 bg-amber-50 p-4 rounded-md">
                    <h4 className="font-medium text-amber-800 mb-1">Important Note</h4>
                    <p className="text-sm text-amber-700">
                      Compatibility may vary for different blood components. Check the Component 
                      Compatibility tab for more detailed information.
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
              <CardTitle>{bloodInfo.group}{bloodInfo.rh} Can Donate To These Blood Types</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading compatibility information...</p>
              ) : (
                <div className="space-y-4">
                  {renderBloodTypeBadges(compatibility.canDonate)}
                  
                  <div className="mt-6 bg-amber-50 p-4 rounded-md">
                    <h4 className="font-medium text-amber-800 mb-1">Important Note</h4>
                    <p className="text-sm text-amber-700">
                      Compatibility may vary for different blood components. Check the Component 
                      Compatibility tab for more detailed information.
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