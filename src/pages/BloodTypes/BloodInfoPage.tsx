import React, { useState, useEffect } from 'react';
import BloodInfoService from '../../services/BloodInfoService';
import type { BloodInfo } from '../../services/BloodInfoService';
import type { BloodComponentCompatibility } from '../../services/BloodInfoService';
import BloodTypeCard from './BloodTypeCard';
import BloodTypeDetail from './BloodTypeDetail';
import CompatibilityChart from './CompatibilityChart';
import ComponentCompatibility from './ComponentCompatibility';

// Import Shadcn components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BloodInfoPage: React.FC = () => {
  const [bloodTypes, setBloodTypes] = useState<BloodInfo[]>([]);
  const [selectedBloodType, setSelectedBloodType] = useState<BloodInfo | null>(null);
  const [componentCompatibility, setComponentCompatibility] = useState<BloodComponentCompatibility[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBloodTypes = async () => {
      try {
        setLoading(true);
        const data = await BloodInfoService.getAllBloodInfo();
        setBloodTypes(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blood type information');
        setLoading(false);
      }
    };

    fetchBloodTypes();
  }, []);

  const handleBloodTypeSelect = async (group: string, rh: string) => {
    try {
      setLoading(true);
      const bloodInfo = await BloodInfoService.getBloodInfoByType(group, rh);
      setSelectedBloodType(bloodInfo);
      
      // Load compatibility data
      const compatibility = await BloodInfoService.getComponentCompatibility(group, rh);
      setComponentCompatibility(compatibility);
      
      setLoading(false);
      setActiveTab("general");
    } catch (err) {
      setError('Failed to load blood type details');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    
    try {
      setLoading(true);
      const bloodInfo = await BloodInfoService.searchBloodInfo(searchTerm);
      setSelectedBloodType(bloodInfo);
      
      // Load compatibility data
      const compatibility = await BloodInfoService.getComponentCompatibility(
        bloodInfo.group, 
        bloodInfo.rh
      );
      setComponentCompatibility(compatibility);
      
      setLoading(false);
      setActiveTab("general");
    } catch (err) {
      setError(`No blood type found matching "${searchTerm}"`);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-16 pb-8 max-w-7xl">
      <h1 className="text-3xl pt-8 font-bold text-center mb-8">
        Blood Type Information Center
      </h1>

      {/* Search Bar */}
      {/* <div className="flex justify-center mb-8">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Search blood type (e.g., A+, O-)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button type="submit" onClick={handleSearch}>Search</Button>
        </div>
      </div> */}

      {loading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Blood Types Grid */}
          {!selectedBloodType && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {bloodTypes.map((type) => (
                <BloodTypeCard 
                  key={`${type.group}${type.rh}`}
                  bloodInfo={type}
                  onClick={() => handleBloodTypeSelect(type.group, type.rh)}
                />
              ))}
            </div>
          )}

          {/* Detailed Blood Type View */}
          {selectedBloodType && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold">{selectedBloodType.group}{selectedBloodType.rh} Blood Type</h2>
                  <Badge variant="outline">{selectedBloodType.frequency}</Badge>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedBloodType(null)}
                >
                  Back to all types
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General Information</TabsTrigger>
                  <TabsTrigger value="basic">Basic Compatibility</TabsTrigger>
                  <TabsTrigger value="component">Component Compatibility</TabsTrigger>
                  <TabsTrigger value="medical">Medical Facts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="mt-4">
                  <BloodTypeDetail bloodInfo={selectedBloodType} />
                </TabsContent>
                
                <TabsContent value="basic" className="mt-4">
                  <CompatibilityChart bloodInfo={selectedBloodType} />
                </TabsContent>
                
                <TabsContent value="component" className="mt-4">
                  <ComponentCompatibility compatibility={componentCompatibility} />
                </TabsContent>
                
                <TabsContent value="medical" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-2">Medical Relevance</h3>
                      <p className="text-muted-foreground">{selectedBloodType.specialNotes}</p>
                      {/* Additional medical information could be added here */}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </>
      )}
      {/* <BloodDonationDiagram/> */}
    </div>
  );
};

export default BloodInfoPage;