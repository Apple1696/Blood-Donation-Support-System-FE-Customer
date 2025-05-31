import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const { user } = useUser();

  if (!user) return null;

  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.emailAddresses[0].emailAddress[0].toUpperCase();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Button variant="outline">Change Image</Button>
              <Button variant="outline">Remove Image</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              We support PNGs, JPEGs and GIFs under 2MB
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input 
                value={user.firstName || ""} 
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input 
                value={user.lastName || ""} 
                className="mt-1"
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Account Security</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="flex gap-4 items-center mt-1">
                <Input 
                  value={user.emailAddresses[0].emailAddress} 
                  className="flex-1"
                  readOnly
                />
                <Button variant="outline">Change email</Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="flex gap-4 items-center mt-1">
                <Input 
                  type="password"
                  value="••••••••••"
                  className="flex-1"
                  readOnly
                />
                <Button variant="outline">Change password</Button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">2-Step Verifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an additional layer of security to your account during login.
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Support Access</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Support access</h3>
                <p className="text-sm text-muted-foreground">
                  You have granted us to access to your account for support purposes until Aug 31, 2023, 9:40 PM.
                </p>
              </div>
              <Switch />
            </div>

            <div>
              <h3 className="font-medium mb-1">Log out of all devices</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Log out of all other active sessions on other devices besides this one.
              </p>
              <Button variant="outline">Log out</Button>
            </div>

            <div>
              <h3 className="font-medium text-destructive mb-1">Delete my account</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Permanently delete the account and remove access from all workspaces.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
