/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect } from "react";
import "./Toast.css";

export interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  onClose: (id: string) => void;
  autoClose?: boolean;
  duration?: number;
}

export function Toast({
  id,
  message,
  type,
  onClose,
  autoClose = false,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, onClose, autoClose, duration]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
      </div>
      <button
        className="toast-close"
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
