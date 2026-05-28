import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { ServiceResponse } from "../../types";
import { BaseServiceClient } from "../base-service-client";

// Firebase Cloud Messaging Types
export interface PushNotificationRequest {
  to?: string; // FCM registration token
  topic?: string; // Topic name
  condition?: string; // Boolean condition
  notification: {
    title: string;
    body: string;
    icon?: string;
    image?: string;
    sound?: string;
    badge?: string;
    tag?: string;
    color?: string;
    click_action?: string;
  };
  data?: Record<string, string>;
  android?: {
    priority?: "normal" | "high";
    ttl?: string;
    restricted_package_name?: string;
  };
  apns?: {
    headers?: Record<string, string>;
    payload?: {
      aps: {
        alert?: any;
        badge?: number;
        sound?: string;
        "content-available"?: number;
        "mutable-content"?: number;
        category?: string;
        "thread-id"?: string;
      };
    };
  };
}

export interface PushNotificationResponse {
  multicast_id?: number;
  success: number;
  failure: number;
  canonical_ids: number;
  results?: Array<{
    message_id?: string;
    registration_id?: string;
    error?: string;
  }>;
}

export interface FirestoreDocumentRequest {
  collection: string;
  documentId?: string;
  data: Record<string, any>;
}

@Injectable()
export class FirebaseClient extends BaseServiceClient {
  private readonly fcmLegacyUrl = "https://fcm.googleapis.com/fcm/send";
  private readonly firestoreUrl: string;
  private readonly serverKey: string;
  private readonly projectId: string;

