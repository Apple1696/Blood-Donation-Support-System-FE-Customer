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
  
  // Extract percentage from frequency string and determine rarity
  const getRarityInfo = (frequency: string) => {
    // Extract percentage number from frequency string
    const percentMatch = frequency.match(/(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?%/);
    if (!percentMatch) return { level: 'Unknown', color: 'secondary', percentage: 0 };
    
    // Use the higher percentage if it's a range, otherwise use the single value
    const percentage = percentMatch[2] ? parseFloat(percentMatch[2]) : parseFloat(percentMatch[1]);
    
    if (percentage >= 30) {
      return { level: 'Phổ Biến', color: 'default', percentage };
    } else if (percentage >= 8) {
      return { level: 'Bình Thường', color: 'secondary', percentage };
    } else if (percentage >= 3) {
      return { level: 'Ít Gặp', color: 'outline', percentage };
    } else {
      return { level: 'Hiếm', color: 'destructive', percentage };
    }
  };

  const rarityInfo = getRarityInfo(frequency);
  
  // Define blood type background colors
  const getCardStyle = () => {
    switch (group) {
      case 'O':
        return rh === '+' ? 'bg-red-50 border-red-200 hover:border-red-400' : 'bg-red-100 border-red-300 hover:border-red-500';
      case 'A':
        return rh === '+' ? 'bg-blue-50 border-blue-200 hover:border-blue-400' : 'bg-blue-100 border-blue-300 hover:border-blue-500';
      case 'B':
        return rh === '+' ? 'bg-green-50 border-green-200 hover:border-green-400' : 'bg-green-100 border-green-300 hover:border-green-500';
      case 'AB':
        return rh === '+' ? 'bg-purple-50 border-purple-200 hover:border-purple-400' : 'bg-purple-100 border-purple-300 hover:border-purple-500';
      default:
        return 'bg-gray-50 border-gray-200 hover:border-gray-400';
    }
  };

  // Get custom badge styles based on rarity to avoid conflicts with Rh badges
  const getRarityBadgeStyle = (color: string) => {
    switch (color) {
      case 'default': // Phổ Biến - Green
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'secondary': // Bình Thường - Blue  
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case 'outline': // Ít Gặp - Yellow/Orange
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200';
      case 'destructive': // Hiếm - Red
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  return (
    <Card className={`
      transition-all duration-300 ease-in-out
      hover:shadow-xl hover:scale-105 hover:-translate-y-1
      cursor-pointer border-2 
      ${getCardStyle()}
      group
    `}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <span className="text-3xl font-bold group-hover:scale-110 transition-transform duration-200">
            {group}{rh}
          </span>
          <div className="flex flex-col items-end space-y-1">
            <Badge 
              variant={rh === '+' ? 'default' : 'secondary'}
              className="group-hover:scale-105 transition-transform duration-200 font-medium"
            >
              {rh === '+' ? 'Dương' : 'Âm'}
            </Badge>
            <Badge 
              variant="outline"
              className={`text-xs font-medium border transition-colors duration-200 ${getRarityBadgeStyle(rarityInfo.color)}`}
            >
              {rarityInfo.level}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{frequency}</p>
          
          </div>
          
          <Link to={`/blood-types/${group}/${rh}`}>
            <Button 
              variant="outline"
              className="w-full "
            >
              Xem Chi Tiết
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodTypeCard;