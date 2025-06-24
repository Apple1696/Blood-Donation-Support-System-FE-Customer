"use client"
import { HeartPlus } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Check if signup parameter is present in URL
    setIsSignup(searchParams.get("signup") === "true")
  }, [searchParams])

  return (
    <div className="grid min-h-svh grid-cols-5">
      <div className="col-span-3 flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <HeartPlus className="size-4" />
            </div>
            BloodLink
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
          {isSignup ? (
            <SignupForm onSwitchToLogin={() => setIsSignup(false)} />
          ) : (
            <LoginForm onSwitchToSignup={() => setIsSignup(true)} />
          )}
          </div>
        </div>
      </div>
      <div className="col-span-2 relative bg-muted">
        <img
          src="public\images\LoginPage\BloodEquipment.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}