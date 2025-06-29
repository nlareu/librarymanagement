/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDisplayDate(isoString: string): string {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    // Add a check for invalid date
    if (isNaN(date.getTime())) {
        return 'Fecha inválida';
    }
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

export function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Parses a 'YYYY-MM-DD' string into a Date object at local midnight.
 * This is crucial for date-range filtering to avoid timezone-related issues where
 * `new Date('YYYY-MM-DD')` creates a date at UTC midnight, which might be the
 * previous day in the user's local timezone.
 * @param dateString The date string in 'YYYY-MM-DD' format.
 * @returns A Date object representing midnight in the user's local timezone.
 */
export const parseDateStringAsLocal = (dateString: string): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    // By getting the timezone offset and adding it back, we effectively convert
    // the UTC-midnight date to a local-midnight date.
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
};

export const MARC_MAP: Record<string, string> = {
    isbn: '020',
    author: '100',
    title: '245',
    edition: '250',
    publisher: '260',
    publicationPlace: '260',
    publicationYear: '260',
    collectionTitle: '490',
    collectionNumber: '490',
    description: '520',
    subjects: '650',
    ibicSubjects: '650',
};

export function addMarcPrefix(value: string | undefined, fieldKey: string): string | undefined {
    if (!value) return value === '' ? '' : undefined;
    const code = MARC_MAP[fieldKey];
    if (code) {
        return `${code}-${value}`;
    }
    return value;
}

export function stripMarcPrefix(value: string | undefined, fieldKey: string): string | undefined {
    if (!value) return value;
    const code = MARC_MAP[fieldKey];
    if (code && value.startsWith(`${code}-`)) {
        return value.substring(code.length + 1);
    }
    return value;
}