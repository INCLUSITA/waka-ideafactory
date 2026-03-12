import { BaseRepository } from "@/data/base-repository";
import type { Asset } from "@/types";

class AssetsRepository extends BaseRepository<Asset> {
  constructor() {
    super("assets");
  }
}

export const assetsRepo = new AssetsRepository();
