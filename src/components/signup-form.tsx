"use client"

import { useState } from "react"
import type React from "react"
import { useSignUp } from "@clerk/clerk-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"

interface SignupFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onSwitchToLogin?: () => void
}

export function SignupForm({ className, onSwitchToLogin, ...props }: SignupFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  if (!isLoaded) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err: any) {
      console.error("Error:", err);
      setError("An error occurred during sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        navigate("/");
      } else {
        console.error("Verification failed", completeSignUp);
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  if (verifying) {
    return (
      <form onSubmit={handleVerify} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-balance text-sm text-muted-foreground">
            We've sent a verification code to your email
          </p>
        </div>
        {error && (
          <div className="text-sm text-red-500 text-center">
            {error}
          </div>
        )}
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter the code from your email"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
      </div>
      {error && (
        <div className="text-sm text-red-500 text-center">
          {error}
        </div>
      )}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            type="text" 
            required 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            type="text" 
            required 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
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
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Clerk CAPTCHA Widget */}
        <div id="clerk-captcha" className="my-4"></div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
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
