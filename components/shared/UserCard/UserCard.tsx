/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { User } from '../../../entities/index';
import './UserCard.css';

interface UserCardProps {
  user: User;
  onClick: (user: User) => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div className="user-card" onClick={() => onClick(user)}>
      <div className="user-info">
        <h3 className="user-name">{user.lastName}, {user.name} ({user.userCode})</h3>
        <p className="user-details">{user.type}{user.type === 'Estudiante' && user.grade ? ` - ${user.grade}` : ''}</p>
      </div>
      {/* Action buttons like Edit or Delete can be added here in the future */}
    </div>
  );
}