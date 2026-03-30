"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 4000,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3.5 shadow-lg transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${isSuccess ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
    >
      {isSuccess ? (
        <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600 shrink-0" />
      )}
      <p className={`text-sm font-medium ${isSuccess ? "text-green-800" : "text-red-800"}`}>
        {message}
      </p>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className={`ml-1 rounded p-0.5 transition-colors ${
          isSuccess ? "hover:bg-green-100 text-green-600" : "hover:bg-red-100 text-red-600"
        }`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
