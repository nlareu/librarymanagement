

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Asset } from '../../../entities/index';
import { Modal } from '../Modal/Modal';
import '../Modal/Modal.css';
import { messages } from './messages';

interface DeleteConfirmationModalProps {
    asset: Asset;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmationModal({ asset, isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={messages.title}>
            <p>{messages.confirmationText}<strong>{asset.title}</strong>?</p>
            <p>{messages.warningText}</p>
            <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>{messages.cancelAction}</button>
                <button type="button" className="btn btn-danger" onClick={onConfirm}>{messages.confirmAction}</button>
            </div>
        </Modal>
    );
}