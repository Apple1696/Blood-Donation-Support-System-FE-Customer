import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import type { BloodComponentCompatibility } from '@/services/BloodInfoService';
import type { BloodInfo } from '@/services/BloodInfoService';
import { Badge } from '@/components/ui/badge';

interface ComponentCompatibilityProps {
  compatibility: BloodComponentCompatibility[];
}

// Component name explanations
const componentDescriptions: Record<string, string> = {
  plasma: "Liquid part of blood containing proteins and antibodies. Used for clotting disorders, immune deficiencies, and trauma.",
  platelets: "Cell fragments that help with blood clotting. Used for cancer patients, surgeries, and bleeding disorders.",
  red_cells: "Carry oxygen throughout the body. Used for anemia, blood loss, and many surgeries.",
  whole_blood: "Complete blood with all components. Used in trauma, acute blood loss, and some surgeries."
};

const ComponentCompatibility: React.FC<ComponentCompatibilityProps> = ({ compatibility }) => {
  const [activeTab, setActiveTab] = useState('plasma');

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

  // Find the selected component data
  const getSelectedComponentData = () => {
    return compatibility.find((comp) => comp.componentType === activeTab);
  };

  const selectedComponent = getSelectedComponentData();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Blood component compatibility is more specific than whole blood compatibility. 
            Different components have different compatibility rules depending on the antigens 
            and antibodies they contain.
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
              {comp.componentType.replace('_', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {selectedComponent && (
          <>
            <CardDescription className="mb-4">
              {componentDescriptions[selectedComponent.componentType] || 
                `${selectedComponent.componentType.replace('_', ' ')} compatibility information`}
            </CardDescription>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compatible Donors</CardTitle>
                  <CardDescription>
                    These blood types can donate {selectedComponent.componentType.replace('_', ' ')} to your blood type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderBloodTypeList(selectedComponent.compatibleDonors)}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compatible Recipients</CardTitle>
                  <CardDescription>
                    Your blood type can donate {selectedComponent.componentType.replace('_', ' ')} to these blood types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderBloodTypeList(selectedComponent.compatibleRecipients)}
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