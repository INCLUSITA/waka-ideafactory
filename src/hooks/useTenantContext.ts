import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { membershipsRepo, tenantsRepo } from "@/data";
import type { Tenant, TenantMembership } from "@/types";

interface TenantContext {
  tenant: Tenant | null;
  membership: TenantMembership | null;
  loading: boolean;
}

export function useTenantContext(): TenantContext {
  const { user } = useAuth();
  const [state, setState] = useState<TenantContext>({
    tenant: null,
    membership: null,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setState({ tenant: null, membership: null, loading: false });
      return;
    }

    membershipsRepo
      .findAll({ order_by: "created_at", ascending: true, limit: 1 })
      .then(async (ms) => {
        if (ms.length === 0) {
          setState({ tenant: null, membership: null, loading: false });
          return;
        }
        const membership = ms[0];
        const tenant = await tenantsRepo.findById(membership.tenant_id);
        setState({ tenant, membership, loading: false });
      })
      .catch(() => {
        setState({ tenant: null, membership: null, loading: false });
      });
  }, [user]);

  return state;
}
