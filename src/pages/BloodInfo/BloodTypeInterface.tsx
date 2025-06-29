import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Blood type data
const bloodTypes = {
  A: {
    name: 'Group A',
    description: 'has only the A antigen on red cells (and B antibody in the plasma)',
    redCellsHeight: 60,
    plasmaHeight: 40,
    antigens: ['A'],
    antibodies: ['B'],
    canDonateTo: ['A', 'AB'],
    canReceiveFrom: ['A', 'O']
  },
  B: {
    name: 'Group B',
    description: 'has only the B antigen on red cells (and A antibody in the plasma)',
    redCellsHeight: 55,
    plasmaHeight: 45,
    antigens: ['B'],
    antibodies: ['A'],
    canDonateTo: ['B', 'AB'],
    canReceiveFrom: ['B', 'O']
  },
  AB: {
    name: 'Group AB',
    description: 'has both A and B antigens on red cells (but neither A nor B antibody in the plasma)',
    redCellsHeight: 65,
    plasmaHeight: 35,
    antigens: ['A', 'B'],
    antibodies: [],
    canDonateTo: ['AB'],
    canReceiveFrom: ['A', 'B', 'AB', 'O']
  },
  O: {
    name: 'Group O',
    description: 'has neither A nor B antigens on red cells (but both A and B antibody in the plasma)',
    redCellsHeight: 50,
    plasmaHeight: 50,
    antigens: [],
    antibodies: ['A', 'B'],
    canDonateTo: ['A', 'B', 'AB', 'O'],
    canReceiveFrom: ['O']
  }
};

// Blood Type Button Component
const BloodTypeButton = ({ type, isActive, onClick }) => (
  <Button
    variant={isActive ? "default" : "outline"}
    onClick={() => onClick(type)}
    className={`w-3/4  py-6 text-base font-semibold rounded-full transition-all duration-300 ${
      isActive 
        ? 'bg-primary text-primary-foreground shadow-md' 
        : 'border-primary/30 hover:border-primary/70 text-foreground'
    }`}
    size="lg"
  >
    Group {type}
  </Button>
);

