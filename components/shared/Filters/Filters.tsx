/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import './Filters.css';
import { messages } from './messages';

interface FiltersProps {
    searchText: string;
    onSearchChange: (text: string) => void;
    typeFilters: string[];
    onTypeChange: (types: string[]) => void;
    availableAssetTypes: string[];
    onClearFilters: () => void;
}

export function Filters({ searchText, onSearchChange, typeFilters, onTypeChange, availableAssetTypes, onClearFilters }: FiltersProps) {
    const handleTypeToggle = (type: string) => {
        const newTypes = typeFilters.includes(type)
            ? typeFilters.filter(t => t !== type)
            : [...typeFilters, type];
        onTypeChange(newTypes);
    };

    return (
        <div className="filters-container">
            <div className="filter-group search-filter">
                <label htmlFor="search">{messages.searchLabel}</label>
                <input
                    type="text"
                    id="search"
                    placeholder={messages.searchPlaceholder}
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            {availableAssetTypes.length > 0 && (
                <div className="filter-group type-filter">
                    <label>{messages.typeLabel}</label>
                    <div className="type-filter-tags">
                        {availableAssetTypes.map(type => (
                            <div key={type}>
                                <input
                                    type="checkbox"
                                    id={`type-${type}`}
                                    checked={typeFilters.includes(type)}
                                    onChange={() => handleTypeToggle(type)}
                                />
                                <label htmlFor={`type-${type}`}>{type}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="filter-group clear-filter">
                <button className="btn btn-sm btn-secondary" onClick={onClearFilters}>{messages.clearAction}</button>
            </div>
        </div>
    );
}