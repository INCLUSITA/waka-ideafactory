import { BaseRepository } from "@/data/base-repository";
import type { Tenant } from "@/types";

class TenantsRepository extends BaseRepository<Tenant> {
  constructor() {
    super("tenants");
  }
}

export const tenantsRepo = new TenantsRepository();
