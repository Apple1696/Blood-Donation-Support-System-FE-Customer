import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  bloodGroup: z.string().min(1, "Nhóm máu là bắt buộc"),
  bloodRh: z.string().min(1, "Yếu tố Rh là bắt buộc"),
  bloodTypeComponent: z.string().min(1, "Thành phần máu là bắt buộc"),
  requiredVolume: z.coerce.number().min(1, "Thể tích yêu cầu phải ít nhất là 1"),
  provinceCode: z.string().min(1, "Tỉnh/Thành phố là bắt buộc"),
  districtCode: z.string().min(1, "Quận/Huyện là bắt buộc"),
  wardCode: z.string().min(1, "Phường/Xã là bắt buộc"),
  provinceName: z.string(),
  districtName: z.string(),
  wardName: z.string(),
  longitude: z.string().min(1, "Kinh độ là bắt buộc"),
  latitude: z.string().min(1, "Vĩ độ là bắt buộc"),
});

type FormValues = z.infer<typeof formSchema>;

const RequestEmergency = () => {
  const { isAuthenticated } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
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
    { id: "whole_blood", name: "Máu toàn phần" },
    { id: "red_cells", name: "Hồng cầu" },
    { id: "platelets", name: "Tiểu cầu" },
    { id: "plasma", name: "Huyết tương" }
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
        toast.success("Yêu cầu máu khẩn cấp đã được tạo thành công", {
          description: "Các nhà cung cấp dịch vụ y tế đã được thông báo",
        });
        form.reset();
        setSelectedProvinceId("");
        setSelectedDistrictId("");
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["emergencyRequests"] });
        
        // Redirect to view requests page
        navigate("/view-requests");
      },
      onError: (error) => {
        toast.error("Không thể tạo yêu cầu khẩn cấp", {
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
            <CardTitle>Yêu cầu xác thực</CardTitle>
            <CardDescription>Bạn cần đăng nhập để yêu cầu máu khẩn cấp.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

 return (
  <div className="container mx-auto py-10">
    <Card className="max-w-2xl mx-auto shadow-xl border-2 border-primary/20 overflow-hidden">
    <CardHeader className="py-2">
        <div className="flex items-center gap-3 mb-1">
          <CardTitle className="text-3xl text-primary font-bold">Yêu Cầu Máu Khẩn Cấp</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground text-lg">
          Nhu cầu cấp thiết về hiến máu - vui lòng điền đầy đủ thông tin dưới đây
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-4">
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
                Nhóm Máu Cần Thiết
              </h3>
              <p className="text-sm text-muted-foreground">
                Chỉ rõ loại máu chính xác cần thiết cho tình huống khẩn cấp này
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium">Nhóm máu</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Chọn nhóm máu" />
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
                    <FormLabel className="font-medium">Yếu tố Rh</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Chọn Rh" />
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
                    <FormLabel className="font-medium">Thành phần máu</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Chọn thành phần" />
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
                  <FormLabel className="font-medium">Thể tích cần thiết (ml)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Nhập thể tích cần thiết" 
                      {...field}
                      min={1}
                      className="bg-muted/50"
                    />
                  </FormControl>
                  <FormDescription className="text-sm">
                    Chỉ định thể tích máu cần thiết tính bằng mililít
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
                Chi tiết địa điểm
              </h3>
              <p className="text-sm text-muted-foreground">
                Chọn vị trí chính xác nơi cần máu khẩn cấp
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="provinceCode"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium">Tỉnh/Thành phố</FormLabel>
                    <Select 
                      onValueChange={handleProvinceChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingProvinces ? (
                          <SelectItem value="loading" disabled>Đang tải dữ liệu...</SelectItem>
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
                    <FormLabel className="font-medium">Quận/Huyện</FormLabel>
                    <Select 
                      onValueChange={handleDistrictChange} 
                      defaultValue={field.value}
                      disabled={!selectedProvinceId}
                    >
                      <FormControl>
                        <SelectTrigger className={`bg-muted/50 ${!selectedProvinceId ? 'opacity-60' : ''}`}>
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingDistricts ? (
                          <SelectItem value="loading" disabled>Đang tải dữ liệu...</SelectItem>
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
                    <FormLabel className="font-medium">Phường/Xã</FormLabel>
                    <Select 
                      onValueChange={handleWardChange} 
                      defaultValue={field.value}
                      disabled={!selectedDistrictId}
                    >
                      <FormControl>
                        <SelectTrigger className={`bg-muted/50 ${!selectedDistrictId ? 'opacity-60' : ''}`}>
                          <SelectValue placeholder="Chọn phường/xã" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingWards ? (
                          <SelectItem value="loading" disabled>Đang tải dữ liệu...</SelectItem>
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
              Hủy bỏ
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
                  Đang xử lý...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  
                  Gửi yêu cầu khẩn cấp
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