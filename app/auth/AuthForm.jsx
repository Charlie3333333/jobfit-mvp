"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Layers, LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { browserAuth } from "../../lib/auth/browser";
import { authConfigured, safeNextPath } from "../../lib/auth/config";

const copy = {
  login: ["Welcome back.", "Your next chapter starts here.", "Sign in"],
  signup: ["Make room for what's next.", "Create your BestFit account.", "Create account"],
  verify: ["Check your inbox.", "Enter your email code, or sign in if you already verified your account.", "Verify email"],
  forgot: ["A fresh start.", "Enter your email to receive a password reset code.", "Send reset code"],
  recovery: ["Check your inbox.", "Enter your password reset code.", "Verify code"],
  reset: ["Choose a new password.", "Set a new password for your account.", "Update password"],
};

function errorMessage(error) {
  const code = error?.code;
  if (code === "invalid_credentials") return "The email or password is incorrect. Please try again.";
  if (code === "otp_expired") return "That code is invalid or has expired. Request a new code and try again.";
  if (code?.includes("rate_limit") || error?.status === 429) return "Too many attempts. Please wait a moment before trying again.";
  if (code === "weak_password") return "Choose a stronger password with at least 8 characters.";
  return error?.message || "Unable to connect. Please try again.";
}

export default function AuthForm({ initialMode = "login", nextPath, linkExpired = false }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(linkExpired ? "That link has expired. Sign in or request a new code." : "");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const next = safeNextPath(nextPath);
  const verifying = mode === "verify" || mode === "recovery";
  const passwordMode = ["login", "signup", "reset"].includes(mode);
  const [title, subtitle, action] = copy[mode];

  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function changeMode(value) {
    setMode(value);
    setPassword("");
    setConfirmPassword("");
    setToken("");
    setError("");
    setMessage("");
  }

  async function submit(event) {
    event.preventDefault();
    if (!authConfigured || busy) return;
    if ((mode === "signup" || mode === "reset") && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    const client = browserAuth();
    const address = email.trim();
    try {
      if (mode === "login") {
        const result = await client.auth.signInWithPassword({ email: address, password });
        if (result.error?.code === "email_not_confirmed") {
          changeMode("verify");
          setMessage("Your email is not confirmed yet. Request a new code below.");
          return;
        }
        if (result.error) throw result.error;
        window.location.assign(next);
      } else if (mode === "signup") {
        const result = await client.auth.signUp({ email: address, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` } });
        if (result.error) throw result.error;
        setPassword("");
        setConfirmPassword("");
        if (result.data.session) {
          window.location.assign(next);
          return;
        }
        setMode("verify");
        setCooldown(60);
        setMessage("If this address needs verification, an email will be sent. Check your spam folder. Already verified? Sign in below; registering again may not send another code.");
      } else if (verifying) {
        const result = await client.auth.verifyOtp({ email: address, token: token.trim(), type: mode === "recovery" ? "recovery" : "email" });
        if (result.error) throw result.error;
        if (mode === "recovery") {
          changeMode("reset");
        } else {
          window.location.assign(next);
        }
      } else if (mode === "forgot") {
        const result = await client.auth.resetPasswordForEmail(address, { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` });
        if (result.error) throw result.error;
        setMode("recovery");
        setCooldown(60);
        setMessage("If an account exists for this address, a reset email is on its way.");
      } else if (mode === "reset") {
        const result = await client.auth.updateUser({ password });
        if (result.error) throw result.error;
        setPassword("");
        setConfirmPassword("");
        window.location.assign(next);
      }
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (!authConfigured || busy || cooldown) return;
    setBusy(true);
    setError("");
    try {
      const client = browserAuth();
      const result = mode === "recovery"
        ? await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` })
        : await client.auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` } });
      if (result.error) throw result.error;
      setCooldown(60);
      setMessage("If this address is eligible, a new code will be sent. Already verified accounts should sign in instead.");
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <nav className="auth-nav" aria-label="Account navigation"><Link href="/" className="welcome-logo"><Layers size={20} />BestFit</Link><Link href="/"><ArrowLeft size={14} />Back home</Link></nav>
      <section className="auth-surface" aria-labelledby="auth-heading">
        <div className="auth-emblem">{verifying ? <Mail size={26} /> : <ShieldCheck size={26} />}</div>
        <p className="welcome-eyebrow">YOUR BESTFIT ACCOUNT</p>
        <h1 id="auth-heading">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {!authConfigured && <p className="auth-notice" role="status">Email sign-in is being set up. Registration and verification emails are not available yet.</p>}
        <form onSubmit={submit} className="auth-form">
          {mode !== "reset" && <label><span>Email address</span><input type="email" autoComplete="email" name="email" required value={email} readOnly={verifying} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></label>}
          {passwordMode && <label><span>{mode === "reset" ? "New password" : "Password"}</span><div className="auth-password"><input type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? 1 : 8} value={password} onChange={event => setPassword(event.target.value)} placeholder={mode === "login" ? "Enter your password" : "At least 8 characters"} /><button type="button" title={showPassword ? "Hide password" : "Show password"} aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>}
          {(mode === "signup" || mode === "reset") && <label><span>Confirm password</span><input type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Re-enter your password" /></label>}
          {verifying && <label><span>Verification code</span><input className="auth-otp" name="code" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6,8}" maxLength={8} required value={token} onChange={event => setToken(event.target.value.replace(/\D/g, ""))} placeholder="Enter your code" /></label>}
          {mode === "login" && <Link href="/forgot-password" className="auth-forgot">Forgot password?</Link>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-message" role="status">{message}</p>}
          <button className="auth-submit" type="submit" disabled={!authConfigured || busy}>{busy ? <LoaderCircle size={17} className="auth-spinner" /> : null}{busy ? "Please wait..." : action}{!busy && <ArrowRight size={16} />}</button>
          {verifying && <><button type="button" className="auth-text-button" disabled={busy || cooldown > 0 || !authConfigured} onClick={resend}>{cooldown ? `Resend code in ${cooldown}s` : "Resend code"}</button><button type="button" className="auth-text-button" disabled={busy} onClick={() => changeMode(mode === "recovery" ? "forgot" : "signup")}>Use a different email</button></>}
        </form>
        <div className="auth-switch">{mode === "login" ? <>New to BestFit? <Link href="/signup">Create an account</Link></> : <>Already have an account? <Link href="/login">Sign in</Link></>}</div>
      </section>
      <p className="auth-footer">Your next chapter, thoughtfully presented.</p>
    </main>
  );
}
