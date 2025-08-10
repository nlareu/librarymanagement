/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from "react";
import type { Asset, User } from "../../../entities/index";
import { Modal } from "../Modal/Modal";
import "../Modal/Modal.css";
import { messages } from "./messages";

interface BorrowModalProps {
  asset: Asset;
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (borrowerId: string) => void;
}

export function BorrowModal({
  asset,
  users,
  isOpen,
  onClose,
  onConfirm,
}: BorrowModalProps) {
  const [borrowerId, setBorrowerId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerId.trim()) {
      setError(messages.userRequiredError);
      return;
    }
    onConfirm(borrowerId);
    setBorrowerId("");
    setError("");
  };

  useEffect(() => {
    if (isOpen) {
      setBorrowerId("");
      setError("");
    }
  }, [isOpen]);

  const sortedUsers = users.slice().sort((a, b) => {
    const lastNameComparison = a.lastName.localeCompare(b.lastName);
    if (lastNameComparison !== 0) return lastNameComparison;
    return a.name.localeCompare(b.name);
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${messages.titlePrefix}${asset.title || "Untitled"}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="borrowerId">{messages.userNameLabel}</label>
          {users.length > 0 ? (
            <select
              id="borrowerId"
              value={borrowerId}
              onChange={(e) => setBorrowerId(e.target.value)}
              required
              autoFocus
            >
              <option value="" disabled>
                {messages.selectUserPlaceholder}
              </option>
              {sortedUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.lastName}, {user.name} ({user.userCode})
                </option>
              ))}
            </select>
          ) : (
            <p>{messages.noUsersAvailable}</p>
          )}
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {messages.cancelAction}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={users.length === 0 || !borrowerId}
          >
            {messages.confirmAction}
          </button>
        </div>
      </form>
    </Modal>
  );
}
