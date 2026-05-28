export class IdentityServiceMessageContent {
  static readonly ALREADY_EXISTS = "Already exists";
  static readonly EMAIL_ALREADY_EXISTS = "Email already exists";

  static USER_ALREADY_EXISTS_WITH_FIELD(field: string) {
    return `User already exists with ${field}`;
  }

  static FIELD_NOT_FOUND(field: string) {
    return `${field} not found`;
  }

  static INVALID(field: string) {
    return `Invalid ${field}`;
  }

  static INCORRECT_FIELD(field: string) {
    return `Incorrect ${field}`;
  }

  static CREATED_UPDATED_EDITED(entity: string) {
    return `${entity} created/updated/edited successfully`;
  }

  static PLEASE_RESENT_OTP() {
    return "Please resend OTP";
  }

  static MESSAGE_SEND() {
    return "Message sent successfully";
  }
}
