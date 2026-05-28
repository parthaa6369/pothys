export class MessageContent {
  static readonly CREATED_SUCCESSFULLY = "Created successfully";
  static readonly UPDATED_SUCCESSFULLY = "Updated successfully";

  // Authentication Messages
  static readonly LOGIN_SUCCESSFUL = "Login successful";
  static readonly LOGOUT_SUCCESSFUL = "Logout successful";
  static readonly TOKEN_EXPIRED = "Token has expired";
  static readonly INVALID_TOKEN = "Invalid token";
  static readonly ACCESS_DENIED = "Access denied";
  static readonly UNAUTHORIZED = "Unauthorized access";
  static readonly SESSION_EXPIRED = "Session has expired";

  // Validation Messages
  static readonly VALIDATION_ERROR = "Validation error";
  static readonly REQUIRED_FIELD_MISSING = "Required field is missing";
  static readonly INVALID_EMAIL_FORMAT = "Invalid email format";
  static readonly INVALID_PHONE_FORMAT = "Invalid phone number format";
  static readonly PASSWORD_TOO_WEAK = "Password is too weak";
  static readonly PASSWORDS_DO_NOT_MATCH = "Passwords do not match";

  // OTP Messages
  static readonly OTP_SENT_SUCCESSFULLY = "OTP sent successfully";
  static readonly OTP_VERIFIED_SUCCESSFULLY = "OTP verified successfully";
  static readonly INVALID_OTP = "Invalid OTP";
  static readonly OTP_EXPIRED = "OTP has expired";
  static readonly OTP_ALREADY_VERIFIED = "OTP already verified";
  static readonly FAILED_TO_SEND_OTP = "Failed to send OTP";
  static readonly FAILED_TO_SEND_VERIFICATION_CODE =
    "Failed to send verification code";

  // Role and Permission Messages
  static readonly ROLE_CREATED_SUCCESSFULLY = "Role created successfully";
  static readonly ROLE_UPDATED_SUCCESSFULLY = "Role updated successfully";
  static readonly ROLE_DELETED_SUCCESSFULLY = "Role deleted successfully";
  static readonly ROLE_NOT_FOUND = "Role not found";
  static readonly INSUFFICIENT_PERMISSIONS = "Insufficient permissions";

  // General Messages
  static readonly SUCCESS = "Operation completed successfully";
  static readonly INTERNAL_SERVER_ERROR = "Internal server error";
  static readonly BAD_REQUEST = "Bad request";
  static readonly NOT_FOUND = "Resource not found";
  static readonly CONFLICT = "Resource conflict";
  static readonly FORBIDDEN = "Forbidden";

  // File Upload Messages
  static readonly FILE_UPLOADED_SUCCESSFULLY = "File uploaded successfully";
  static readonly FILE_UPLOAD_FAILED = "File upload failed";
  static readonly INVALID_FILE_FORMAT = "Invalid file format";
  static readonly FILE_SIZE_TOO_LARGE = "File size too large";
  static readonly FILE_NOT_FOUND = "File not found";

  // Database Messages
  static readonly DATA_SAVED_SUCCESSFULLY = "Data saved successfully";
  static readonly DATA_UPDATED_SUCCESSFULLY = "Data updated successfully";
  static readonly DATA_DELETED_SUCCESSFULLY = "Data deleted successfully";
  static readonly DATA_NOT_FOUND = "Data not found";
  static readonly DATABASE_ERROR = "Database error occurred";
  static readonly IC_ALREADY_EXISTS =
    "IC Number already exists for an active Participant";
  static readonly MOBILE_NUMBER_ALREADY_EXISTS =
    "Mobile Number already exists for an active Participant";

  // Dynamic message methods
  static readonly FIELD_ALREADY_EXISTS_FOR_ENTITY = (field: string) =>
    `'${field}' already exists for this entity`;

  static USER_ALREADY_EXIST(field: string): string {
    return `User with this ${field} already exists`;
  }

  static CREATED_UPDATED_EDITED(entity: string, action: string): string {
    return `${entity} ${action.toLowerCase()} successfully`;
  }

  static NOT_FOUND_MESSAGE(entity: string): string {
    return `${entity} not found`;
  }

  static ALREADY_EXISTS_MESSAGE(entity: string): string {
    return `${entity} already exists`;
  }

  static OPERATION_SUCCESS(operation: string): string {
    return `${operation} completed successfully`;
  }

  static OPERATION_FAILED(operation: string): string {
    return `${operation} failed`;
  }

  static FIELD_REQUIRED(fieldName: string): string {
    return `${fieldName} is required`;
  }

  static INVALID_FORMAT(fieldName: string): string {
    return `Invalid ${fieldName} format`;
  }

  static ENTITY_NOT_FOUND(entity: string): string {
    return `${entity} not found`;
  }

  static FETCHED: (field: string) => string = (field: string) =>
    `${field} fetched successfully`;
}
