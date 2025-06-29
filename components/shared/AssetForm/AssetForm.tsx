/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, KeyboardEvent } from 'react';
import type { AssetFormData } from './types';
import { MARC_MAP } from '../../../utils';
import './AssetForm.css';
import { messages } from './messages';

interface AssetFormProps {
    onSubmit: (data: AssetFormData) => void;
    initialData?: AssetFormData;
    submitButtonText: string;
    onCancel?: () => void;
}

export function AssetForm({ onSubmit, initialData, submitButtonText, onCancel }: AssetFormProps) {
    const [formData, setFormData] = useState<AssetFormData>(
        initialData || {
            title: '', type: 'Libro', description: '',
            registrationNumber: '', signature: '', isbn: '', author: '', publisher: '',
            publicationPlace: '', edition: '', publicationYear: '', collectionTitle: '',
            collectionNumber: '', volumes: '1', copies: '1',
            isLoanable: true, subjects: [], ibicSubjects: []
        }
    );
    const [errors, setErrors] = useState<Partial<Record<keyof AssetFormData, string>>>({});

    const [newSubject, setNewSubject] = useState('');
    const [newIbicSubject, setNewIbicSubject] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
    };

    // Generic handler for adding a tag-like value (e.g., a subject)
    const handleAddTag = (
        tagValue: string,
        stateSetter: React.Dispatch<React.SetStateAction<string>>,
        formDataKey: 'subjects' | 'ibicSubjects'
    ) => {
        if (!tagValue.trim()) return;
        
        const prefix = MARC_MAP[formDataKey];
        const valueWithPrefix = prefix ? `${prefix}-${tagValue.trim()}` : tagValue.trim();

        // Prevent adding duplicates
        if (formData[formDataKey].includes(valueWithPrefix)) {
            stateSetter('');
            return;
        }

        setFormData(prev => ({
            ...prev,
            [formDataKey]: [...prev[formDataKey], valueWithPrefix],
        }));
        stateSetter('');
    };
    
    // Generic handler for removing a tag
    const handleRemoveTag = (indexToRemove: number, formDataKey: 'subjects' | 'ibicSubjects') => {
        setFormData(prev => ({
            ...prev,
            [formDataKey]: prev[formDataKey].filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleTagInputKeyDown = (
        e: KeyboardEvent<HTMLInputElement>,
        tagValue: string,
        stateSetter: React.Dispatch<React.SetStateAction<string>>,
        formDataKey: 'subjects' | 'ibicSubjects'
    ) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag(tagValue, stateSetter, formDataKey);
        }
    };
    
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof AssetFormData, string>> = {};

        const fieldsToValidate: (keyof AssetFormData)[] = [
            'title', 'description', 'isbn', 'author', 'publisher', 'publicationPlace',
            'edition', 'publicationYear', 'collectionTitle', 'collectionNumber'
        ];

        fieldsToValidate.forEach(field => {
            const value = formData[field] as string;
            const code = MARC_MAP[field];

            if (code && value) { // Only validate if there is a value and a code
                const prefix = `${code}-`;
                if (!value.startsWith(prefix) || value.trim() === prefix) {
                    newErrors[field] = messages.validation.prefixAndValue.replace('{prefix}', prefix);
                }
            }
        });
        
        // Special validation for title being required
        const titleValue = formData.title.trim();
        if (!titleValue || titleValue === '245-') {
            newErrors.title = messages.validation.requiredTitle;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <fieldset>
                <legend>{messages.mainInfoLegend}</legend>
                <div className="form-grid">
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="title">{messages.titleLabel}</label>
                        <input id="title" type="text" value={formData.title} onChange={handleChange} required className={errors.title ? 'has-error' : ''} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} />
                        {errors.title && <p id="title-error" className="field-error-message">{errors.title}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="author">{messages.authorLabel}</label>
                        <input id="author" type="text" value={formData.author} onChange={handleChange} className={errors.author ? 'has-error' : ''} aria-invalid={!!errors.author} aria-describedby={errors.author ? 'author-error' : undefined} />
                        {errors.author && <p id="author-error" className="field-error-message">{errors.author}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">{messages.formatLabel}</label>
                        <select id="type" value={formData.type} onChange={handleChange}>
                            <option>{messages.formatOptions.book}</option>
                            <option>{messages.formatOptions.movie}</option>
                            <option>{messages.formatOptions.album}</option>
                            <option>{messages.formatOptions.game}</option>
                            <option>{messages.formatOptions.magazine}</option>
                            <option>{messages.formatOptions.other}</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="description">{messages.descriptionLabel}</label>
                    <textarea id="description" value={formData.description} onChange={handleChange} rows={3} className={errors.description ? 'has-error' : ''} aria-invalid={!!errors.description} aria-describedby={errors.description ? 'description-error' : undefined}></textarea>
                    {errors.description && <p id="description-error" className="field-error-message">{errors.description}</p>}
                </div>
            </fieldset>

            <fieldset>
                <legend>{messages.publicationLegend}</legend>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="publisher">{messages.publisherLabel}</label>
                        <input id="publisher" type="text" value={formData.publisher} onChange={handleChange} className={errors.publisher ? 'has-error' : ''} aria-invalid={!!errors.publisher} aria-describedby={errors.publisher ? 'publisher-error' : undefined} />
                        {errors.publisher && <p id="publisher-error" className="field-error-message">{errors.publisher}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="publicationPlace">{messages.publicationPlaceLabel}</label>
                        <input id="publicationPlace" type="text" value={formData.publicationPlace} onChange={handleChange} className={errors.publicationPlace ? 'has-error' : ''} aria-invalid={!!errors.publicationPlace} aria-describedby={errors.publicationPlace ? 'publicationPlace-error' : undefined} />
                        {errors.publicationPlace && <p id="publicationPlace-error" className="field-error-message">{errors.publicationPlace}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="edition">{messages.editionLabel}</label>
                        <input id="edition" type="text" value={formData.edition} onChange={handleChange} className={errors.edition ? 'has-error' : ''} aria-invalid={!!errors.edition} aria-describedby={errors.edition ? 'edition-error' : undefined} />
                        {errors.edition && <p id="edition-error" className="field-error-message">{errors.edition}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="publicationYear">{messages.yearLabel}</label>
                        <input id="publicationYear" type="text" value={formData.publicationYear} onChange={handleChange} className={errors.publicationYear ? 'has-error' : ''} aria-invalid={!!errors.publicationYear} aria-describedby={errors.publicationYear ? 'publicationYear-error' : undefined} />
                        {errors.publicationYear && <p id="publicationYear-error" className="field-error-message">{errors.publicationYear}</p>}
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>{messages.collectionLegend}</legend>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="collectionTitle">{messages.collectionTitleLabel}</label>
                        <input id="collectionTitle" type="text" value={formData.collectionTitle} onChange={handleChange} className={errors.collectionTitle ? 'has-error' : ''} aria-invalid={!!errors.collectionTitle} aria-describedby={errors.collectionTitle ? 'collectionTitle-error' : undefined} />
                        {errors.collectionTitle && <p id="collectionTitle-error" className="field-error-message">{errors.collectionTitle}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="collectionNumber">{messages.collectionNumberLabel}</label>
                        <input id="collectionNumber" type="text" value={formData.collectionNumber} onChange={handleChange} className={errors.collectionNumber ? 'has-error' : ''} aria-invalid={!!errors.collectionNumber} aria-describedby={errors.collectionNumber ? 'collectionNumber-error' : undefined} />
                        {errors.collectionNumber && <p id="collectionNumber-error" className="field-error-message">{errors.collectionNumber}</p>}
                    </div>
                </div>
            </fieldset>
            
            <fieldset>
                <legend>{messages.physicalLegend}</legend>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="volumes">{messages.volumesLabel}</label>
                        <input id="volumes" type="number" min="1" value={formData.volumes} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="copies">{messages.copiesLabel}</label>
                        <input id="copies" type="number" min="1" value={formData.copies} onChange={handleChange} />
                    </div>
                </div>
            </fieldset>
            
            <fieldset>
                <legend>{messages.classificationLegend}</legend>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="signature">{messages.signatureLabel}</label>
                        <input id="signature" type="text" value={formData.signature} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="isbn">{messages.isbnLabel}</label>
                        <input id="isbn" type="text" value={formData.isbn} onChange={handleChange} className={errors.isbn ? 'has-error' : ''} aria-invalid={!!errors.isbn} aria-describedby={errors.isbn ? 'isbn-error' : undefined} />
                        {errors.isbn && <p id="isbn-error" className="field-error-message">{errors.isbn}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="registrationNumber">{messages.inventoryNumberLabel}</label>
                        <input id="registrationNumber" type="text" value={formData.registrationNumber} onChange={handleChange} />
                    </div>
                    <div className="form-group-checkbox">
                        <input id="isLoanable" type="checkbox" checked={formData.isLoanable} onChange={handleChange} />
                        <label htmlFor="isLoanable">{messages.isLoanableLabel}</label>
                    </div>
                </div>
                <div className="tag-input-section">
                    <h5>{messages.subjectsLabel}</h5>
                    {formData.subjects.length > 0 && (
                        <div className="tags-list">
                            {formData.subjects.map((subject, index) => (
                                <div key={index} className="tag-item">
                                    <span>{subject}</span>
                                    <button type="button" onClick={() => handleRemoveTag(index, 'subjects')}>&times;</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="tag-add-form">
                        <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} onKeyDown={e => handleTagInputKeyDown(e, newSubject, setNewSubject, 'subjects')} placeholder={messages.addSubjectPlaceholder} />
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleAddTag(newSubject, setNewSubject, 'subjects')}>{messages.addAction}</button>
                    </div>
                </div>
                <div className="tag-input-section">
                    <h5>{messages.ibicSubjectsLabel}</h5>
                    {formData.ibicSubjects.length > 0 && (
                        <div className="tags-list">
                            {formData.ibicSubjects.map((subject, index) => (
                                <div key={index} className="tag-item">
                                    <span>{subject}</span>
                                    <button type="button" onClick={() => handleRemoveTag(index, 'ibicSubjects')}>&times;</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="tag-add-form">
                        <input type="text" value={newIbicSubject} onChange={e => setNewIbicSubject(e.target.value)} onKeyDown={e => handleTagInputKeyDown(e, newIbicSubject, setNewIbicSubject, 'ibicSubjects')} placeholder={messages.addIbicSubjectPlaceholder} />
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleAddTag(newIbicSubject, setNewIbicSubject, 'ibicSubjects')}>{messages.addAction}</button>
                    </div>
                </div>
            </fieldset>

            <div className="modal-actions">
                {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>{messages.cancelAction}</button>}
                <button type="submit" className="btn btn-primary">{submitButtonText}</button>
            </div>
        </form>
    );
}
