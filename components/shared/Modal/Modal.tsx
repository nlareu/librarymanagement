/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useRef } from "react";
import "./Modal.css";
import { messages } from "./messages";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Effect to declaratively control the dialog's open/closed state and add listeners
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Sync dialog's open state with React's isOpen state
    if (isOpen) {
      dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }

    // The 'close' event fires for both Esc key and dialog.close() calls.
    // We use it to sync the state back to the parent component.
    const handleClose = () => onClose();

    // Handle clicks on the backdrop, which are registered on the dialog itself.
    const handleClick = (event: MouseEvent) => {
      if (event.target === dialog) {
        dialog.close(); // This triggers the 'close' event
      }
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleClick);

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleClick);
    };
  }, [isOpen, onClose]);

  // We render the dialog itself. Its visibility is controlled by the effect above.
  return (
    <dialog ref={dialogRef} className="modal-content">
      <header className="modal-header">
        <h2>{title}</h2>
        <button
          onClick={onClose}
          className="btn-close"
          aria-label={messages.closeLabel}
        >
          &times;
        </button>
      </header>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
