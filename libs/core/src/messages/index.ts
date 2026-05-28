// Import all message classes
import { MessageContent as CommonMessages } from "./common";
import { ComplainceServiceMessages } from "./complaince-service.messages";
import { EventServiceMessageContent } from "./event-service-messages";
import { FarmerServiceMessageContent } from "./farmer-service-messages";
import { IdentityServiceMessageContent } from "./identity-service-messages";
import { NotificationServiceMessageContent } from "./notification-service-messages";
import { TraceAwaitingMessages } from "./trace-awaiting-messages";

// Combined MessageContent class with all messages from all microservices

// Helper to get all static properties and methods from a class
function getAllStaticProps(cls: any) {
  const props = Object.getOwnPropertyNames(cls)
    .filter((key) => key !== "length" && key !== "prototype" && key !== "name")
    .reduce(
      (acc, key) => {
        acc[key] = (cls as any)[key];
        return acc;
      },
      {} as Record<string, any>,
    );
  return props;
}

// Manually assign all static function properties from IdentityServiceMessageContent
const identityServiceDynamicMethods = {
  ...IdentityServiceMessageContent,
  USER_ALREADY_EXISTS_WITH_FIELD:
    IdentityServiceMessageContent.USER_ALREADY_EXISTS_WITH_FIELD,
  FIELD_NOT_FOUND: IdentityServiceMessageContent.FIELD_NOT_FOUND,
  INVALID: IdentityServiceMessageContent.INVALID,
  INCORRECT_FIELD: IdentityServiceMessageContent.INCORRECT_FIELD,
  CREATED_UPDATED_EDITED: IdentityServiceMessageContent.CREATED_UPDATED_EDITED,
  PLEASE_RESENT_OTP: IdentityServiceMessageContent.PLEASE_RESENT_OTP,
  MESSAGE_SEND: IdentityServiceMessageContent.MESSAGE_SEND,
};

export const MessageContent = {
  ...CommonMessages,
  ...getAllStaticProps(IdentityServiceMessageContent),
  ...identityServiceDynamicMethods,
  ...EventServiceMessageContent,
  ...NotificationServiceMessageContent,
  ...FarmerServiceMessageContent,
  ...TraceAwaitingMessages,
  ...ComplainceServiceMessages,
  FETCHED: CommonMessages.FETCHED,
  EVENT_ALREADY_COMPLETED_OR_CANCELLED:
    EventServiceMessageContent.EVENT_ALREADY_COMPLETED_OR_CANCELLED,
  MODULE_NOT_FOUND: EventServiceMessageContent.MODULE_NOT_FOUND,
  QUESTION_NOT_FOUND: EventServiceMessageContent.QUESTION_NOT_FOUND,
  ALREADY_EXISTS: IdentityServiceMessageContent.ALREADY_EXISTS,
  EMAIL_ALREADY_EXISTS: IdentityServiceMessageContent.EMAIL_ALREADY_EXISTS,
  ENTITY_NOT_FOUND: CommonMessages.ENTITY_NOT_FOUND,
  CREATED: EventServiceMessageContent.CREATED("Event"),
  SURVEY_ID_MISMATCH: EventServiceMessageContent.SURVEY_ID_MISMATCH,
  SURVEY_NOT_EXIST: EventServiceMessageContent.SURVEY_NOT_EXIST,
  QUESTION_NOT_EXIST_OR_INACTIVE:
    EventServiceMessageContent.QUESTION_NOT_EXIST_OR_INACTIVE,
  INVALID_ANSWER: EventServiceMessageContent.INVALID_ANSWER,
  SURVEY_ALREADY_SUBMITTED: EventServiceMessageContent.SURVEY_ALREADY_SUBMITTED,
  DATA_NOT_FOUND: TraceAwaitingMessages.DATA_NOT_FOUND,
  TRAINING_CREATED_UPDATE_DELETE_SUB:
    ComplainceServiceMessages.TRAINING_CREATED_UPDATE_DELETE_SUB,
  TRAINING_CREATED_UPDATE_DELETE_SUCCESS:
    ComplainceServiceMessages.TRAINING_CREATED_UPDATE_DELETE_SUCCESS,
  LESSON_CREATE_EDIT_DELETE_UPLOAD:
    ComplainceServiceMessages.LESSON_CREATE_EDIT_DELETE_UPLOAD,
  EVENT_COMPLETED_OR_CANCELLED:
    EventServiceMessageContent.EVENT_COMPLETED_OR_CANCELLED,
};
