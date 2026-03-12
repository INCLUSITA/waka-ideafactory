import { BaseRepository } from "@/data/base-repository";
import type { Idea } from "@/types";

class IdeasRepository extends BaseRepository<Idea> {
  constructor() {
    super("ideas");
  }
}

export const ideasRepo = new IdeasRepository();
