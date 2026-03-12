import { BaseRepository } from "@/data/base-repository";
import type { AuditEntry } from "@/types";

class AuditRepository extends BaseRepository<AuditEntry> {
  constructor() {
    super("audit_log");
  }
}

export const auditRepo = new AuditRepository();
