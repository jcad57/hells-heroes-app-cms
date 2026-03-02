"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/lib/auth";

const MIN_LENGTH = 8;

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= MIN_LENGTH) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-blue-400" };
  return { score, label: "Strong", color: "bg-green-500" };
}

export function SetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const strength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword;
  const isValid =
    newPassword.length >= MIN_LENGTH && confirmPassword.length > 0 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < MIN_LENGTH) {
      setError(`Password must be at least ${MIN_LENGTH} characters.`);
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(newPassword);
      setSuccess(true);
      // Brief pause so the user sees the success state before redirect
      setTimeout(() => {
        window.location.href = "/dashboard/overview";
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update password. Please try again.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Set Your Password</CardTitle>
          <CardDescription>
            Welcome to HH Fest Admin. Please create a secure password to
            continue. You will only need to do this once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="text-4xl">✓</div>
              <p className="font-medium text-green-500">Password updated!</p>
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4">
              <FieldGroup>
                {error && (
                  <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  {/* Password strength indicator */}
                  {newPassword.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1">
                      <div className="flex h-1.5 w-full gap-1 rounded-full overflow-hidden bg-muted">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex-1 rounded-full transition-colors duration-200",
                              i <= strength.score
                                ? strength.color
                                : "bg-muted"
                            )}
                          />
                        ))}
                      </div>
                      <p
                        className={cn(
                          "text-xs",
                          strength.score <= 1 && "text-red-500",
                          strength.score === 2 && "text-yellow-500",
                          strength.score === 3 && "text-blue-400",
                          strength.score >= 4 && "text-green-500"
                        )}
                      >
                        {strength.label}
                      </p>
                    </div>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="mt-1 text-xs text-destructive">
                      Passwords do not match.
                    </p>
                  )}
                  {confirmPassword.length > 0 && passwordsMatch && (
                    <p className="mt-1 text-xs text-green-500">
                      Passwords match.
                    </p>
                  )}
                </Field>

                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li
                    className={cn(
                      newPassword.length >= MIN_LENGTH && "text-green-500"
                    )}
                  >
                    At least {MIN_LENGTH} characters
                  </li>
                  <li className={cn(/[A-Z]/.test(newPassword) && "text-green-500")}>
                    One uppercase letter
                  </li>
                  <li className={cn(/[0-9]/.test(newPassword) && "text-green-500")}>
                    One number
                  </li>
                  <li
                    className={cn(
                      /[^A-Za-z0-9]/.test(newPassword) && "text-green-500"
                    )}
                  >
                    One special character (optional but recommended)
                  </li>
                </ul>

                <Field>
                  <Button type="submit" disabled={isLoading || !isValid}>
                    {isLoading ? "Saving..." : "Save Password"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
