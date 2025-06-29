/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react';
import type { ActiveLoan } from '../../../entities/index';
import { Modal } from '../Modal/Modal';
import { formatDateTimeLocal } from '../../../utils';
import '../Modal/Modal.css';
import { messages } from './messages';

interface ReturnModalProps {
    loan: ActiveLoan;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (returnDate: string) => void;
}

export function ReturnModal({ loan, isOpen, onClose, onConfirm }: ReturnModalProps) {
    const [returnDate, setReturnDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            setReturnDate(formatDateTimeLocal(new Date()));
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!returnDate) return;
        onConfirm(returnDate);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${messages.titlePrefix}${loan.assetTitle}`}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="returnDateTime">{messages.returnDateTimeLabel}</label>
                    <input
                        id="returnDateTime"
                        type="datetime-local"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                        autoFocus
                    />
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>{messages.cancelAction}</button>
                    <button type="submit" className="btn btn-primary">{messages.confirmAction}</button>
                </div>
            </form>
        </Modal>
    );
}