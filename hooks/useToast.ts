/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useCallback } from "react";
import { ToastData } from "../components/shared/Toast/ToastContainer";

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" = "info",
      autoClose: boolean = false,
      duration: number = 5000
    ) => {
      const id = crypto.randomUUID();
      const newToast: ToastData = {
        id,
        message,
        type,
        autoClose,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showSuccess = useCallback(
    (message: string, autoClose = false) => {
      return addToast(message, "success", autoClose);
    },
    [addToast]
  );

  const showError = useCallback(
    (message: string, autoClose = false) => {
      return addToast(message, "error", autoClose);
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, autoClose = false) => {
      return addToast(message, "info", autoClose);
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showInfo,
  };
}
