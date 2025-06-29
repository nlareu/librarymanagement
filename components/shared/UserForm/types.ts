/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { UserType } from '../../../entities/index';

export interface UserFormData {
    name: string;
    lastName: string;
    type: UserType;
    grade?: string;
}
