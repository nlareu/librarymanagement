/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useMemo, useCallback } from "react";
import type { LoanHistoryRecord, ActiveLoan } from "../../../entities/index";
import {
  formatDateForInput,
  stripMarcPrefix,
  parseDateStringAsLocal,
} from "../../../utils";

export function useHistoryFilters(
  completedLoanHistory: LoanHistoryRecord[],
  activeLoans: ActiveLoan[]
) {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [assetFilter, setAssetFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateStartFilter, setDateStartFilter] = useState(
    formatDateForInput(sevenDaysAgo)
  );
  const [dateEndFilter, setDateEndFilter] = useState(formatDateForInput(today));
  const [returnStatusFilter, setReturnStatusFilter] = useState<
    "all" | "returned" | "active"
  >("all");

  const onClearFilters = useCallback(() => {
    setAssetFilter("");
    setUserFilter("");
    setDateStartFilter("");
    setDateEndFilter("");
    setReturnStatusFilter("all");
  }, []);

  const filterLoan = useCallback(
    (loan: ActiveLoan | LoanHistoryRecord) => {
      const assetMatch =
        assetFilter.trim() === "" ||
        stripMarcPrefix(loan.assetTitle, "title")
          ?.toLowerCase()
          .includes(assetFilter.toLowerCase());
      const userMatch =
        userFilter.trim() === "" ||
        loan.userName.toLowerCase().includes(userFilter.toLowerCase());

      const loanBorrowDate = new Date(loan.borrowDate);

      const startDateTime = parseDateStringAsLocal(dateStartFilter);
      const endDateTime = parseDateStringAsLocal(dateEndFilter);
      if (endDateTime) {
        // Set to the end of the day to include all records on that day
        endDateTime.setHours(23, 59, 59, 999);
      }

      const startDateMatch = !startDateTime || loanBorrowDate >= startDateTime;
      const endDateMatch = !endDateTime || loanBorrowDate <= endDateTime;

      return assetMatch && userMatch && startDateMatch && endDateMatch;
    },
    [assetFilter, userFilter, dateStartFilter, dateEndFilter]
  );

  const filteredActiveLoans = useMemo(() => {
    return activeLoans
      .filter(filterLoan)
      .sort(
        (a, b) =>
          new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
      );
  }, [activeLoans, filterLoan]);

  const filteredLoanHistory = useMemo(() => {
    return completedLoanHistory
      .filter(filterLoan)
      .sort(
        (a, b) =>
          new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
      );
  }, [completedLoanHistory, filterLoan]);

  // Combined historical report with both active and completed loans
  const filteredHistoricalReport = useMemo(() => {
    let combinedLoans: (ActiveLoan | LoanHistoryRecord)[] = [];

    // Apply return status filter
    if (returnStatusFilter === "all") {
      combinedLoans = [...activeLoans, ...completedLoanHistory];
    } else if (returnStatusFilter === "active") {
      combinedLoans = [...activeLoans];
    } else if (returnStatusFilter === "returned") {
      combinedLoans = [...completedLoanHistory];
    }

    return combinedLoans
      .filter(filterLoan)
      .sort(
        (a, b) =>
          new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
      );
  }, [activeLoans, completedLoanHistory, returnStatusFilter, filterLoan]);

  return {
    assetFilter,
    onAssetFilterChange: setAssetFilter,
    userFilter,
    onUserFilterChange: setUserFilter,
    dateStartFilter,
    onDateStartFilterChange: setDateStartFilter,
    dateEndFilter,
    onDateEndFilterChange: setDateEndFilter,
    returnStatusFilter,
    onReturnStatusFilterChange: setReturnStatusFilter,
    onClearFilters,
    filteredActiveLoans,
    filteredLoanHistory,
    filteredHistoricalReport,
  };
}
