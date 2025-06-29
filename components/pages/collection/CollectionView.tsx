/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Asset, ActiveLoan } from "../../../entities/index";
import { AssetCard } from "../../shared/AssetCard/AssetCard";
import { Filters } from "../../shared/Filters/Filters";
import "./CollectionView.css";
import { messages } from "./messages";

interface CollectionViewProps {
  assets: Asset[];
  filteredAssets: Asset[];
  activeLoans: ActiveLoan[];
  onBorrow: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
  searchText: string;
  onSearchChange: (text: string) => void;
  typeFilters: string[];
  onTypeChange: (types: string[]) => void;
  availableAssetTypes: string[];
  onClearFilters: () => void;
  onAddAssetClick: () => void;
}

export function CollectionView({
  assets,
  filteredAssets,
  activeLoans,
  onBorrow,
  onEdit,
  onDelete,
  onAddAssetClick,
  ...filterProps
}: CollectionViewProps) {
  return (
    <div className="assets-container view-container">
      <div className="view-header">
        <h2>{messages.title}</h2>
        <button className="btn btn-primary" onClick={onAddAssetClick}>
          {messages.addAssetButton}
        </button>
      </div>
      <Filters {...filterProps} />
      {assets.length === 0 ? (
        <div className="empty-state">
          <p>{messages.emptyLibrary}</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="empty-state">
          <p>{messages.noFilterResults}</p>
          <button
            className="btn btn-primary"
            onClick={filterProps.onClearFilters}
          >
            {messages.clearFilters}
          </button>
        </div>
      ) : (
        <div className="asset-list">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              activeLoans={activeLoans.filter(
                (loan) => loan.assetId === asset.id
              )}
              onBorrow={onBorrow}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
