/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Toast } from "./Toast";
import "./ToastContainer.css";

export interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  autoClose?: boolean;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={onRemoveToast}
          autoClose={toast.autoClose}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}
