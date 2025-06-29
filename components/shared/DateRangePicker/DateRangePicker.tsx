/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, useRef } from 'react';
import { formatDateForInput, parseDateStringAsLocal } from '../../../utils';
import './DateRangePicker.css';
import { messages } from './messages';

interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onRangeChange: (start: string, end: string) => void;
}

const quickRanges = [
    { label: messages.quickRanges.days7, days: 7 },
    { label: messages.quickRanges.days15, days: 15 },
    { label: messages.quickRanges.days30, days: 30 },
    { label: messages.quickRanges.days90, days: 90 },
];

export function DateRangePicker({ startDate, endDate, onRangeChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempStartDate, setTempStartDate] = useState(startDate);
    const [tempEndDate, setTempEndDate] = useState(endDate);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close popover on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Sync temp dates when props change
    useEffect(() => {
        setTempStartDate(startDate);
        setTempEndDate(endDate);
    }, [startDate, endDate]);

    const handleQuickRangeClick = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        onRangeChange(formatDateForInput(start), formatDateForInput(end));
        setIsOpen(false);
    };

    const handleApplyAbsolute = () => {
        onRangeChange(tempStartDate, tempEndDate);
        setIsOpen(false);
    };

    const formatDisplayDate = (dateString: string) => {
        const date = parseDateStringAsLocal(dateString);
        if (!date) return messages.notAvailable;
        
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    const generateDisplayString = () => {
        if (!startDate || !endDate) return messages.selectRange;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = parseDateStringAsLocal(startDate);
        const end = parseDateStringAsLocal(endDate);
        
        if (!start || !end) return messages.selectRange;

        // We can only match a quick range if the end date is today.
        if (end.getTime() === today.getTime()) {
            for (const range of quickRanges) {
                const expectedStartDate = new Date();
                expectedStartDate.setHours(0, 0, 0, 0);
                // A range of N days means today and N-1 previous days.
                expectedStartDate.setDate(today.getDate() - (range.days - 1));
                
                if (start.getTime() === expectedStartDate.getTime()) {
                    return range.label;
                }
            }
        }
        
        return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
    };

    return (
        <div className="date-range-picker-wrapper" ref={wrapperRef}>
            <button className="date-range-trigger" onClick={() => setIsOpen(!isOpen)}>
                {generateDisplayString()}
            </button>
            {isOpen && (
                <div className="date-range-popover">
                    <div className="popover-sidebar">
                        <ul className="quick-ranges-list">
                            {quickRanges.map(({ label, days }) => (
                                <li key={label}>
                                    <button
                                        className="quick-range-item"
                                        onClick={() => handleQuickRangeClick(days - 1)}
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="popover-main">
                        <h4 className="popover-section-title">{messages.absoluteRange}</h4>
                        <form className="absolute-range-form" onSubmit={(e) => { e.preventDefault(); handleApplyAbsolute(); }}>
                            <div className="form-group">
                                <label htmlFor="start-date">{messages.fromLabel}</label>
                                <input
                                    id="start-date"
                                    type="date"
                                    value={tempStartDate}
                                    onChange={(e) => setTempStartDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="end-date">{messages.toLabel}</label>
                                <input
                                    id="end-date"
                                    type="date"
                                    value={tempEndDate}
                                    onChange={(e) => setTempEndDate(e.target.value)}
                                />
                            </div>
                            <div className="popover-actions">
                                <button type="submit" className="btn btn-primary">{messages.applyRange}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}