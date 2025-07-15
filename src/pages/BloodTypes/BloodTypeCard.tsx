import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BloodInfo } from '@/services/BloodInfoService';

interface BloodTypeCardProps {
  bloodInfo: BloodInfo;
}

const BloodTypeCard: React.FC<BloodTypeCardProps> = ({ bloodInfo }) => {
  const { group, rh, frequency } = bloodInfo;
  
  // Define blood type background colors
  const getCardStyle = () => {
    switch (group) {
      case 'O':
        return rh === '+' ? 'bg-red-50 border-red-200' : 'bg-red-100 border-red-300';
      case 'A':
        return rh === '+' ? 'bg-blue-50 border-blue-200' : 'bg-blue-100 border-blue-300';
      case 'B':
        return rh === '+' ? 'bg-green-50 border-green-200' : 'bg-green-100 border-green-300';
      case 'AB':
        return rh === '+' ? 'bg-purple-50 border-purple-200' : 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${getCardStyle()} border-2`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold">{group}{rh}</span>
          <Badge variant={rh === '+' ? 'default' : 'outline'}>
            {rh === '+' ? 'Dương' : 'Âm'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{frequency}</p>
        <Link to={`/blood-types/${group}/${rh}`}>
          <Button 
            variant="outline"
            className="w-full"
          >
            Xem Chi Tiết
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BloodTypeCard;