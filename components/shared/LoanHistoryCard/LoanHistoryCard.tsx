/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { LoanHistoryRecord } from '../../../entities/index';
import { formatDisplayDate } from '../../../utils';
import './LoanHistoryCard.css';
import { messages } from './messages';

interface LoanHistoryCardProps {
  loan: LoanHistoryRecord;
}

export function LoanHistoryCard({ loan }: LoanHistoryCardProps) {
  return (
    <div className="loan-card">
      <div className="loan-info">
        <h4 className="loan-asset-title">{loan.assetTitle}</h4>
        <p className="loan-user-name">{messages.userLabel}{loan.userName}</p>
      </div>
      <div className="loan-dates">
        <p><strong>{messages.borrowedLabel}</strong> {formatDisplayDate(loan.borrowDate)}</p>
        <p><strong>{messages.returnedLabel}</strong> {formatDisplayDate(loan.returnDate)}</p>
      </div>
    </div>
  );
}