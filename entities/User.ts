/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserType = 'Estudiante' | 'Profesor' | 'Personal';

export interface User {
    id: string;
    userCode: string;
    name: string;
    lastName: string;
    type: UserType;
    grade?: string;
}
