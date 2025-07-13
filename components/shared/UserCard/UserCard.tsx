/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { User } from "../../../entities/index";
import "./UserCard.css";

interface UserCardProps {
  user: User;
  onClick: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UserCard({ user, onClick, onEdit, onDelete }: UserCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(user);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(user);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(user);
  };

  return (
    <div className="user-card" onClick={handleCardClick}>
      <div className="user-info">
        <h3 className="user-name">
          {user.lastName}, {user.name} ({user.userCode})
        </h3>
        <p className="user-details">
          {user.type}
          {user.type === "Estudiante" && user.grade ? ` - ${user.grade}` : ""}
        </p>
      </div>
      {(onEdit || onDelete) && (
        <div className="user-actions">
          {onEdit && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={handleEdit}
              title="Editar usuario"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              className="btn btn-sm btn-danger"
              onClick={handleDelete}
              title="Eliminar usuario"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
}
