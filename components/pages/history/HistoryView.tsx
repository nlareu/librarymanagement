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
  historicalReport: (ActiveLoan | LoanHistoryRecord)[];
  onReturn: (loan: ActiveLoan) => void;
  assetFilter: string;
  onAssetFilterChange: (value: string) => void;
  userFilter: string;
  onUserFilterChange: (value: string) => void;
  dateStartFilter: string;
  onDateStartFilterChange: (value: string) => void;
  dateEndFilter: string;
  onDateEndFilterChange: (value: string) => void;
  returnStatusFilter: "all" | "returned" | "active";
  onReturnStatusFilterChange: (value: "all" | "returned" | "active") => void;
  onClearFilters: () => void;
}

type HistoryTab = "active" | "historical";

export function HistoryView(props: HistoryViewProps) {
  const { activeLoans, historicalReport, onReturn, ...filterProps } = props;
  const [activeTab, setActiveTab] = useState<HistoryTab>("active");

  return (
    <div className="history-container view-container">
      <h2>{messages.title}</h2>
      <HistoryFilters {...filterProps} />
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
            activeTab === "historical" ? "active" : ""
          }`}
          onClick={() => setActiveTab("historical")}
        >
          {messages.historicalReportTab} ({historicalReport.length})
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

      {activeTab === "historical" && (
        <div className="loan-list-container">
          {historicalReport.length === 0 ? (
            <div className="empty-state">
              <p>{messages.emptyHistoricalReport}</p>
            </div>
          ) : (
            <div className="loan-history-list">
              {historicalReport.map((loan) => {
                // Check if it's an active loan (no returnDate) or completed loan
                if ("returnDate" in loan) {
                  // It's a completed loan
                  return <LoanHistoryCard key={loan.id} loan={loan} />;
                } else {
                  // It's an active loan
                  return (
                    <ActiveLoanCard
                      key={loan.id}
                      loan={loan}
                      onReturn={onReturn}
                    />
                  );
                }
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
