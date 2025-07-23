import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, Clock, User, Droplets, AlertCircle } from 'lucide-react';
import { useGetMyReminders, type Reminder } from '@/services/ReminderService';

const BloodDonationReminder = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGetMyReminders({
    page: currentPage,
    limit
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilEligible = (eligibleDate: string) => {
    const today = new Date();
    const eligible = new Date(eligibleDate);
    const diffTime = eligible.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isEligibleNow = (eligibleDate: string) => {
    const today = new Date();
    const eligible = new Date(eligibleDate);
    return today >= eligible;
  };

  const getWaitingPeriodProgress = (lastDonationDate: string, eligibleDate: string) => {
    const lastDonation = new Date(lastDonationDate);
    const eligible = new Date(eligibleDate);
    const today = new Date();
    
    const totalPeriod = eligible.getTime() - lastDonation.getTime();
    const elapsed = today.getTime() - lastDonation.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / totalPeriod) * 100));
  };

  const ReminderCard = ({ reminder }: { reminder: Reminder }) => {
    const daysUntilEligible = getDaysUntilEligible(reminder.metadata.eligibleDate);
    const eligible = isEligibleNow(reminder.metadata.eligibleDate);
    const progress = getWaitingPeriodProgress(
      reminder.metadata.lastDonationDate, 
      reminder.metadata.eligibleDate
    );

    return (
      <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-red-50/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-lg text-foreground">Blood Donation Reminder</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  ID: {reminder.id.slice(-8)}
                </CardDescription>
              </div>
            </div>
            <Badge 
              variant={eligible ? "default" : "secondary"}
              className={`${
                eligible 
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-md" 
                  : "bg-secondary text-secondary-foreground"
              } transition-colors duration-200`}
            >
              {eligible ? "✓ Eligible Now" : `${daysUntilEligible} days left`}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Message */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
            <p className="text-sm text-foreground font-medium leading-relaxed">
              {reminder.message}
            </p>
          </div>

          {/* Donor Information */}
          <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-lg">
                {reminder.donor.firstName} {reminder.donor.lastName}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-foreground">
                    {reminder.donor.bloodType.group}{reminder.donor.bloodType.rh}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {reminder.donor.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Date Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                Last Donation
              </div>
              <p className="text-foreground font-medium">
                {formatDate(reminder.metadata.lastDonationDate)}
              </p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Clock className="h-4 w-4 text-primary" />
                Eligible From
              </div>
              <p className="text-foreground font-medium">
                {formatDate(reminder.metadata.eligibleDate)}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Waiting Period Progress</span>
              <span className="text-sm font-semibold text-primary">
                {eligible ? "Complete ✓" : `${Math.round(progress)}%`}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ease-out ${
                  eligible ? "bg-green-500" : "bg-gradient-to-r from-red-500 to-red-400"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {eligible 
                ? "You can now donate blood!" 
                : `${Math.ceil((100 - progress) * 90 / 100)} days remaining approximately`
              }
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {eligible ? (
              <>
                <Button className="flex-1 bg-primary hover:bg-primary/90 shadow-md transition-all duration-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Donation
                </Button>
                <Button variant="outline" className="hover:bg-secondary/80 transition-colors duration-200">
                  <Heart className="w-4 h-4 mr-2" />
                  Find Campaigns
                </Button>
              </>
            ) : (
              <Button variant="outline" className="flex-1" disabled>
                <Clock className="w-4 h-4 mr-2" />
                Not Eligible Yet
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg text-muted-foreground">Loading reminders...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Error Loading Reminders</h3>
                <p className="text-muted-foreground mt-2">
                  Unable to fetch your reminders. Please try again later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const reminders = data?.data.items || [];
  const total = data?.data.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Blood Donation Reminders</h1>
          <p className="text-muted-foreground">
            {total > 0 ? `${total} reminder${total > 1 ? 's' : ''} found` : 'No reminders yet'}
          </p>
        </div>
      </div>

      {/* Reminders List */}
      {reminders.length > 0 ? (
        <div className="space-y-6">
          {reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center min-h-64">
            <div className="text-center space-y-3">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">No Reminders</h3>
                <p className="text-muted-foreground">
                  You don't have any reminders with the current filter.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodDonationReminder;