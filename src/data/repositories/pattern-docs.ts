import { BaseRepository } from "@/data/base-repository";
import type { PatternDoc } from "@/types";

class PatternDocsRepository extends BaseRepository<PatternDoc> {
  constructor() {
    super("pattern_docs");
  }
}

export const patternDocsRepo = new PatternDocsRepository();
