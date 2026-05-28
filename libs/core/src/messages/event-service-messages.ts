export class EventServiceMessageContent {
  static readonly EVENT_ALREADY_COMPLETED_OR_CANCELLED =
    "Event is already completed or cancelled";
  static readonly MODULE_NOT_FOUND = "Module not found";
  static readonly QUESTION_NOT_FOUND = "Question not found";
  static readonly EVENT_COMPLETED_OR_CANCELLED = "Event completed or cancelled";
  static readonly SURVEY_ID_MISMATCH = "Survey ID mismatch";
  static readonly SURVEY_NOT_EXIST = "Survey does not exist";
  static readonly QUESTION_NOT_EXIST_OR_INACTIVE =
    "Question does not exist or is inactive";
  static readonly INVALID_ANSWER = "Invalid answer provided";
  static readonly SURVEY_ALREADY_SUBMITTED =
    "Survey has already been submitted";

  static CREATED(entity: string) {
    return `${entity} created successfully`;
  }
}
