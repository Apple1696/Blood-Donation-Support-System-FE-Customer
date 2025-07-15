import React, { useState, useEffect } from 'react';
import BloodInfoService from '../../services/BloodInfoService';
import type { BloodInfo } from '../../services/BloodInfoService';
import BloodTypeCard from './BloodTypeCard';
import { Loader2 } from "lucide-react";

const BloodInfoPage: React.FC = () => {
  const [bloodTypes, setBloodTypes] = useState<BloodInfo[]>([]);
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


 
  return (
    <div className="container mx-auto px-16 pb-8 max-w-7xl">
      <h1 className="text-3xl pt-8 font-bold text-center mb-8">
        Blood Type Information Center
      </h1>

   

      {loading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {bloodTypes.map((type) => (
            <BloodTypeCard 
              key={`${type.group}${type.rh}`}
              bloodInfo={type}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodInfoPage;