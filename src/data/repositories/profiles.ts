import { BaseRepository } from "@/data/base-repository";
import type { UserProfile } from "@/types";

class ProfilesRepository extends BaseRepository<UserProfile> {
  constructor() {
    super("profiles");
  }
}

export const profilesRepo = new ProfilesRepository();
