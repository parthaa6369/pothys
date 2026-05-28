export interface ISMSConfig {
  username: string;
  password: string;
  baseUrl: string;
  restApiUrl: string;
  defaultSenderId?: string;
  agreeTerm: string;
}

export interface ISMSResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  errorCode?: number;
}

export interface ISMSDeliveryStatus {
  msisdn: string;
  trx_id: string;
  dn_status: "DELIVERED" | "UNDELIVERED" | "PENDING" | "ACCEPTED";
}

export interface ISMSProvider {
  sendSMS(
    phoneNumber: string,
    message: string,
    type?: number,
    senderId?: string,
  ): Promise<ISMSResponse>;

  sendBulkSMS(
    recipients: Array<{
      dstno: string;
      msg: string;
      type?: number;
    }>,
    senderId?: string,
  ): Promise<ISMSResponse>;

  handleDeliveryStatus(statusData: ISMSDeliveryStatus): Promise<void>;
}

// ISMS API Response Codes from the PDF
export enum ISMSResponseCode {
  SUCCESS = 2000,
  UNKNOWN_ERROR = -1000,
  AUTHENTICATION_FAILED = -1001,
  ACCOUNT_SUSPENDED = -1002,
  IP_NOT_ALLOWED = -1003,
  INSUFFICIENT_CREDITS = -1004,
  INVALID_SMS_TYPE = -1005,
  INVALID_BODY_LENGTH = -1006,
  INVALID_HEX_BODY = -1007,
  MISSING_PARAMETER = -1008,
  INVALID_DESTINATION_NUMBER = -1009,
  INVALID_MESSAGE_TYPE = -1012,
  INVALID_TERM_AGREEMENT = -1013,
}
