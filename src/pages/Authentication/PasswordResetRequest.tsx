"use client"

import { useState } from "react"
import type React from "react"
import { useSignIn } from "@clerk/clerk-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface PasswordResetRequestProps extends React.ComponentPropsWithoutRef<"form"> {
  onBackToLogin?: () => void
  onResetRequested?: (email: string) => void
}

export function PasswordResetRequest({ 
  className, 
  onBackToLogin, 
  onResetRequested,
  ...props 
}: PasswordResetRequestProps) {
  const { isLoaded, signIn } = useSignIn()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isLoaded) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create a sign-in attempt with password reset strategy
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })

      toast.success("Email xác nhận đã được gửi! Vui lòng kiểm tra hộp thư của bạn.")
      onResetRequested?.(email)
    } catch (err: any) {
      console.error("Password reset error:", err)
      
      if (err.errors && err.errors.length > 0) {
        const resetError = err.errors[0]
        
        if (resetError.code === "form_identifier_not_found") {
          toast.error("Không tìm thấy tài khoản với email này")
        } else {
          toast.error(resetError.message || "Đã xảy ra lỗi khi gửi email đặt lại mật khẩu")
        }
      } else {
        toast.error("Đã xảy ra lỗi khi gửi email đặt lại mật khẩu")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Nhập email của bạn và chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu
        </p>
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
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang gửi..." : "Gửi email đặt lại mật khẩu"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Nhớ mật khẩu?{" "}
        <button 
          type="button" 
          onClick={onBackToLogin} 
          className="underline underline-offset-4 hover:text-primary"
        >
          Quay lại đăng nhập
        </button>
      </div>
    </form>
  )
}