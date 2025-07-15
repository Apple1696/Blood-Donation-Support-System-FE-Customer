import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const BloodTypeButton = ({ type, isSelected, onClick, className = "" }) => (
  <Button
    variant={isSelected ? "default" : "outline"}
    onClick={() => onClick(type)}
    className={`w-14 h-14 text-base font-medium rounded-full ${isSelected
        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md'
        : 'border-primary/30 hover:border-primary/70 hover:bg-accent text-foreground'
      } ${className}`}
  >
    {type}
  </Button>
);

const ParentFigure = ({ bloodType, parentNumber }) => (
  <motion.div
    className="flex flex-col items-center space-y-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-lg font-medium text-muted-foreground">
      Parent {parentNumber}
    </h3>
    <div className="relative">
      {/* Person silhouette with gradient */}
      <div className="w-24 h-28 bg-gradient-to-b from-secondary to-secondary/80 rounded-t-2xl relative shadow-md">
        {/* Head */}
        <div className="w-10 h-10 bg-secondary rounded-full absolute -top-5 left-1/2 transform -translate-x-1/2 shadow-sm"></div>
        {/* Blood type label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-4xl font-bold text-foreground bg-background border-2 border-primary rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            key={bloodType}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            {bloodType}
          </motion.span>
        </div>
      </div>
      {/* Body/legs */}
      <div className="w-20 h-16 bg-secondary/80 mx-auto rounded-b-lg shadow-md"></div>
    </div>
  </motion.div>
);

const PossibleChildrenDisplay = ({ possibleTypes }) => (
  <motion.div
    className="flex flex-col items-center space-y-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <h3 className="text-lg font-medium text-muted-foreground">
      Possible blood type of child:
    </h3>
    <div className="relative">
      {/* Child silhouette with gradient */}
      <div className="w-20 h-24 bg-gradient-to-b from-accent to-accent/80 rounded-t-2xl relative shadow-md">
        {/* Head */}
        <div className="w-8 h-8 bg-accent rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2 shadow-sm"></div>
        {/* Blood types display */}
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <div className="text-center">
            {possibleTypes.map((type, index) => (
              <motion.span
                key={type}
                className="inline-block mx-1 text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {type}
                {index < possibleTypes.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
      {/* Body/legs */}
      <div className="w-16 h-12 bg-accent/80 mx-auto rounded-b-lg shadow-md"></div>
    </div>
  </motion.div>
);

const BloodTypeCalculator = () => {
  const [parent1Type, setParent1Type] = useState('O');
  const [parent2Type, setParent2Type] = useState('B');

  const bloodTypes = ['O', 'A', 'B', 'AB'];

  // Calculate possible children blood types based on genetics
  const calculatePossibleChildren = (p1, p2) => {
    const genetics = {
      'O': ['O', 'O'],
      'A': ['A', 'O'], // Could be AA or AO, we'll assume AO for variety
      'B': ['B', 'O'], // Could be BB or BO, we'll assume BO for variety
      'AB': ['A', 'B']
    };

    // For simplicity, we'll use the most common genotypes
    // In reality, A and B could be homozygous, but this shows the general principle
    const p1Alleles = genetics[p1] || ['O', 'O'];
    const p2Alleles = genetics[p2] || ['O', 'O'];

    const possibleCombinations = [];

    for (let allele1 of p1Alleles) {
      for (let allele2 of p2Alleles) {
        const combination = [allele1, allele2].sort();
        possibleCombinations.push(combination);
      }
    }

    // Convert genotypes to phenotypes
    const phenotypes = new Set();
    possibleCombinations.forEach(combo => {
      if (combo.includes('A') && combo.includes('B')) {
        phenotypes.add('AB');
      } else if (combo.includes('A')) {
        phenotypes.add('A');
      } else if (combo.includes('B')) {
        phenotypes.add('B');
      } else {
        phenotypes.add('O');
      }
    });

    return Array.from(phenotypes).sort();
  };

  const possibleChildren = calculatePossibleChildren(parent1Type, parent2Type);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <motion.h1
        className="text-3xl font-bold text-center mb-8 text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        How Is My Blood Type Determined?
      </motion.h1>

      <motion.p
        className="text-foreground text-center mx-auto max-w-3xl mb-8 bg-accent/5 p-4 rounded-lg border border-accent/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        It's inherited. Like eye color, blood type is passed genetically from your parents. Whether your blood group is type A, B, AB or O is based on the blood types of your mother and father.
      </motion.p>

      <Card className="bg-card shadow-xl border border-border">
        <CardHeader className="border-b border-border/30">
          <CardTitle className="text-2xl font-bold text-center">Blood Type Inheritance Calculator</CardTitle>
          <CardDescription className="text-center">
            Select blood types for both parents to see possible blood types for their children
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          {/* Blood type selection buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
            {/* Parent 1 buttons */}
            <div className="space-y-4">
              <h3 className="text-center text-foreground font-medium">Parent 1 Blood Type</h3>
              <div className="flex justify-center gap-3">
                {bloodTypes.map(type => (
                  <BloodTypeButton
                    key={`p1-${type}`}
                    type={type}
                    isSelected={parent1Type === type}
                    onClick={setParent1Type}
                  />
                ))}
              </div>
            </div>

            {/* Parent 2 buttons */}
            <div className="space-y-4">
              <h3 className="text-center text-foreground font-medium">Parent 2 Blood Type</h3>
              <div className="flex justify-center gap-3">
                {bloodTypes.map(type => (
                  <BloodTypeButton
                    key={`p2-${type}`}
                    type={type}
                    isSelected={parent2Type === type}
                    onClick={setParent2Type}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main visualization */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            {/* Parent 1 */}
            <ParentFigure bloodType={parent1Type} parentNumber={1} />

            {/* Plus sign */}
            <div className="text-4xl font-bold text-muted-foreground">+</div>

            {/* Parent 2 */}
            <ParentFigure bloodType={parent2Type} parentNumber={2} />

            {/* Equals sign */}
            <div className="text-4xl font-bold text-muted-foreground">=</div>

            {/* Possible children */}
            <PossibleChildrenDisplay possibleTypes={possibleChildren} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-border/30 bg-muted/20 p-6">
          <div className="p-5 bg-accent/10 rounded-lg border border-accent/30 w-full">
            <h4 className="font-semibold text-accent-foreground mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-primary"></span>
              Current Combination:
            </h4>

            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              <Badge variant="outline" className="bg-secondary text-secondary-foreground px-3 py-1">
                Parent 1: Type {parent1Type}
              </Badge>

              <span className="text-muted-foreground">+</span>

              <Badge variant="outline" className="bg-secondary text-secondary-foreground px-3 py-1">
                Parent 2: Type {parent2Type}
              </Badge>

              <span className="text-muted-foreground">=</span>

              <div className="flex flex-wrap gap-2">
                {possibleChildren.map((type: string) => (
                  <motion.div
                    key={type}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      Type {type}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-3 text-center">
              Note: This shows the most common genetic scenarios. Actual inheritance can vary based on specific genotypes.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BloodTypeCalculator;