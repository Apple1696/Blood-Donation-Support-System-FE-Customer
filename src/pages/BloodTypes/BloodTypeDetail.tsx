import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import type { BloodInfo } from '@/services/BloodInfoService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BloodTypeDetailProps {
  bloodInfo: BloodInfo;
}

const BloodTypeDetail: React.FC<BloodTypeDetailProps> = ({ bloodInfo }) => {
  const { 
    group, 
    rh, 
    description, 
    characteristics, 
    canDonateTo, 
    canReceiveFrom, 
    frequency, 
    specialNotes 
  } = bloodInfo;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Characteristics</h3>
            <p className="text-muted-foreground">{characteristics}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2} className="text-center">Blood Type {group}{rh} Information</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Frequency</TableCell>
                <TableCell>{frequency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Can Donate To</TableCell>
                <TableCell>{canDonateTo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Can Receive From</TableCell>
                <TableCell>{canReceiveFrom}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Special Notes</TableCell>
                <TableCell>{specialNotes}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodTypeDetail;