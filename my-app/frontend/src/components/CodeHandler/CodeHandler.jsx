import { useState } from "react";
import axios from "axios";
import styles from "./module.codehandler.css"
import React from 'react';
;

export default function CodeHandler() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const BACKEND_URL = "http://localhost:5000";

  const sendCode = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    try {
      const res = await axios.post(`${BACKEND_URL}/send-code`, { email });
      setMessage(res.data.message || "✅ Code sent to your email.");
      setStep(2);
    } catch (err) {
      setMessage("❌ Failed to send code. Try again.");
    }
  };
  
  const verifyCode = async () => {
    if (!code) {
      setMessage("Please enter the code.");
      return;
    }
    try {
      const res = await axios.post(`${BACKEND_URL}/verify-code`, { email, code });
      setMessage(res.data.success ? "✅ Verification approved!" : "❌ Wrong code, try again.");
    } catch (err) {
      setMessage("❌ Error verifying code.");
    }
  };
  
  const isSuccess = message.startsWith("✅");

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Forgot Password</h2>

      {step === 1 ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <button onClick={sendCode} className={styles.button}>
            Send Code
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter the code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.input}
          />
          <button onClick={verifyCode} className={styles.button}>
            Verify Code
          </button>
        </>
      )}

      <p className={isSuccess ? styles.messageSuccess : styles.messageError}>{message}</p>
    </section>
  );
}
