export interface ServiceConfig {
  name: string;
  httpUrl: string;
}

export interface ServiceCall {
  method: string;
  params?: any;
  timeout?: number;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface ApiClientOptions {
  timeout?: number;
  retries?: number;
  fallbackToHttp?: boolean;
}
