

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { DateRangePicker } from '../DateRangePicker/DateRangePicker';
import '../Filters/Filters.css';
import { messages } from './messages';

interface HistoryFiltersProps {
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

export function HistoryFilters({
    assetFilter, onAssetFilterChange,
    userFilter, onUserFilterChange,
    dateStartFilter, onDateStartFilterChange,
    dateEndFilter, onDateEndFilterChange,
    onClearFilters
}: HistoryFiltersProps) {

    const handleRangeChange = (start: string, end: string) => {
        onDateStartFilterChange(start);
        onDateEndFilterChange(end);
    };

    return (
        <div className="filters-container">
            <div className="filter-group search-filter">
                <label htmlFor="asset-filter">{messages.assetFilterLabel}</label>
                <input
                    type="text"
                    id="asset-filter"
                    placeholder={messages.assetFilterPlaceholder}
                    value={assetFilter}
                    onChange={(e) => onAssetFilterChange(e.target.value)}
                />
            </div>
            <div className="filter-group search-filter">
                <label htmlFor="user-filter">{messages.userFilterLabel}</label>
                <input
                    type="text"
                    id="user-filter"
                    placeholder={messages.userFilterPlaceholder}
                    value={userFilter}
                    onChange={(e) => onUserFilterChange(e.target.value)}
                />
            </div>
            <div className="filter-group">
                <label>{messages.dateRangeLabel}</label>
                <DateRangePicker 
                    startDate={dateStartFilter}
                    endDate={dateEndFilter}
                    onRangeChange={handleRangeChange}
                />
            </div>
            <div className="filter-group clear-filter">
                <button className="btn btn-sm btn-secondary" onClick={onClearFilters}>{messages.clearAction}</button>
            </div>
        </div>
    );
}