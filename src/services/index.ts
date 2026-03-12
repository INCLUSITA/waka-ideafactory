/**
 * Service layer barrel.
 * Services orchestrate domain logic on top of repositories.
 * Components consume services; services consume repositories.
 *
 * Pending implementation as features are built:
 * - ApplicationsService: CRUD + lifecycle transitions
 * - AssetsService: versioning + publish flow
 * - IdeasService: scoring + status pipeline
 * - GovernanceService: audit trail queries
 */

export {
  tenantsRepo,
  profilesRepo,
  membershipsRepo,
  applicationsRepo,
  assetsRepo,
  ideasRepo,
  auditRepo,
} from "@/data";
