/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useMemo, useCallback } from "react";
import type { LoanHistoryRecord } from "../../../entities/index";
import {
  formatDateForInput,
  stripMarcPrefix,
  parseDateStringAsLocal,
} from "../../../utils";

export function useHistoryFilters(completedLoanHistory: LoanHistoryRecord[]) {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [assetFilter, setAssetFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateStartFilter, setDateStartFilter] = useState(
    formatDateForInput(sevenDaysAgo)
  );
  const [dateEndFilter, setDateEndFilter] = useState(formatDateForInput(today));

  const onClearFilters = useCallback(() => {
    setAssetFilter("");
    setUserFilter("");
    setDateStartFilter("");
    setDateEndFilter("");
  }, []);

  const filteredLoanHistory = useMemo(() => {
    return completedLoanHistory
      .filter((loan) => {
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

        const startDateMatch =
          !startDateTime || loanBorrowDate >= startDateTime;
        const endDateMatch = !endDateTime || loanBorrowDate <= endDateTime;

        return assetMatch && userMatch && startDateMatch && endDateMatch;
      })
      .sort(
        (a, b) =>
          new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
      );
  }, [
    completedLoanHistory,
    assetFilter,
    userFilter,
    dateStartFilter,
    dateEndFilter,
  ]);

  return {
    assetFilter,
    onAssetFilterChange: setAssetFilter,
    userFilter,
    onUserFilterChange: setUserFilter,
    dateStartFilter,
    onDateStartFilterChange: setDateStartFilter,
    dateEndFilter,
    onDateEndFilterChange: setDateEndFilter,
    onClearFilters,
    filteredLoanHistory,
  };
}
