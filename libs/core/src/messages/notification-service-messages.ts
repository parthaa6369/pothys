export class NotificationServiceMessageContent {
  // Notification Messages
  static readonly NOTIFICATION_SENT = "Notification sent successfully";
  static readonly NOTIFICATION_FAILED = "Failed to send notification";
  static readonly NOTIFICATION_QUEUED = "Notification queued for delivery";
  static readonly NOTIFICATION_DELIVERED = "Notification delivered";
  static readonly NOTIFICATION_NOT_FOUND = "Notification not found";

  // Email Messages
  static readonly EMAIL_SENT_SUCCESSFULLY = "Email sent successfully";
  static readonly EMAIL_FAILED = "Failed to send email";
  static readonly EMAIL_INVALID_ADDRESS = "Invalid email address";
  static readonly EMAIL_TEMPLATE_NOT_FOUND = "Email template not found";

  // SMS Messages
  static readonly SMS_SENT_SUCCESSFULLY = "SMS sent successfully";
  static readonly SMS_FAILED = "Failed to send SMS";
  static readonly SMS_INVALID_NUMBER = "Invalid phone number";
  static readonly SMS_QUOTA_EXCEEDED = "SMS quota exceeded";

  // Push Notification Messages
  static readonly PUSH_SENT_SUCCESSFULLY =
    "Push notification sent successfully";
  static readonly PUSH_FAILED = "Failed to send push notification";
  static readonly PUSH_DEVICE_NOT_FOUND = "Device not found";
  static readonly PUSH_TOKEN_INVALID = "Invalid push token";

  // Template Messages
  static readonly TEMPLATE_CREATED = "Template created successfully";
  static readonly TEMPLATE_UPDATED = "Template updated successfully";
  static readonly TEMPLATE_DELETED = "Template deleted successfully";
  static readonly TEMPLATE_NOT_FOUND = "Template not found";

  // Common Messages (inherited from base)
  static readonly SUCCESS = "Operation completed successfully";
  static readonly INTERNAL_SERVER_ERROR = "Internal server error";
  static readonly VALIDATION_ERROR = "Validation error";
  static readonly BAD_REQUEST = "Bad request";
  static readonly UNAUTHORIZED = "Unauthorized access";
  static readonly FORBIDDEN = "Access forbidden";
  static readonly NOT_FOUND = "Resource not found";
}

// Export as MessageContent for consistency
export const MessageContent = NotificationServiceMessageContent;
