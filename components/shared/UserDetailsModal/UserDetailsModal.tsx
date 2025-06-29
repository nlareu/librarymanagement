/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ActiveLoan, LoanHistoryRecord, User } from '../../../entities/index';
import { Modal } from '../Modal/Modal';
import { formatDisplayDate } from '../../../utils';
import './UserDetailsModal.css';
import { messages } from './messages';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    activeLoans: ActiveLoan[];
    completedLoanHistory: LoanHistoryRecord[];
}

export function UserDetailsModal({ isOpen, onClose, user, activeLoans, completedLoanHistory }: UserDetailsModalProps) {

    const currentlyBorrowed = activeLoans.filter(loan => loan.userId === user.id);

    const recentHistory = completedLoanHistory
        .filter(loan => loan.userId === user.id)
        .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime())
        .slice(0, 10);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${messages.titlePrefix}${user.lastName}, ${user.name}`}>
            <div className="user-details-modal-content">
                <div className="user-details-section">
                    <h4>{messages.infoSectionTitle}</h4>
                    <p><strong>{messages.codeLabel}</strong> {user.userCode}</p>
                    <p><strong>{messages.typeLabel}</strong> {user.type}</p>
                    {user.grade && <p><strong>{messages.gradeLabel}</strong> {user.grade}</p>}
                </div>

                <div className="user-details-section">
                    <h4>{messages.borrowedSectionTitle.replace('{count}', String(currentlyBorrowed.length))}</h4>
                    {currentlyBorrowed.length > 0 ? (
                        <ul className="details-list">
                            {currentlyBorrowed.map(loan => (
                                <li key={loan.id} className="details-list-item">
                                    <span>{loan.assetTitle}</span>
                                    <span className="details-list-date">
                                        {messages.borrowedOnLabel}{formatDisplayDate(loan.borrowDate)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty-details-message">{messages.emptyBorrowed}</p>
                    )}
                </div>

                <div className="user-details-section">
                    <h4>{messages.historySectionTitle.replace('{count}', String(recentHistory.length))}</h4>
                     {recentHistory.length > 0 ? (
                        <ul className="details-list">
                            {recentHistory.map(loan => (
                                <li key={loan.id} className="details-list-item">
                                    <span>{loan.assetTitle}</span>
                                    <span className="details-list-date">
                                        {`${messages.returnedOnLabel}${formatDisplayDate(loan.returnDate)}`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty-details-message">{messages.emptyHistory}</p>
                    )}
                </div>
            </div>
            <div className="modal-actions">
                <button type="button" className="btn btn-primary" onClick={onClose}>{messages.closeAction}</button>
            </div>
        </Modal>
    );
}