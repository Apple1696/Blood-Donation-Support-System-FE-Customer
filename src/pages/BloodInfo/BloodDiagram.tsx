import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const BloodDonationAnimation = () => {
  const [selectedDonor, setSelectedDonor] = useState<string | null>(null);

  const handleDonorClick = (bloodType: string) => {
    setSelectedDonor(selectedDonor === bloodType ? null : bloodType);
  };

  // Blood donation compatibility mapping
  const compatibility = {
    O: ['O', 'A', 'B', 'AB'],
    A: ['A', 'AB'],
    B: ['B', 'AB'],
    AB: ['AB']
  };

  // Animation variants for the connecting lines
  const lineVariants = {
    hidden: { 
      pathLength: 0,
      opacity: 0
    },
    visible: { 
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  // Animation variants for the recipient circles
  const recipientVariants = {
    hidden: { 
      scale: 0,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };

  const donors = ['O', 'A', 'B', 'AB'];
  const recipients = ['O', 'A', 'B', 'AB'];
  
  // Positions for donors (top row)
  const donorPositions = {
    O: { x: 150, y: 60 },
    A: { x: 250, y: 60 },
    B: { x: 350, y: 60 },
    AB: { x: 450, y: 60 }
  };

  // Positions for recipients (bottom row)
  const recipientPositions = {
    O: { x: 150, y: 200 },
    A: { x: 250, y: 200 },
    B: { x: 350, y: 200 },
    AB: { x: 450, y: 200 }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center text-foreground mb-6 text-primary">Blood Types and Transfusion</h1>
      
      <div className="mb-6 text-foreground">
        <p className="mb-4">
          There are very specific ways in which blood types must be matched for a safe transfusion. The right blood transfusion can 
          mean the difference between life and death. Use the interactive graphic below to learn more about matching blood types for
          transfusions.
        </p>
        
        <p className="mb-4">
          Also, Rh-negative blood is given to Rh-negative patients, and Rh-positive or Rh-negative blood may be given to Rh-positive
          patients. The rules for plasma are the reverse.
        </p>
        
        <ul className="list-disc pl-6 text-primary space-y-2">
          <li className="font-medium">The universal red cell donor has Type O negative blood.</li>
          <li className="font-medium">The universal plasma donor has Type AB blood.</li>
        </ul>
      </div>
      
      <Card className="border-border shadow-lg">
        <CardHeader className="bg-card/50">
          <CardTitle className="text-2xl text-center text-card-foreground">Blood Donation Compatibility</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Click on a donor blood type to see compatible recipients
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          
          <div className="relative bg-secondary/20 rounded-lg p-4 border border-border">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-primary rounded-full mr-2"></div>
              <span className="text-sm font-medium text-foreground">Donor</span>
              <div className="w-4 h-4 bg-muted rounded-full ml-6 mr-2"></div>
              <span className="text-sm font-medium text-foreground">Recipient</span>
            </div>
            
            <svg width="600" height="280" viewBox="0 0 600 280" className="mx-auto">
              {/* Donor circles */}
              {donors.map((bloodType) => (
                <motion.g key={`donor-${bloodType}`}>
                  <motion.circle
                    cx={donorPositions[bloodType as keyof typeof donorPositions].x}
                    cy={donorPositions[bloodType as keyof typeof donorPositions].y}
                    r="25"
                    fill={selectedDonor === bloodType ? "var(--primary)" : "var(--background)"}
                    stroke="var(--primary)"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => handleDonorClick(bloodType)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <text
                    x={donorPositions[bloodType as keyof typeof donorPositions].x}
                    y={donorPositions[bloodType as keyof typeof donorPositions].y + 5}
                    textAnchor="middle"
                    className={`font-bold text-lg pointer-events-none ${selectedDonor === bloodType ? 'fill-primary-foreground' : 'fill-primary'}`}
                  >
                    {bloodType}
                  </text>
                </motion.g>
              ))}

              {/* Connection lines and recipient circles */}
              <AnimatePresence mode="wait">
                {selectedDonor && (
                  <>
                    {compatibility[selectedDonor as keyof typeof compatibility].map((recipientType, index) => (
                      <motion.g key={`${selectedDonor}-to-${recipientType}`}>
                        {/* Connection line */}
                        <motion.path
                          key={`line-${selectedDonor}-to-${recipientType}`}
                          d={`M ${donorPositions[selectedDonor as keyof typeof donorPositions].x} ${donorPositions[selectedDonor as keyof typeof donorPositions].y + 25} 
                              Q ${donorPositions[selectedDonor as keyof typeof donorPositions].x} ${130} 
                              ${recipientPositions[recipientType as keyof typeof recipientPositions].x} ${recipientPositions[recipientType as keyof typeof recipientPositions].y - 25}`}
                          stroke="var(--primary)"
                          strokeWidth="2"
                          fill="none"
                          variants={lineVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        />
                        
                        {/* Recipient circle */}
                        <motion.circle
                          key={`circle-${selectedDonor}-to-${recipientType}`}
                          cx={recipientPositions[recipientType as keyof typeof recipientPositions].x}
                          cy={recipientPositions[recipientType as keyof typeof recipientPositions].y}
                          r="25"
                          fill="var(--primary)"
                          variants={recipientVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        />
                        
                        {/* Recipient text */}
                        <motion.text
                          key={`text-${selectedDonor}-to-${recipientType}`}
                          x={recipientPositions[recipientType as keyof typeof recipientPositions].x}
                          y={recipientPositions[recipientType as keyof typeof recipientPositions].y + 5}
                          textAnchor="middle"
                          className="fill-primary-foreground font-bold text-lg"
                          variants={recipientVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          {recipientType}
                        </motion.text>
                      </motion.g>
                    ))}
                  </>
                )}
              </AnimatePresence>

              {/* Static recipient circles (grayed out when not selected) */}
              {!selectedDonor && recipients.map((bloodType) => (
                <motion.g key={`static-recipient-${bloodType}`}>
                  <circle
                    cx={recipientPositions[bloodType as keyof typeof recipientPositions].x}
                    cy={recipientPositions[bloodType as keyof typeof recipientPositions].y}
                    r="25"
                    fill="var(--muted)"
                  />
                  <text
                    x={recipientPositions[bloodType as keyof typeof recipientPositions].x}
                    y={recipientPositions[bloodType as keyof typeof recipientPositions].y + 5}
                    textAnchor="middle"
                    className="fill-muted-foreground font-bold text-lg"
                  >
                    {bloodType}
                  </text>
                </motion.g>
              ))}

              {/* Labels */}
              <text x="20" y="65" className="fill-foreground text-sm font-medium">DONOR</text>
              <text x="20" y="205" className="fill-foreground text-sm font-medium">RECIPIENT</text>
            </svg>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2 bg-muted/10 p-6 border-t border-border">
          {selectedDonor ? (
            <>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="bg-primary text-primary-foreground">
                  Type {selectedDonor}
                </Badge>
                <span className="text-foreground">can donate to:</span>
                {compatibility[selectedDonor as keyof typeof compatibility].map((type) => (
                  <Badge key={type} variant="secondary" className="bg-secondary text-secondary-foreground">
                    {type}
                  </Badge>
                ))}
              </div>
              
              {selectedDonor === 'O' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 p-3 bg-accent/20 rounded-lg border border-accent/30"
                >
                  <p className="text-center text-accent-foreground flex items-center justify-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-chart-5"></span>
                    Type O is the universal donor! Blood from O donors can be given to any recipient.
                  </p>
                </motion.div>
              )}
              
              {selectedDonor === 'AB' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 p-3 bg-accent/20 rounded-lg border border-accent/30"
                >
                  <p className="text-center text-accent-foreground flex items-center justify-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-chart-3"></span>
                    Type AB is the universal recipient! AB recipients can receive blood from any donor.
                  </p>
                </motion.div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Click on a donor blood type above to see compatibility
              </p>
              <div className="flex gap-2">
                {['O', 'A', 'B', 'AB'].map((type, i) => (
                  <Badge key={type} variant="outline" className="border-chart-1 text-foreground">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
       <div className="mt-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
        <p className="text-foreground text-center">
          There are more than 300 other known antigens, the presence or absence of which creates "rare blood types." 
          Certain blood types are unique to specific ethnic or racial groups. Learn about <Link to="/blood-types" className="text-primary font-medium hover:underline">blood and diversity</Link>.
        </p>
      </div>
    </div>
  );
};

export default BloodDonationAnimation;