  constructor() {
    super();
    this.serverKey = process.env.FIREBASE_SERVER_KEY || "";
    this.projectId = process.env.FIREBASE_PROJECT_ID || "";
    this.firestoreUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents`;

    // if (!this.projectId) {
    //   throw new Error("FIREBASE_PROJECT_ID environment variable is required");
    // }

    // Check if we have either server key (legacy) or service account credentials (modern)
    const hasServiceAccount =
      process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL;
    const hasServerKey = this.serverKey && this.serverKey !== "dummy";

    if (!hasServiceAccount && !hasServerKey) {
      console.warn("Firebase configuration incomplete. You need either:");
      console.warn(
        "1. FIREBASE_SERVER_KEY (legacy API) - get from Firebase Console > Cloud Messaging",
      );
      console.warn(
        "2. Service account credentials (modern API) - FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL",
      );
    }
  }

  /**
   * Send push notification via FCM
   * Usage: await firebaseClient.sendPushNotification({ to: 'token', notification: { title: 'Hello', body: 'World' } })
   */
  async sendPushNotification(
    request: PushNotificationRequest,
  ): Promise<ServiceResponse<PushNotificationResponse>> {
    // Try modern V1 API first if we have service account credentials
    const hasServiceAccount =
      process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL;

    if (hasServiceAccount) {
      try {
        return await this.sendPushNotificationV1(request);
      } catch (error) {
        console.warn(
          "V1 API failed, falling back to legacy API:",
          error.message,
        );
      }
    }

    // Fallback to legacy API
    if (!this.serverKey || this.serverKey === "dummy") {
      return {
        success: false,
        error:
          "Firebase configuration incomplete. Enable Legacy API in Firebase Console and set FIREBASE_SERVER_KEY, or ensure service account credentials are properly configured.",
        data: undefined,
      };
    }

    const headers = {
      Authorization: `key=${this.serverKey}`,
      "Content-Type": "application/json",
    };

    return this.post<PushNotificationResponse>(
      this.fcmLegacyUrl,
      request,
      headers,
    );
  }

  /**
   * Send push notification using modern V1 API with service account
   */
  private async sendPushNotificationV1(
    request: PushNotificationRequest,
  ): Promise<ServiceResponse<PushNotificationResponse>> {
    try {
      console.log("🔧 Starting V1 API notification send...");

      // Get access token using service account
      const accessToken = await this.getAccessToken();
      console.log("✅ Access token obtained successfully");

      const v1Url = `https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`;
      console.log("📡 V1 URL:", v1Url);

      // Convert legacy format to V1 format
      const v1Message = {
        message: {
          token: request.to,
          notification: {
            title: request.notification.title,
            body: request.notification.body,
            ...(request.notification.image && {
              image: request.notification.image,
            }),
          },
          ...(request.data &&
            Object.keys(request.data).length > 0 && { data: request.data }),
          android: {
            priority: "high",
            notification: {
              sound: "default",
              channel_id: "asb_notifications",
            },
          },
          apns: {
            payload: {
              aps: {
                sound: "default",
                badge: 1,
              },
            },
          },
        },
      };

      console.log("📝 V1 Message payload:", JSON.stringify(v1Message, null, 2));
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      console.log("🔤 Request headers:", headers);

      const response = await this.post<any>(v1Url, v1Message, headers);
      console.log("📨 FCM V1 Response:", JSON.stringify(response, null, 2));

      // Convert V1 response to legacy format for consistency
      if (response.success && response.data?.name) {
        console.log("✅ V1 API notification sent successfully");
        return {
          success: true,
          data: {
            success: 1,
            failure: 0,
            canonical_ids: 0,
            results: [{ message_id: response.data.name }],
          } as PushNotificationResponse,
        };
      } else {
        console.error("❌ V1 API failed:", response.error);
        return {
          success: false,
          error: response.error || "Failed to send notification via V1 API",
          data: undefined,
        };
      }
    } catch (error) {
      console.error("💥 V1 API error:", error.message);
      console.error("📊 Error details:", error);
      throw new Error(`V1 API error: ${error.message}`);
    }
  }

  /**
   * Get access token using service account credentials
   */
  private async getAccessToken(): Promise<string> {
    console.log("🔐 Starting OAuth2 token exchange...");

    const now = Math.floor(Date.now() / 1000);

    // Create JWT payload for Google OAuth2
    const payload = {
      iss: process.env.FIREBASE_CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600, // 1 hour
    };

    console.log("📋 JWT payload:", {
      ...payload,
      iss: "***@***",
      exp: "iat+3600",
    });

    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!privateKey) {
      throw new Error(
        "FIREBASE_PRIVATE_KEY not found in environment variables",
      );
    }

    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error(
        "FIREBASE_CLIENT_EMAIL not found in environment variables",
      );
    }

    console.log("🔑 Private key length:", privateKey.length);
    console.log("📧 Client email:", process.env.FIREBASE_CLIENT_EMAIL);

    try {
      // Sign JWT using the private key
      const signedJWT = jwt.sign(payload, privateKey, { algorithm: "RS256" });
      console.log("✅ JWT signed successfully");

      // Exchange JWT for access token
      const formData = new URLSearchParams();
      formData.append(
        "grant_type",
        "urn:ietf:params:oauth:grant-type:jwt-bearer",
      );
      formData.append("assertion", signedJWT);

      console.log("📤 Exchanging JWT for access token...");

      const tokenResponse = await this.post<{
        access_token: string;
        token_type: string;
        expires_in: number;
      }>("https://oauth2.googleapis.com/token", formData.toString(), {
        "Content-Type": "application/x-www-form-urlencoded",
      });

      console.log("📥 Token response status:", tokenResponse.success);

      if (!tokenResponse.success || !tokenResponse.data?.access_token) {
        console.error("❌ Token exchange failed:", tokenResponse.error);
        throw new Error(
          `Failed to get access token: ${tokenResponse.error || "Unknown error"}`,
        );
      }

      console.log("✅ Access token obtained successfully");
      return tokenResponse.data.access_token;
    } catch (error) {
      console.error("💥 JWT/Token error:", error.message);
      throw error;
    }
  }

  /**
   * Send push notification to multiple devices
   * Usage: await firebaseClient.sendBulkPushNotification({ registration_ids: ['token1', 'token2'], notification: { title: 'Hello', body: 'World' } })
   */
  async sendBulkPushNotification(request: {
    registration_ids: string[];
    notification: PushNotificationRequest["notification"];
    data?: Record<string, string>;
  }): Promise<ServiceResponse<PushNotificationResponse>> {
    // Check if server key is properly configured
    if (!this.serverKey || this.serverKey === "dummy") {
      return {
        success: false,
        error:
          "Firebase server key not configured. Please set FIREBASE_SERVER_KEY in your environment variables.",
        data: undefined,
      };
    }

    const headers = {
      Authorization: `key=${this.serverKey}`,
      "Content-Type": "application/json",
    };

    return this.post<PushNotificationResponse>(
      this.fcmLegacyUrl,
      request,
      headers,
    );
  }

  /**
   * Subscribe device to topic
   * Usage: await firebaseClient.subscribeToTopic({ tokens: ['token1', 'token2'], topic: 'news' })
   */
  async subscribeToTopic(request: {
    tokens: string[];
    topic: string;
  }): Promise<ServiceResponse<any>> {
    const { tokens, topic } = request;
    const url = `https://iid.googleapis.com/iid/v1:batchAdd`;

    const headers = {
      Authorization: `key=${this.serverKey}`,
      "Content-Type": "application/json",
    };

    const data = {
      to: `/topics/${topic}`,
      registration_tokens: tokens,
    };

    return this.post(url, data, headers);
  }

