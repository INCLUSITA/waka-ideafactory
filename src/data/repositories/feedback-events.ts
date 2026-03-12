import { BaseRepository } from "@/data/base-repository";
import type { FeedbackEvent } from "@/types";

class FeedbackEventsRepository extends BaseRepository<FeedbackEvent> {
  constructor() {
    super("feedback_events");
  }
}

export const feedbackEventsRepo = new FeedbackEventsRepository();
