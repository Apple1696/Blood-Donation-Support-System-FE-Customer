import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Calendar, MapPin, Award, Heart, Clock, Users, Droplets, TrendingUp } from 'lucide-react';

const BloodDonationHistory = () => {
  const [activeTab, setActiveTab] = useState('history');

  // Mock data
  const donationHistory = [
    {
      id: 1,
      date: '2024-05-15',
      campaign: 'Spring Blood Drive 2024',
      location: 'City Hospital Blood Center',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
      healthCheck: 'passed',
      nextEligible: '2024-07-15'
    },
    {
      id: 2,
      date: '2024-02-20',
      campaign: 'Valentine\'s Life Gift Campaign',
      location: 'Community Center',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
      healthCheck: 'passed',
      nextEligible: '2024-04-20'
    },
    {
      id: 3,
      date: '2023-11-10',
      campaign: 'Emergency Blood Appeal',
      location: 'Downtown Medical Plaza',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
      healthCheck: 'passed',
      nextEligible: '2024-01-10'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      date: '2024-07-20',
      time: '10:30 AM',
      campaign: 'Summer Heroes Blood Drive',
      location: 'Regional Blood Bank',
      status: 'confirmed'
    }
  ];

  const achievements = [
    { title: 'First Time Hero', description: 'Completed your first donation', earned: true },
    { title: 'Life Saver', description: 'Donated 3 times', earned: true },
    { title: 'Regular Hero', description: 'Donated 5 times', earned: false, progress: 60 },
    { title: 'Community Champion', description: 'Participated in 3 different campaigns', earned: true }
  ];

  const stats = {
    totalDonations: 3,
    totalAmount: '1.35L',
    livesImpacted: 9,
    nextEligibleDate: '2024-07-15'
  };

  const StatusBadge = ({ status }) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen container mx-auto pt-8 pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Donation Journey</h1>
          </div>
          <p className="text-gray-600">Track your blood donation history and impact</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Droplets className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Total Donations</p>
                  <p className="text-2xl font-bold">{stats.totalDonations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Total Amount</p>
                  <p className="text-2xl font-bold">{stats.totalAmount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Lives Impacted</p>
                  <p className="text-2xl font-bold">{stats.livesImpacted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Next Eligible</p>
                  <p className="text-lg font-bold">Jul 15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">Donation History</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Donation History Tab */}
          <TabsContent value="history" className="space-y-4">
            {donationHistory.map((donation) => (
              <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{donation.campaign}</CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(donation.date).toLocaleDateString()}</span>
                        <MapPin className="h-4 w-4 ml-2" />
                        <span>{donation.location}</span>
                      </CardDescription>
                    </div>
                    <StatusBadge status={donation.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Blood Type</p>
                      <p className="font-semibold text-red-600">{donation.bloodType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-semibold">{donation.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Health Check</p>
                      <p className="font-semibold capitalize text-green-600">{donation.healthCheck}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Next Eligible</p>
                      <p className="font-semibold">{new Date(donation.nextEligible).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{appointment.campaign}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{appointment.location}</span>
                          </div>
                        </CardDescription>
                      </div>
                      <StatusBadge status={appointment.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Reschedule</Button>
                      <Button variant="outline" size="sm">Cancel</Button>
                      <Button size="sm">Get Directions</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Upcoming Appointments</h3>
                  <p className="text-gray-500 mb-4">Ready to save more lives? Schedule your next donation.</p>
                  <Button className="bg-red-600 hover:bg-red-700">Schedule Donation</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`${achievement.earned ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className={`${achievement.earned ? 'bg-yellow-500' : 'bg-gray-300'}`}>
                        <AvatarFallback>
                          <Award className="h-6 w-6 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{achievement.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{achievement.description}</p>
                        {achievement.earned ? (
                          <Badge className="bg-yellow-500 text-white">Earned!</Badge>
                        ) : (
                          <div className="space-y-2">
                            <Progress value={achievement.progress} className="h-2" />
                            <p className="text-xs text-gray-500">{achievement.progress}% complete</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
          <CardContent className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ready to Make a Difference Again?</h2>
            <p className="mb-6 opacity-90">Your next donation could save up to 3 lives. Every drop counts.</p>
            <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
              Schedule Next Donation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BloodDonationHistory;