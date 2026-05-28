import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * S3 Configuration Service
 *
 * Provides AWS S3 configuration settings for all microservices.
 * Reads configuration from environment variables via the config service.
 *
 * @service S3ConfigService
 * @version 1.0.0
 * @author ASB Backend Team
 */
@Injectable()
export class S3ConfigService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get AWS access key ID
   * @returns {string} AWS access key ID
   */
  get accessKeyId(): string {
    return (
      this.configService.get<string>("AWS_ACCESS_KEY_ID") ||
      this.configService.get<string>("AWS_S3_ACCESS_KEY") ||
      ""
    );
  }

  /**
   * Get AWS secret access key
   * @returns {string} AWS secret access key
   */
  get secretAccessKey(): string {
    return (
      this.configService.get<string>("AWS_SECRET_ACCESS_KEY") ||
      this.configService.get<string>("AWS_S3_SECRET_ACCESS_KEY") ||
      ""
    );
  }

  /**
   * Get AWS region
   * @returns {string} AWS region
   */
  get region(): string {
    return (
      this.configService.get<string>("AWS_REGION") ||
      this.configService.get<string>("AWS_S3_REGION") ||
      "us-east-1"
    );
  }

  /**
   * Get S3 bucket name
   * @returns {string} S3 bucket name
   */
  get bucketName(): string {
    return (
      this.configService.get<string>("AWS_S3_BUCKET") ||
      this.configService.get<string>("AWS_S3_BUCKET_NAME") ||
      ""
    );
  }

  /**
   * Get S3 configuration object for AWS SDK
   * @returns {object} S3 configuration
   */
  get s3Config() {
    return {
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      forcePathStyle:
        this.configService.get<boolean>("AWS_S3_FORCE_PATH_STYLE") || false,
    };
  }

  /**
   * Get S3 endpoint URL (for local development with localstack)
   * @returns {string|undefined} S3 endpoint URL
   */
  get endpoint(): string | undefined {
    return this.configService.get<string>("AWS_S3_ENDPOINT");
  }

  /**
   * Get complete S3 client configuration
   * @returns {object} Complete S3 client configuration
   */
  get clientConfig() {
    const config = this.s3Config;

    if (this.endpoint) {
      return {
        ...config,
        endpoint: this.endpoint,
        forcePathStyle: true,
      };
    }

    return config;
  }

  /**
   * Validate S3 configuration
   * @returns {boolean} True if configuration is valid
   */
  isValid(): boolean {
    return !!(
      this.accessKeyId &&
      this.secretAccessKey &&
      this.region &&
      this.bucketName
    );
  }

  /**
   * Get validation errors if configuration is invalid
   * @returns {string[]} Array of validation error messages
   */
  getValidationErrors(): string[] {
    const errors: string[] = [];

    if (!this.accessKeyId) {
      errors.push(
        "AWS Access Key ID is not configured (AWS_ACCESS_KEY_ID or AWS_S3_ACCESS_KEY)",
      );
    }

    if (!this.secretAccessKey) {
      errors.push(
        "AWS Secret Access Key is not configured (AWS_SECRET_ACCESS_KEY or AWS_S3_SECRET_ACCESS_KEY)",
      );
    }

    if (!this.region) {
      errors.push("AWS Region is not configured (AWS_REGION or AWS_S3_REGION)");
    }

    if (!this.bucketName) {
      errors.push(
        "S3 Bucket Name is not configured (AWS_S3_BUCKET or AWS_S3_BUCKET_NAME)",
      );
    }

    return errors;
  }

  /**
   * Generate S3 object URL
   * @param {string} key - The S3 object key
   * @returns {string} The S3 object URL
   */
  getObjectUrl(key: string): string {
    if (this.endpoint) {
      // For local development with localstack
      return `${this.endpoint}/${this.bucketName}/${key}`;
    }

    // For AWS S3
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
