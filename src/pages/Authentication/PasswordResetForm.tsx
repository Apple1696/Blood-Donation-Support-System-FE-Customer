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

interface PasswordResetFormProps extends React.ComponentPropsWithoutRef<"form"> {
  email: string
  onBackToRequest?: () => void
}

export function PasswordResetForm({ 
  className, 
  email,
  onBackToRequest,
  ...props 
}: PasswordResetFormProps) {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const navigate = useNavigate()

  if (!isLoaded) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp")
      return
    }

    if (newPassword.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự")
      return
    }

    setIsLoading(true)

    try {
      // Complete the password reset process
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code,
        password: newPassword,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        toast.success("Mật khẩu đã được đặt lại thành công!")
        navigate("/")
      } else {
        console.error("Password reset failed", result)
        toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.")
      }
    } catch (err: any) {
      console.error("Password reset error:", err)
      
      if (err.errors && err.errors.length > 0) {
        const resetError = err.errors[0]
        
        if (resetError.code === "form_code_incorrect") {
          toast.error("Mã xác nhận không chính xác")
        } else if (resetError.code === "form_password_pwned") {
          toast.error("Mật khẩu này đã bị rò rỉ. Vui lòng chọn mật khẩu khác.")
        } else if (resetError.code === "form_password_validation_failed") {
          toast.error("Mật khẩu không đáp ứng yêu cầu bảo mật")
        } else {
          toast.error(resetError.message || "Đã xảy ra lỗi khi đặt lại mật khẩu")
        }
      } else {
        toast.error("Đã xảy ra lỗi khi đặt lại mật khẩu")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      
      toast.success("Mã xác nhận mới đã được gửi!")
    } catch (err: any) {
      console.error("Resend code error:", err)
      toast.error("Không thể gửi lại mã xác nhận")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Nhập mật khẩu mới</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Chúng tôi đã gửi mã xác nhận đến <strong>{email}</strong>
        </p>
      </div>
      
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="code">Mã xác nhận</Label>
          <Input 
            id="code" 
            type="text" 
            placeholder="Nhập mã 6 chữ số" 
            required 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />
          <div className="text-right">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              {isResending ? "Đang gửi..." : "Gửi lại mã"}
            </button>
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="newPassword">Mật khẩu mới</Label>
          <Input 
            id="newPassword" 
            type="password" 
            required 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
        </Button>
      </div>

      <div className="text-center text-sm">
        <button 
          type="button" 
          onClick={onBackToRequest} 
          className="underline underline-offset-4 hover:text-primary"
        >
          Quay lại nhập email
        </button>
      </div>
    </form>
  )
}