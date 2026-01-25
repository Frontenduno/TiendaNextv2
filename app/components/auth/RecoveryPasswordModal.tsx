// components/auth/RecoveryPasswordModal.tsx
"use client";

import { useState } from "react";
import RecoveryStep1Email from "./recovery/RecoveryStep1Email";
import RecoveryStep2Code from "./recovery/RecoveryStep2Code";
import RecoveryStep3NewPassword from "./recovery/RecoveryStep3NewPassword";
import RecoveryStep4Success from "./recovery/RecoveryStep4Success";

interface Props {
  onSwitchLogin: () => void;
  onClose: () => void;
}

export default function RecoveryPasswordModal({ onSwitchLogin, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (emailValue: string) => {
    setEmail(emailValue);
    setCurrentStep(2);
  };

  const handleCodeVerified = () => {
    setCurrentStep(3);
  };

  const handlePasswordChanged = () => {
    setCurrentStep(4);
  };

  const handleBackToLogin = () => {
    setCurrentStep(1);
    onSwitchLogin();
  };

  const handleCloseAndReset = () => {
    setCurrentStep(1);
    setEmail("");
    onClose();
  };

  return (
    <>
      {currentStep === 1 && (
        <RecoveryStep1Email
          onSubmit={handleEmailSubmit}
          onSwitchLogin={onSwitchLogin}
        />
      )}

      {currentStep === 2 && (
        <RecoveryStep2Code
          email={email}
          onVerified={handleCodeVerified}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <RecoveryStep3NewPassword
          email={email}
          onSuccess={handlePasswordChanged}
        />
      )}

      {currentStep === 4 && (
        <RecoveryStep4Success
          onSwitchLogin={handleBackToLogin}
          onClose={handleCloseAndReset}
        />
      )}
    </>
  );
}