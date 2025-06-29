/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ActiveLoan } from '../../../entities/index';
import { formatDisplayDate } from '../../../utils';
import './ActiveLoanCard.css';
import { messages } from './messages';

interface ActiveLoanCardProps {
  loan: ActiveLoan;
  onReturn: (loan: ActiveLoan) => void;
}

export function ActiveLoanCard({ loan, onReturn }: ActiveLoanCardProps) {
  return (
    <div className="loan-card">
      <div className="loan-info">
        <h4 className="loan-asset-title">{loan.assetTitle}</h4>
        <p className="loan-user-name">{messages.userLabel}{loan.userName}</p>
      </div>
      <div className="loan-dates">
        <p><strong>{messages.borrowedLabel}</strong> {formatDisplayDate(loan.borrowDate)}</p>
      </div>
      <div className="loan-actions">
        <button className="btn btn-sm btn-primary" onClick={() => onReturn(loan)}>
            {messages.returnAction}
        </button>
      </div>
    </div>
  );
}