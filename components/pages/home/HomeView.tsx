/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import "./HomeView.css";
import { messages } from "./messages";

interface HomeViewProps {
  onEnterSystem?: () => void;
}

export function HomeView({ onEnterSystem }: HomeViewProps) {
  return (
    <div className="home-view">
      <div className="home-content">
        <div className="library-info">
          <h1 className="library-name">{messages.libraryName}</h1>
          <div className="librarian-info">
            <h2>{messages.librarianTitle}</h2>
            <p className="librarian-name">{messages.librarianName}</p>
          </div>
        </div>
        <div className="welcome-message">
          <p>{messages.welcomeMessage}</p>
        </div>
        {onEnterSystem && (
          <div className="enter-system">
            <button
              className="btn btn-primary enter-system-btn"
              onClick={onEnterSystem}
            >
              {messages.enterSystemButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