// Test Tube Component
const TestTube = ({ bloodType }) => {
  const data = bloodTypes[bloodType];
  
  return (
    <div className="relative flex flex-col items-center">
      {/* Test Tube Container */}
      <div className="relative w-24 h-80 bg-secondary rounded-t-lg border-4 border-secondary/70 overflow-hidden shadow-lg">
        {/* Test Tube Neck */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-secondary border-4 border-secondary/70 rounded-t-lg -mt-2"></div>
        
        {/* Plasma (Yellow) */}
        <motion.div
          className="absolute top-0 w-full bg-chart-4 flex items-center justify-center gap-2"
          initial={{ height: 0 }}
          animate={{ height: `${data.plasmaHeight}%` }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          style={{ zIndex: 2 }}
        >
          {data.antibodies.length > 0 ? (
            data.antibodies.map((antibody, index) => (
              <motion.div
                key={antibody}
                className="bg-background rounded-full w-8 h-8 flex items-center justify-center font-bold text-foreground border-2 border-border shadow-md"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.8 + (index * 0.2) }}
              >
                {antibody}
              </motion.div>
            ))
          ) : (
            <motion.div
              className="bg-background rounded-full w-8 h-8 flex items-center justify-center font-bold text-foreground border-2 border-border shadow-md"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              ∅
            </motion.div>
          )}
          <div className="absolute top-2 right-2 text-xs font-semibold text-background">
            PLASMA
          </div>
        </motion.div>
        
        {/* Red Blood Cells (Red) */}
        <motion.div
          className="absolute bottom-0 w-full bg-primary flex items-center justify-center gap-2"
          initial={{ height: 0 }}
          animate={{ height: `${data.redCellsHeight}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ zIndex: 1 }}
        >
          {data.antigens.length > 0 ? (
            data.antigens.map((antigen, index) => (
              <motion.div
                key={antigen}
                className="bg-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-background border-2 border-border shadow-md"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + (index * 0.2) }}
              >
                {antigen}
              </motion.div>
            ))
          ) : (
            <motion.div
              className="bg-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-background border-2 border-border shadow-md"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              ∅
            </motion.div>
          )}
          <div className="absolute bottom-2 right-2 text-xs font-semibold text-primary-foreground">
            RED CELLS
          </div>
        </motion.div>
        
        {/* Animated Bubbles */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-background bg-opacity-30 rounded-full"
              animate={{
                y: [-10, -300],
                x: [Math.random() * 60, Math.random() * 60],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear"
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                bottom: '20%'
              }}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Test Tube Base */}
      <div className="w-32 h-4 bg-secondary/80 rounded-b-full border-4 border-secondary shadow-lg"></div>
    </div>
  );
};

// Information Panel Component
const InformationPanel = ({ bloodType }) => {
  const data = bloodTypes[bloodType];
  
  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="pb-2">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <CardTitle className="text-2xl font-bold">{data.name}</CardTitle>
          <CardDescription className="text-base">Blood composition</CardDescription>
        </motion.div>
      </CardHeader>
      
      <CardContent>
        <motion.p 
          className="text-foreground text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          This blood type {data.description}.
        </motion.p>
        
        <Tabs defaultValue="composition" className="mt-6">
          <TabsList className="w-full">
            <TabsTrigger value="composition" className="flex-1">Composition</TabsTrigger>
            <TabsTrigger value="compatibility" className="flex-1">Compatibility</TabsTrigger>
          </TabsList>
          
          <TabsContent value="composition" className="mt-4">
            <motion.div 
              className="p-4 bg-accent/10 rounded-lg border border-accent/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-muted-foreground">Antigens:</span>
                  <div className="flex gap-2 mt-1">
                    {data.antigens.length > 0 ? data.antigens.map(antigen => (
                      <Badge key={antigen} variant="secondary" className="bg-primary text-primary-foreground">
                        {antigen}
                      </Badge>
                    )) : (
                      <Badge variant="outline">None</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Antibodies:</span>
                  <div className="flex gap-2 mt-1">
                    {data.antibodies.length > 0 ? data.antibodies.map(antibody => (
                      <Badge key={antibody} variant="secondary" className="bg-chart-4 text-accent-foreground">
                        {antibody}
                      </Badge>
                    )) : (
                      <Badge variant="outline">None</Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="compatibility" className="mt-4">
            <motion.div 
              className="p-4 bg-accent/10 rounded-lg border border-accent/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-muted-foreground">Can donate to:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.canDonateTo.map(type => (
                      <Badge key={type} variant="outline" className="border-primary">
                        Type {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Can receive from:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.canReceiveFrom.map(type => (
                      <Badge key={type} variant="outline" className="border-primary">
                        Type {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {bloodType === 'O' && (
                <div className="mt-3 p-2 bg-primary/10 rounded border border-primary/20">
                  <p className="text-sm text-center">
                    Type O is known as the universal donor.
                  </p>
                </div>
              )}
              
              {bloodType === 'AB' && (
                <div className="mt-3 p-2 bg-primary/10 rounded border border-primary/20">
                  <p className="text-sm text-center">
                    Type AB is known as the universal recipient.
                  </p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start">
        <h3 className="font-semibold mb-2">Quick Facts</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>
            {bloodType === 'O' ? 'Most in demand blood type' : 
             bloodType === 'AB' ? 'Rarest blood type (~4% of population)' :
             bloodType === 'A' ? 'Second most common blood type' : 
             'Third most common blood type'}
          </li>
          <li>
            Determined by antigens on red blood cells
          </li>
        </ul>
      </CardFooter>
    </Card>
  );
};

// Main App Component
const BloodTypeInterface = () => {
  const [selectedBloodType, setSelectedBloodType] = useState('A');
  
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="inline-block px-6 py-3 shadow-md">
            <CardTitle className="text-2xl text-foreground">
              Interactive Blood Type Visualization
            </CardTitle>
          </Card>
          <p className="mt-4 text-muted-foreground">
            Click on a blood type below to learn about its composition and compatibility.
          </p>
        </motion.div>
        
        {/* Main Content */}
        <Card className="p-6">
          <CardContent className="p-0 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              {/* Blood Type Buttons */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {Object.keys(bloodTypes).map((type) => (
                  <BloodTypeButton
                    key={type}
                    type={type}
                    isActive={selectedBloodType === type}
                    onClick={setSelectedBloodType}
                  />
                ))}
              </motion.div>
              
              {/* Test Tube */}
              <div className="flex justify-center">
                <AnimatePresence mode="wait">
                  <TestTube 
                    key={selectedBloodType} 
                    bloodType={selectedBloodType} 
                  />
                </AnimatePresence>
              </div>
              
              {/* Information Panel */}
              <AnimatePresence mode="wait">
                <InformationPanel 
                  key={selectedBloodType} 
                  bloodType={selectedBloodType} 
                />
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BloodTypeInterface;