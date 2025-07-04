import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthContext } from "@/providers/AuthProvider";
import { AddressService } from "@/services/AddressService";
import EmergencyService from "@/services/EmergencyService";
import type { EmergencyRequestPayload } from "@/services/EmergencyService";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schema validation
const formSchema = z.object({
  bloodGroup: z.string().min(1, "Blood group is required"),
  bloodRh: z.string().min(1, "Blood Rh is required"),
  bloodTypeComponent: z.string().min(1, "Blood component is required"),
  requiredVolume: z.coerce.number().min(1, "Required volume must be at least 1"),
  provinceCode: z.string().min(1, "Province is required"),
  districtCode: z.string().min(1, "District is required"),
  wardCode: z.string().min(1, "Ward is required"),
  provinceName: z.string(),
  districtName: z.string(),
  wardName: z.string(),
  longitude: z.string().min(1, "Longitude is required"),
  latitude: z.string().min(1, "Latitude is required"),
});

type FormValues = z.infer<typeof formSchema>;

const RequestEmergency = () => {
  const { isAuthenticated } = useAuthContext();
  const queryClient = useQueryClient();
  
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");

  // Get address data from AddressService
  const { data: provinces, isLoading: isLoadingProvinces } = AddressService.useProvinces();
  const { data: districts, isLoading: isLoadingDistricts } = AddressService.useDistricts(selectedProvinceId);
  const { data: wards, isLoading: isLoadingWards } = AddressService.useWards(selectedDistrictId);

  // Blood types
  const bloodGroups = ["A", "B", "AB", "O"];
  const bloodRhTypes = ["+", "-"];
  const bloodComponents = [
    { id: "whole_blood", name: "Whole Blood" },
    { id: "red_cells", name: "Red Blood Cells" },
    { id: "platelets", name: "Platelets" },
    { id: "plasma", name: "Plasma" }
  ];

  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodGroup: "",
      bloodRh: "",
      bloodTypeComponent: "",
      requiredVolume: 1,
      provinceCode: "",
      districtCode: "",
      wardCode: "",
      provinceName: "",
      districtName: "",
      wardName: "",
      longitude: "",
      latitude: "",
    },
  });

  // Handle province selection
  const handleProvinceChange = (value: string) => {
    setSelectedProvinceId(value);
    setSelectedDistrictId("");
    
    const selectedProvince = provinces?.find(p => p.id === value);
    if (selectedProvince) {
      form.setValue("provinceCode", value);
      form.setValue("provinceName", selectedProvince.name);
      form.setValue("districtCode", "");
      form.setValue("districtName", "");
      form.setValue("wardCode", "");
      form.setValue("wardName", "");
      form.setValue("longitude", "");
      form.setValue("latitude", "");
    }
  };

  // Handle district selection
  const handleDistrictChange = (value: string) => {
    setSelectedDistrictId(value);
    
    const selectedDistrict = districts?.find(d => d.id === value);
    if (selectedDistrict) {
      form.setValue("districtCode", value);
      form.setValue("districtName", selectedDistrict.name);
      form.setValue("wardCode", "");
      form.setValue("wardName", "");
      form.setValue("longitude", "");
      form.setValue("latitude", "");
    }
  };

  // Handle ward selection
  const handleWardChange = (value: string) => {
    const selectedWard = wards?.find(w => w.id === value);
    if (selectedWard) {
      form.setValue("wardCode", value);
      form.setValue("wardName", selectedWard.name);
      
      // Explicitly set longitude and latitude from ward data
      if (selectedWard.longitude && selectedWard.latitude) {
        form.setValue("longitude", selectedWard.longitude);
        form.setValue("latitude", selectedWard.latitude);
        console.log(`Set location coordinates: ${selectedWard.longitude}, ${selectedWard.latitude}`);
      } else {
        console.warn("Selected ward does not have longitude/latitude data");
        form.setValue("longitude", "0");
        form.setValue("latitude", "0");
      }
    }
  };

  // Use the provided hook from EmergencyService
  const createEmergencyMutation = EmergencyService.useCreateEmergencyRequest();

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    console.log("Submitting emergency request with values:", values);
    createEmergencyMutation.mutate(values as EmergencyRequestPayload, {
      onSuccess: () => {
        toast.success("Emergency blood request created successfully", {
          description: "Healthcare providers have been notified",
        });
        form.reset();
        setSelectedProvinceId("");
        setSelectedDistrictId("");
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["emergencyRequests"] });
      },
      onError: (error) => {
        toast.error("Failed to create emergency request", {
          description: (error as Error).message,
        });
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to request emergency blood.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

 return (
  <div className="container mx-auto py-10">
    <Card className="max-w-2xl mx-auto shadow-xl border-2 border-primary/20 overflow-hidden">
    <CardHeader className="py-8">
        <div className="flex items-center gap-3 mb-2">
          <CardTitle className="text-3xl text-primary font-bold">Emergency Blood Request</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground text-lg">
          Critical need for blood donation - please complete all fields below
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8 pt-8">
            <div className="space-y-2">
              <h3 className="font-medium text-xl text-primary flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-destructive/10 text-destructive inline-flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 11V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v13c0 1 1 2 2 2h16"></path>
                    <path d="M12 16H6"></path>
                    <path d="M12 11H6"></path>
                    <path d="M12 6H6"></path>
                    <path d="M17 21l5-5"></path>
                    <path d="M17 16v5h5"></path>
                  </svg>
                </span>
                Blood Type Required
              </h3>
              <p className="text-sm text-muted-foreground">
                Specify the exact blood type needed for this emergency situation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium">Blood Group</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bloodRh"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium">Rh Factor</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Select Rh" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodRhTypes.map((rh) => (
                          <SelectItem key={rh} value={rh}>{rh}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bloodTypeComponent"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium">Blood Component</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Select component" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodComponents.map((component) => (
                          <SelectItem key={component.id} value={component.id}>
                            {component.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requiredVolume"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-medium">Required Volume (ml)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter required volume" 
                      {...field}
                      min={1}
                      className="bg-muted/50"
                    />
                  </FormControl>
                  <FormDescription className="text-sm">
                    Specify the volume of blood needed in milliliters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2 pt-2">
              <h3 className="font-medium text-xl text-primary flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-destructive/10 text-destructive inline-flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4"></path>
                    <path d="M9.17 15.5c.15.2.33.38.53.52a2.5 2.5 0 0 0 4.6 0 2.63 2.63 0 0 0 .53-.52"></path>
                  </svg>
                </span>
                Location Details
              </h3>
              <p className="text-sm text-muted-foreground">
                Select the exact location where the blood is urgently needed
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="provinceCode"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium">Province</FormLabel>
                    <Select 
                      onValueChange={handleProvinceChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingProvinces ? (
                          <SelectItem value="loading" disabled>Loading provinces...</SelectItem>
                        ) : (
                          provinces?.map((province) => (
                            <SelectItem key={province.id} value={province.id}>
                              {province.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="districtCode"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium">District</FormLabel>
                    <Select 
                      onValueChange={handleDistrictChange} 
                      defaultValue={field.value}
                      disabled={!selectedProvinceId}
                    >
                      <FormControl>
                        <SelectTrigger className={`bg-muted/50 ${!selectedProvinceId ? 'opacity-60' : ''}`}>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingDistricts ? (
                          <SelectItem value="loading" disabled>Loading districts...</SelectItem>
                        ) : (
                          districts?.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wardCode"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium">Ward</FormLabel>
                    <Select 
                      onValueChange={handleWardChange} 
                      defaultValue={field.value}
                      disabled={!selectedDistrictId}
                    >
                      <FormControl>
                        <SelectTrigger className={`bg-muted/50 ${!selectedDistrictId ? 'opacity-60' : ''}`}>
                          <SelectValue placeholder="Select ward" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingWards ? (
                          <SelectItem value="loading" disabled>Loading wards...</SelectItem>
                        ) : (
                          wards?.map((ward) => (
                            <SelectItem key={ward.id} value={ward.id}>
                              {ward.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Hidden fields for longitude and latitude */}
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <input type="hidden" {...field} />
              )}
            />
            
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <input type="hidden" {...field} />
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-8 pb-8 bg-muted/30">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => form.reset()}
              disabled={createEmergencyMutation.isPending}
              className="border-2 hover:bg-background/80"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className=" px-8 py-6 font-semibold"
              disabled={createEmergencyMutation.isPending}
            >
              {createEmergencyMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  
                  Submit Emergency Request
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  </div>
);
};

export default RequestEmergency;