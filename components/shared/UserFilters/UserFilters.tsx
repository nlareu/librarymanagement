

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { UserType } from '../../../entities/index';
import '../Filters/Filters.css';
import { messages } from './messages';

interface UserFiltersProps {
    searchText: string;
    onSearchChange: (text: string) => void;
    typeFilters: UserType[];
    onTypeChange: (types: UserType[]) => void;
    onClearFilters: () => void;
}

const availableUserTypes: UserType[] = ['Estudiante', 'Profesor', 'Personal'];

export function UserFilters({ searchText, onSearchChange, typeFilters, onTypeChange, onClearFilters }: UserFiltersProps) {
    const handleTypeToggle = (type: UserType) => {
        const newTypes = typeFilters.includes(type)
            ? typeFilters.filter(t => t !== type)
            : [...typeFilters, type];
        onTypeChange(newTypes);
    };

    return (
        <div className="filters-container">
            <div className="filter-group search-filter">
                <label htmlFor="user-search">{messages.searchLabel}</label>
                <input
                    type="text"
                    id="user-search"
                    placeholder={messages.searchPlaceholder}
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="filter-group type-filter">
                <label>{messages.typeLabel}</label>
                <div className="type-filter-tags">
                    {availableUserTypes.map(type => (
                        <div key={type}>
                            <input
                                type="checkbox"
                                id={`user-type-${type}`}
                                checked={typeFilters.includes(type)}
                                onChange={() => handleTypeToggle(type)}
                            />
                            <label htmlFor={`user-type-${type}`}>{type}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="filter-group clear-filter">
                <button className="btn btn-sm btn-secondary" onClick={onClearFilters}>{messages.clearAction}</button>
            </div>
        </div>
    );
}