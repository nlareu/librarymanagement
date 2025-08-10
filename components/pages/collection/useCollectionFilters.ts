/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useMemo, useCallback } from "react";
import type { Asset } from "../../../entities/index";
import { stripMarcPrefix } from "../../../utils";

export function useCollectionFilters(assets: Asset[]) {
  const [searchText, setSearchText] = useState("");
  const [typeFilters, setTypeFilters] = useState<string[]>([]);

  const onClearFilters = useCallback(() => {
    setSearchText("");
    setTypeFilters([]);
  }, []);

  const availableAssetTypes = useMemo(() => {
    const types = new Set(
      assets
        .map((a) => a.type)
        .filter((type): type is string => type !== undefined)
    );
    return Array.from(types).sort();
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const searchMatch =
        searchText.trim() === "" ||
        stripMarcPrefix(asset.title, "title")
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        stripMarcPrefix(asset.description, "description")
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

      const typeMatch =
        typeFilters.length === 0 ||
        (asset.type && typeFilters.includes(asset.type));

      return searchMatch && typeMatch;
    });
  }, [assets, searchText, typeFilters]);

  return {
    searchText,
    onSearchChange: setSearchText,
    typeFilters,
    onTypeChange: setTypeFilters,
    onClearFilters,
    availableAssetTypes,
    filteredAssets,
  };
}
