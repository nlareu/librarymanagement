/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import type { UserType } from '../../../entities/index';
import type { UserFormData } from './types';
import '../Modal/Modal.css';
import { messages } from './messages';

interface UserFormProps {
    onSubmit: (data: UserFormData) => void;
    submitButtonText: string;
    onCancel?: () => void;
}

export function UserForm({ onSubmit, submitButtonText, onCancel }: UserFormProps) {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [type, setType] = useState<UserType>('Estudiante');
    const [grade, setGrade] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError(messages.nameRequiredError);
            return;
        }
        if (!lastName.trim()) {
            setError(messages.lastNameRequiredError);
            return;
        }
        if (type === 'Estudiante' && !grade.trim()) {
            setError(messages.gradeRequiredError);
            return;
        }
        setError('');
        onSubmit({ name, lastName, type, grade: type === 'Estudiante' ? grade : undefined });
        setName('');
        setLastName('');
        setType('Estudiante');
        setGrade('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">{messages.nameLabel}</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={messages.namePlaceholder}
                    required
                    autoFocus
                />
            </div>
            <div className="form-group">
                <label htmlFor="lastName">{messages.lastNameLabel}</label>
                <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={messages.lastNamePlaceholder}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="type">{messages.typeLabel}</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as UserType)}
                >
                    <option value="Estudiante">{messages.typeStudent}</option>
                    <option value="Profesor">{messages.typeTeacher}</option>
                    <option value="Personal">{messages.typeStaff}</option>
                </select>
            </div>
            {type === 'Estudiante' && (
                <div className="form-group">
                    <label htmlFor="grade">{messages.gradeLabel}</label>
                    <input
                        id="grade"
                        type="text"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder={messages.gradePlaceholder}
                        required
                    />
                </div>
            )}
            {error && <p className="error-message">{error}</p>}
            <div className="modal-actions">
                {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>{messages.cancelAction}</button>}
                <button type="submit" className="btn btn-primary">{submitButtonText}</button>
            </div>
        </form>
    );
}
