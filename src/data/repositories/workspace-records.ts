import { BaseRepository } from "@/data/base-repository";
import type { WorkspaceRecord } from "@/types";

class WorkspaceRecordsRepository extends BaseRepository<WorkspaceRecord> {
  constructor() {
    super("workspace_records");
  }
}

export const workspaceRecordsRepo = new WorkspaceRecordsRepository();
