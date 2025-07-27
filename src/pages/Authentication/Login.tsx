"use client"
import { HeartPlus } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { PasswordResetRequest } from "@/pages/Authentication/PasswordResetRequest"
import { PasswordResetForm } from "@/pages/Authentication/PasswordResetForm"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

type AuthMode = "login" | "signup" | "reset-request" | "reset-form"

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [resetEmail, setResetEmail] = useState("")
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Check URL parameters to set initial mode
    if (searchParams.get("signup") === "true") {
      setAuthMode("signup")
    } else if (searchParams.get("reset") === "true") {
      setAuthMode("reset-request")
    } else {
      setAuthMode("login")
    }
  }, [searchParams])

  const handleSwitchToLogin = () => {
    setAuthMode("login")
  }

  const handleSwitchToSignup = () => {
    setAuthMode("signup")
  }

  const handleSwitchToResetRequest = () => {
    setAuthMode("reset-request")
  }

  const handleResetRequested = (email: string) => {
    setResetEmail(email)
    setAuthMode("reset-form")
  }

  const handleBackToResetRequest = () => {
    setAuthMode("reset-request")
  }

  const renderAuthForm = () => {
    switch (authMode) {
      case "signup":
        return (
          <SignupForm onSwitchToLogin={handleSwitchToLogin} />
        )
      case "reset-request":
        return (
          <PasswordResetRequest 
            onBackToLogin={handleSwitchToLogin}
            onResetRequested={handleResetRequested}
          />
        )
      case "reset-form":
        return (
          <PasswordResetForm 
            email={resetEmail}
            onBackToRequest={handleBackToResetRequest}
          />
        )
      default:
        return (
          <LoginForm 
            onSwitchToSignup={handleSwitchToSignup}
            onSwitchToResetRequest={handleSwitchToResetRequest}
          />
        )
    }
  }

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
          <div className="w-full max-w-lg">
            {renderAuthForm()}
          </div>
        </div>
      </div>
      <div className="col-span-2 relative bg-muted">
        <img
          src="/images/LoginPage/BloodEquipment.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}