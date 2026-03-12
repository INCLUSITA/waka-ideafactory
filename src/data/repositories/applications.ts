import { BaseRepository } from "@/data/base-repository";
import type { Application } from "@/types";

class ApplicationsRepository extends BaseRepository<Application> {
  constructor() {
    super("applications");
  }
}

export const applicationsRepo = new ApplicationsRepository();
