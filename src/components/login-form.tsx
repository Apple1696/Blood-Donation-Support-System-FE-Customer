"use client"

import { useState } from "react"
import type React from "react"
import { useSignIn } from "@clerk/clerk-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

interface LoginFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onSwitchToSignup?: () => void
  onSwitchToResetRequest?: () => void
}

export function LoginForm({ 
  className, 
  onSwitchToSignup, 
  onSwitchToResetRequest,
  ...props 
}: LoginFormProps) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!isLoaded) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Đăng nhập thành công");
        navigate("/");
      } else {
        console.error("Sign in failed", result);
        toast.error("Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
      }
    } catch (err: any) {
      console.error("Error:", err);
      
      // Check for specific authentication errors
      if (err.errors && err.errors.length > 0) {
        const authError = err.errors[0];
        
        // Handle incorrect email/password error
        if (authError.code === "form_password_incorrect" || 
            authError.code === "form_identifier_not_found" ||
            (authError.message && authError.message.toLowerCase().includes("password")) ||
            (authError.message && authError.message.toLowerCase().includes("email"))) {
          toast.error("Email hoặc mật khẩu không chính xác");
        } else {
          toast.error(authError.message || "Đã xảy ra lỗi trong quá trình đăng nhập");
        }
      } else {
        toast.error("Đã xảy ra lỗi trong quá trình đăng nhập");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("Error:", err);
      toast.error("Đã xảy ra lỗi khi đăng nhập bằng Google");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Đăng nhập vào tài khoản</h1>
        <p className="text-balance text-sm text-muted-foreground">Nhập email của bạn để đăng nhập vào tài khoản</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="abc@gmail.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mật khẩu</Label>
            <button 
              type="button"
              onClick={onSwitchToResetRequest}
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">Hoặc tiếp tục với</span>
        </div>
        <Button 
          type="button"
          variant="outline" 
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Tiếp tục với Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Bạn chưa có tài khoản?{" "}
        <button type="button" onClick={onSwitchToSignup} className="underline underline-offset-4 hover:text-primary">
          Đăng ký
        </button>
      </div>
    </form>
  )
}