import { useState } from "react";
import axios from "axios";
import styles from "./AuthForm.module.css";
import React from "react";
import { useForm } from "react-hook-form";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [forgotStep, setForgotStep] = useState("email");
  const [storedEmail, setStoredEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const BACKEND_URL = "http://localhost:5000";

  const loginForm = useForm({ mode: "onTouched" });
  const signupForm = useForm({ mode: "onTouched" });
  const forgotEmailForm = useForm({ mode: "onTouched" });
  const verifyCodeForm = useForm({ mode: "onTouched" });
  const resetPasswordForm = useForm({ mode: "onTouched" });

  const resetAllForms = () => {
    loginForm.reset();
    signupForm.reset();
    forgotEmailForm.reset();
    verifyCodeForm.reset();
    resetPasswordForm.reset();
    setMessage("");
  };

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      console.log("Login:", data);
      // TODO: Implement login API call
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      console.log("Signup:", data);
      // TODO: Implement signup API call
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Integrated Forgot Password logic from CodeHandler component with minimal changes
  const handleSendCode = async (data) => {
    if (!data.email) {
      setMessage("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/email/send-code`, { email: data.email });
      setMessage(res.data.message || "✅ Code sent to your email.");
      setStoredEmail(data.email);
      setForgotStep("verify");
    } catch (err) {
      setMessage("Failed to send code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (data) => {
    if (!data.code) {
      setMessage("Please enter the code.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/email/verify-code`, { email: storedEmail, code: data.code });
      if (res.data.success) {
        setMessage("Verification approved!");
        setForgotStep("reset");
      } else {
        setMessage("Wrong code, try again.");
      }
    } catch (err) {
      setMessage("Error verifying code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/reset-password`, {
        email: storedEmail,
        newPassword: data.newPassword,
      });
      if (res.status === 200) {
        alert("Password reset successful");
        setMode("login");
        setForgotStep("email");
        resetPasswordForm.reset();
        setMessage("");
      } else {
        alert("Password reset failed");
      }
    } catch (err) {
      console.error(err);
      alert("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", register, placeholder, required = true }) => (
    <div className={styles.inputField}>
      <label className={styles.inputLabel} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name, { required })}
        placeholder={placeholder}
        className={styles.input}
        aria-required={required}
        aria-describedby={`${name}-error`}
        autoComplete={type === "password" ? "new-password" : undefined}
      />
    </div>
  );

  const renderLogin = () => (
    <form onSubmit={loginForm.handleSubmit(handleLogin)} noValidate aria-label="Login form">
      <InputField label="Email" name="email" register={loginForm.register} placeholder="Email" />
      <InputField label="Password" name="password" type="password" register={loginForm.register} placeholder="Password" />
      <button type="submit" disabled={loading} className={`${styles.submitButton} ${styles.loginBtn}`} aria-busy={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );

  const renderSignup = () => (
    <form onSubmit={signupForm.handleSubmit(handleSignup)} noValidate aria-label="Signup form">
      <InputField label="Email" name="email" register={signupForm.register} placeholder="Email" />
      <InputField label="Password" name="password" type="password" register={signupForm.register} placeholder="Password" />
      <InputField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        register={signupForm.register}
        placeholder="Confirm Password"
      />
      <button type="submit" disabled={loading} className={`${styles.submitButton} ${styles.signupBtn}`} aria-busy={loading}>
        {loading ? "Signing up..." : "Signup"}
      </button>
    </form>
  );

  const renderForgotEmail = () => (
    <form onSubmit={forgotEmailForm.handleSubmit(handleSendCode)} noValidate aria-label="Forgot password email form">
      <InputField label="Enter your email" name="email" register={forgotEmailForm.register} placeholder="Email" />
      <button type="submit" disabled={loading} className={`${styles.submitButton} ${styles.forgotBtn}`} aria-busy={loading}>
        {loading ? "Sending code..." : "Send Verification Code"}
      </button>
      {message && <p className={message.startsWith("Verification approved!") ? styles.messageSuccess : styles.messageError}>{message}</p>}
    </form>
  );

  const renderForgotVerify = () => (
    <form onSubmit={verifyCodeForm.handleSubmit(handleVerifyCode)} noValidate aria-label="Verify code form">
      <InputField label="Verification Code" name="code" register={verifyCodeForm.register} placeholder="Enter code" />
      <button type="submit" disabled={loading} className={`${styles.submitButton} ${styles.forgotBtn}`} aria-busy={loading}>
        {loading ? "Verifying..." : "Verify Code"}
      </button>
      {message && <p className={message.startsWith("Verification approved!") ? styles.messageSuccess : styles.messageError}>{message}</p>}
    </form>
  );

  const renderForgotReset = () => (
    <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} noValidate aria-label="Reset password form">
      <InputField label="New Password" name="newPassword" type="password" register={resetPasswordForm.register} placeholder="New Password" />
      <InputField label="Confirm Password" name="confirmPassword" type="password" register={resetPasswordForm.register} placeholder="Confirm Password" />
      <button type="submit" disabled={loading} className={`${styles.submitButton} ${styles.forgotBtn}`} aria-busy={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </button>
      {message && <p className={message.startsWith("Verification approved!") ? styles.messageSuccess : styles.messageError}>{message}</p>}
    </form>
  );

  const renderForgot = () => {
    switch (forgotStep) {
      case "email":
        return renderForgotEmail();
      case "verify":
        return renderForgotVerify();
      case "reset":
        return renderForgotReset();
      default:
        return null;
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.modeTabs}>
          {["login", "signup", "forgot"].map((m) => {
            let activeClass = "";
            if (mode === m) {
              if (m === "login") activeClass = styles.loginMode;
              else if (m === "signup") activeClass = styles.signupMode;
              else if (m === "forgot") activeClass = styles.forgotMode;
            }
            return (
              <button
                key={m}
                type="button"
                className={`${styles.modeButton} ${mode === m ? activeClass : ""}`}
                onClick={() => {
                  setMode(m);
                  resetAllForms();
                  if (m !== "forgot") setForgotStep("email");
                }}
                aria-pressed={mode === m}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            );
          })}
        </div>

        <div className={styles.formContent}>
          {mode === "login" && renderLogin()}
          {mode === "signup" && renderSignup()}
          {mode === "forgot" && renderForgot()}
        </div>
      </div>
    </div>
  );
}