  /**
   * Unsubscribe device from topic
   * Usage: await firebaseClient.unsubscribeFromTopic({ tokens: ['token1', 'token2'], topic: 'news' })
   */
  async unsubscribeFromTopic(request: {
    tokens: string[];
    topic: string;
  }): Promise<ServiceResponse<any>> {
    const { tokens, topic } = request;
    const url = `https://iid.googleapis.com/iid/v1:batchRemove`;

    const headers = {
      Authorization: `key=${this.serverKey}`,
      "Content-Type": "application/json",
    };

    const data = {
      to: `/topics/${topic}`,
      registration_tokens: tokens,
    };

    return this.post(url, data, headers);
  }

  /**
   * Create Firestore document
   * Usage: await firebaseClient.createDocument({ collection: 'users', data: { name: 'John', email: 'john@example.com' } })
   */
  async createDocument(
    request: FirestoreDocumentRequest,
  ): Promise<ServiceResponse<any>> {
    const { collection, documentId, data } = request;
    const url = documentId
      ? `${this.firestoreUrl}/${collection}?documentId=${documentId}`
      : `${this.firestoreUrl}/${collection}`;

    // Convert data to Firestore format
    const firestoreData = {
      fields: this.convertToFirestoreFields(data),
    };

    const headers = {
      Authorization: `Bearer ${process.env.FIREBASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    };

    return this.post(url, firestoreData, headers);
  }

  /**
   * Get Firestore document
   * Usage: await firebaseClient.getDocument({ collection: 'users', documentId: 'user123' })
   */
  async getDocument(request: {
    collection: string;
    documentId: string;
  }): Promise<ServiceResponse<any>> {
    const { collection, documentId } = request;
    const url = `${this.firestoreUrl}/${collection}/${documentId}`;

    const headers = {
      Authorization: `Bearer ${process.env.FIREBASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    };

    return this.get(url, headers);
  }

  /**
   * Convert JavaScript object to Firestore fields format
   */
  private convertToFirestoreFields(
    data: Record<string, any>,
  ): Record<string, any> {
    const fields: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        fields[key] = { stringValue: value };
      } else if (typeof value === "number") {
        fields[key] = { doubleValue: value };
      } else if (typeof value === "boolean") {
        fields[key] = { booleanValue: value };
      } else if (value instanceof Date) {
        fields[key] = { timestampValue: value.toISOString() };
      } else if (Array.isArray(value)) {
        fields[key] = {
          arrayValue: {
            values: value.map(
              (v) => this.convertToFirestoreFields({ temp: v }).temp,
            ),
          },
        };
      } else if (typeof value === "object" && value !== null) {
        fields[key] = {
          mapValue: { fields: this.convertToFirestoreFields(value) },
        };
      }
    }

    return fields;
  }
}
