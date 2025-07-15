import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEmergencyRequestById } from "../../services/EmergencyService";
import { format } from "date-fns";
import { MapPin, Clock, Calendar, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

const EmergencyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: emergency, isLoading, isError } = useGetEmergencyRequestById(id || "");

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"><Clock className="h-3 w-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200"><Clock className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBloodTypeBadge = (bloodGroup: string, bloodRh: string) => {
    return (
      <Badge className="bg-primary text-primary-foreground font-bold text-lg px-3 py-1">
        {bloodGroup}{bloodRh}
      </Badge>
    );
  };

  const getComponentBadge = (component: string) => {
    const componentMap: Record<string, { label: string, className: string }> = {
      'plasma': { label: 'Plasma', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'platelets': { label: 'Platelets', className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'red_cells': { label: 'Red Cells', className: 'bg-red-100 text-red-800 border-red-200' },
      'whole_blood': { label: 'Whole Blood', className: 'bg-rose-100 text-rose-800 border-rose-200' },
    };

    const { label, className } = componentMap[component] || { label: component, className: '' };
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading emergency request details...</p>
      </div>
    );
  }

  if (isError || !emergency) {
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center text-destructive">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Request</h2>
        <p className="text-muted-foreground mb-8">Unable to load the emergency request details.</p>
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        onClick={handleGoBack} 
        className="mb-6 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Emergency Requests
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl mb-2">
                  Emergency Blood Request
                </CardTitle>
                <CardDescription>
                  ID: {emergency.id}
                </CardDescription>
              </div>
              {getStatusBadge(emergency.status)}
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Required Blood</h3>
                <div className="flex items-center gap-2">
                  {getBloodTypeBadge(emergency.bloodType.group, emergency.bloodType.rh)}
                  {getComponentBadge(emergency.bloodTypeComponent)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Required Volume</p>
                  <p className="font-medium">{emergency.requiredVolume} ml</p>
                </div>
                {emergency.usedVolume > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Used Volume</p>
                    <p className="font-medium">{emergency.usedVolume} ml</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Location Details</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{emergency.wardName}</p>
                    <p className="text-muted-foreground">
                      {emergency.districtName}, {emergency.provinceName}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Date Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p>{format(new Date(emergency.startDate), "MMMM d, yyyy")}</p>
                      </div>
                    </div>
                    {emergency.endDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">End Date</p>
                          <p>{format(new Date(emergency.endDate), "MMMM d, yyyy")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Timestamps</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p>{format(new Date(emergency.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p>{format(new Date(emergency.updatedAt), "MMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Info Card */}
        <div className="space-y-6">
        

          {emergency.bloodUnit && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blood Unit Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Unit ID</p>
                    <p className="font-medium">{emergency.bloodUnit.id || "Not assigned"}</p>
                  </div>
                  {emergency.bloodUnit.donatedBy && (
                    <div>
                      <p className="text-sm text-muted-foreground">Donated By</p>
                      <p className="font-medium">{emergency.bloodUnit.donatedBy.name || "Anonymous"}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergency.status === "pending" && (
                <>
                  <Button className="w-full" variant="default">Respond to Request</Button>
                  <Button className="w-full" variant="outline">Contact Requester</Button>
                </>
              )}
              {emergency.status === "approved" && (
                <Button className="w-full" variant="outline">View Donation Details</Button>
              )}
              <Button className="w-full" variant="outline">Share Request</Button>
            </CardContent>
          </Card>

          {/* Coordinates Card */}
          {(emergency.latitude && emergency.longitude) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location Coordinates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Latitude</p>
                    <p className="font-medium">{emergency.latitude}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Longitude</p>
                    <p className="font-medium">{emergency.longitude}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.open(`https://maps.google.com/?q=${emergency.latitude},${emergency.longitude}`, '_blank')}>
                  Open in Maps
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyDetail;