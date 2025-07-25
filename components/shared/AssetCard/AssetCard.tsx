/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Asset, ActiveLoan } from "../../../entities/index";
import { stripMarcPrefix } from "../../../utils";
import "./AssetCard.css";
import { messages } from "./messages";

interface AssetCardProps {
  asset: Asset;
  activeLoans: ActiveLoan[];
  onBorrow: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

export function AssetCard({
  asset,
  activeLoans,
  onBorrow,
  onEdit,
  onDelete,
}: AssetCardProps) {
  const totalCopies = asset.copies ?? 1;
  const availableCopies = totalCopies - activeLoans.length;
  const isAvailable = availableCopies > 0;

  const getAvailabilityMessage = () => {
    if (!asset.isLoanable) {
      return messages.notLoanable;
    }
    return isAvailable
      ? messages.availableCopies
          .replace("{available}", String(availableCopies))
          .replace("{total}", String(totalCopies))
      : messages.notAvailable;
  };

  const getAvailabilityClass = () => {
    if (!asset.isLoanable) {
      return "not-loanable";
    }
    return isAvailable ? "available" : "unavailable";
  };

  return (
    <div className="asset-card">
      <div className="asset-info">
        <h3 className="asset-title">{stripMarcPrefix(asset.title, "title")}</h3>
        {asset.author && (
          <p className="asset-author">
            {messages.authorPrefix}
            {stripMarcPrefix(asset.author, "author")}
          </p>
        )}
        <div className="asset-details">
          <span className="asset-type-tag">{asset.type}</span>
          {asset.signature && (
            <span className="asset-signature">
              {messages.signaturePrefix}
              {asset.signature}
            </span>
          )}
          {asset.isbn && (
            <span className="asset-isbn">
              {messages.isbnPrefix}
              {stripMarcPrefix(asset.isbn, "isbn")}
            </span>
          )}
        </div>
        <p className="asset-description">
          {stripMarcPrefix(asset.description, "description")}
        </p>
      </div>
      <div className="asset-status">
        <div className={`asset-availability ${getAvailabilityClass()}`}>
          <span className="availability-dot"></span>
          {getAvailabilityMessage()}
        </div>
      </div>
      <div className="asset-actions">
        {asset.isLoanable && (
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => onBorrow(asset)}
            disabled={!isAvailable}
          >
            {messages.borrowAction}
          </button>
        )}
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => onEdit(asset)}
        >
          {messages.editAction}
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(asset)}
        >
          {messages.deleteAction}
        </button>
      </div>
    </div>
  );
}
