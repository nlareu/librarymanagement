/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useMemo } from "react";
import type { User, UserType } from "../../../entities/index";
import { UserCard } from "../../shared/UserCard/UserCard";
import { UserFilters } from "../../shared/UserFilters/UserFilters";
import "./UserListView.css";
import { messages } from "./messages";

interface UserListViewProps {
  users: User[];
  onSelectUser: (user: User) => void;
  onAddUserClick: () => void;
}

export function UserListView({
  users,
  onSelectUser,
  onAddUserClick,
}: UserListViewProps) {
  const [searchText, setSearchText] = useState("");
  const [typeFilters, setTypeFilters] = useState<UserType[]>([]);

  const handleClearFilters = () => {
    setSearchText("");
    setTypeFilters([]);
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const searchLower = searchText.toLowerCase().trim();
        const searchMatch =
          searchLower === "" ||
          `${user.name} ${user.lastName}`.toLowerCase().includes(searchLower) ||
          `${user.lastName}, ${user.name}`
            .toLowerCase()
            .includes(searchLower) ||
          user.userCode.toLowerCase().includes(searchLower);

        const typeMatch =
          typeFilters.length === 0 || typeFilters.includes(user.type);

        return searchMatch && typeMatch;
      })
      .sort((a, b) => {
        const lastNameComparison = a.lastName.localeCompare(b.lastName);
        if (lastNameComparison !== 0) {
          return lastNameComparison;
        }
        return a.name.localeCompare(b.name);
      });
  }, [users, searchText, typeFilters]);

  return (
    <div className="users-container view-container">
      <div className="view-header">
        <h2>{messages.title}</h2>
        <button className="btn btn-primary" onClick={onAddUserClick}>
          {messages.addUserButton}
        </button>
      </div>
      <UserFilters
        searchText={searchText}
        onSearchChange={setSearchText}
        typeFilters={typeFilters}
        onTypeChange={setTypeFilters}
        onClearFilters={handleClearFilters}
      />
      {users.length === 0 ? (
        <div className="empty-state">
          <p>{messages.emptyState}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <p>{messages.noFilterResults}</p>
          <button className="btn btn-primary" onClick={handleClearFilters}>
            {messages.clearFilters}
          </button>
        </div>
      ) : (
        <div className="user-list">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onClick={onSelectUser} />
          ))}
        </div>
      )}
    </div>
  );
}
