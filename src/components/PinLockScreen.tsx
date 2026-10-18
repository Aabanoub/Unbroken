"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, Delete, Eye, EyeOff } from "lucide-react";

interface PinLockScreenProps {
  correctPin: string;
  disguiseTitle: boolean;
  onUnlock: () => void;
  onResetPin?: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  correctPin,
  disguiseTitle,
  onUnlock,
  onResetPin,
}) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);

    if (newPin.length === 4) {
      if (newPin === correctPin) {
        onUnlock();
      } else {
        setError(true);
        setAttempts((prev) => prev + 1);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 700);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090D16] flex flex-col items-center justify-between p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="w-full pt-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4 shadow-xl">
          <Lock className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {disguiseTitle ? "Daily Habits" : "Unbroken"}
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          {disguiseTitle
            ? "Enter 4-digit habit passkey to continue"
            : "Clear Eyes, Clean Mind."}
        </p>

        {/* PIN Dots */}
        <div className={`flex gap-4 mt-8 transition-transform duration-200 ${error ? "animate-bounce" : ""}`}>
          {[0, 1, 2, 3].map((idx) => {
            const filled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? "bg-rose-500 scale-110 shadow-lg shadow-rose-500/50"
                    : filled
                    ? "bg-emerald-400 scale-110 shadow-md shadow-emerald-500/40"
                    : "bg-slate-700/80 border border-slate-600"
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-medium mt-3 animate-fade-in">
            Incorrect PIN. Try again.
          </p>
        )}
      </div>

      {/* Keypad */}
      <div className="w-full max-w-xs pb-10">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="h-16 rounded-2xl bg-slate-800/60 hover:bg-slate-700/70 active:scale-95 border border-slate-700/50 text-2xl font-semibold text-slate-100 transition-all flex items-center justify-center shadow-md"
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center">
            {/* Blank placeholder for alignment */}
          </div>
          <button
            onClick={() => handleDigit("0")}
            className="h-16 rounded-2xl bg-slate-800/60 hover:bg-slate-700/70 active:scale-95 border border-slate-700/50 text-2xl font-semibold text-slate-100 transition-all flex items-center justify-center shadow-md"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 rounded-2xl bg-slate-800/40 hover:bg-slate-700/50 active:scale-95 border border-slate-700/40 text-slate-400 transition-all flex items-center justify-center"
            aria-label="Delete"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {attempts >= 3 && onResetPin && (
          <div className="text-center mt-3">
            <button
              onClick={onResetPin}
              className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2"
            >
              Forgot PIN? Reset Lock
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
