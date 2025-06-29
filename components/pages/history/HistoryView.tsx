/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import type { ActiveLoan, LoanHistoryRecord } from "../../../entities/index";
import { HistoryFilters } from "../../shared/HistoryFilters/HistoryFilters";
import { LoanHistoryCard } from "../../shared/LoanHistoryCard/LoanHistoryCard";
import { ActiveLoanCard } from "../../shared/ActiveLoanCard/ActiveLoanCard";
import "./HistoryView.css";
import { messages } from "./messages";

interface HistoryViewProps {
  activeLoans: ActiveLoan[];
  completedLoans: LoanHistoryRecord[];
  onReturn: (loan: ActiveLoan) => void;
  assetFilter: string;
  onAssetFilterChange: (value: string) => void;
  userFilter: string;
  onUserFilterChange: (value: string) => void;
  dateStartFilter: string;
  onDateStartFilterChange: (value: string) => void;
  dateEndFilter: string;
  onDateEndFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

type HistoryTab = "active" | "completed";

export function HistoryView(props: HistoryViewProps) {
  const { activeLoans, completedLoans, onReturn, ...filterProps } = props;
  const [activeTab, setActiveTab] = useState<HistoryTab>("active");

  return (
    <div className="history-container view-container">
      <h2>{messages.title}</h2>
      <div className="history-tabs">
        <button
          className={`history-tab-btn ${
            activeTab === "active" ? "active" : ""
          }`}
          onClick={() => setActiveTab("active")}
        >
          {messages.activeLoansTab} ({activeLoans.length})
        </button>
        <button
          className={`history-tab-btn ${
            activeTab === "completed" ? "active" : ""
          }`}
          onClick={() => setActiveTab("completed")}
        >
          {messages.completedLoansTab}
        </button>
      </div>

      {activeTab === "active" && (
        <div className="loan-list-container">
          {activeLoans.length === 0 ? (
            <div className="empty-state">
              <p>{messages.noActiveLoans}</p>
            </div>
          ) : (
            <div className="loan-history-list">
              {activeLoans.map((loan) => (
                <ActiveLoanCard key={loan.id} loan={loan} onReturn={onReturn} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "completed" && (
        <div className="loan-list-container">
          <HistoryFilters {...filterProps} />
          {completedLoans.length === 0 ? (
            <div className="empty-state">
              <p>{messages.emptyState}</p>
            </div>
          ) : (
            <div className="loan-history-list">
              {completedLoans.map((loan) => (
                <LoanHistoryCard key={loan.id} loan={loan} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
