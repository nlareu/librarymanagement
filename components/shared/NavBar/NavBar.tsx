/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { View } from "../../../types";
import "./NavBar.css";
import { messages } from "./messages";

interface NavBarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export function NavBar({ currentView, onNavigate }: NavBarProps) {
  return (
    <nav className="nav-bar">
      <button
        className={`nav-button ${currentView === "collection" ? "active" : ""}`}
        onClick={() => onNavigate("collection")}
        aria-current={currentView === "collection" ? "page" : undefined}
      >
        {messages.collection}
      </button>
      <button
        className={`nav-button ${currentView === "users" ? "active" : ""}`}
        onClick={() => onNavigate("users")}
        aria-current={currentView === "users" ? "page" : undefined}
      >
        {messages.users}
      </button>
      <button
        className={`nav-button ${currentView === "history" ? "active" : ""}`}
        onClick={() => onNavigate("history")}
        aria-current={currentView === "history" ? "page" : undefined}
      >
        {messages.history}
      </button>
      <button
        className={`nav-button ${currentView === "sync" ? "active" : ""}`}
        onClick={() => onNavigate("sync")}
        aria-current={currentView === "sync" ? "page" : undefined}
      >
        {messages.sync}
      </button>
    </nav>
  );
}
