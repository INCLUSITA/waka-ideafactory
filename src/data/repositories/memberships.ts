import { BaseRepository } from "@/data/base-repository";
import type { TenantMembership } from "@/types";

class MembershipsRepository extends BaseRepository<TenantMembership> {
  constructor() {
    super("tenant_memberships");
  }
}

export const membershipsRepo = new MembershipsRepository();
