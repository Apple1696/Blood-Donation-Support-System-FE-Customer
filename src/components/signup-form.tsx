"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SignupFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onSwitchToLogin?: () => void
}

export function SignupForm({ className, onSwitchToLogin, ...props }: SignupFormProps) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
      
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">First Name</Label>
          <Input id="name" type="text" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Last Name</Label>
          <Input id="name" type="text"  required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="abc@gmail.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Create Account
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"></div>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToLogin} className="underline underline-offset-4 hover:text-primary">
          Sign in
        </button>
      </div>
    </form>
  )
}
