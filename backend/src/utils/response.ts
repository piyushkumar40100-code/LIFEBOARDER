import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta & {
    timestamp: string;
    requestId?: string;
  };
}

export class ResponseService {
  /**
   * Send a successful response
   */
  static success<T>(
    res: Response,
    data: T,
    statusCodeOrMessage?: number | string,
    message?: string
  ): Response<ApiResponse<T>> {
    let statusCode: number = 200;

    // Handle overloaded parameters
    if (typeof statusCodeOrMessage === 'number') {
      statusCode = statusCodeOrMessage;
    } else if (typeof statusCodeOrMessage === 'string') {
      message = statusCodeOrMessage;
    }

    return res.status(statusCode).json({
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    error: string,
    statusCode: number = 500,
    message?: string
  ): Response<ApiResponse> {
    return res.status(statusCode).json({
      success: false,
      error,
      message,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Send a paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    statusCode: number = 200,
    message?: string
  ): Response<PaginatedResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
      meta: {
        ...pagination,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Send a created response (201)
   */
  static created<T>(
    res: Response,
    data: T,
    message?: string
  ): Response<ApiResponse<T>> {
    return this.success(res, data, 201, message);
  }

  /**
   * Send a no content response (204)
   */
  static noContent(res: Response): Response<void> {
    return res.status(204).send();
  }

  /**
   * Send a bad request response (400)
   */
  static badRequest(
    res: Response,
    error: string,
    message?: string
  ): Response<ApiResponse> {
    return this.error(res, error, 400, message);
  }

  /**
   * Send an unauthorized response (401)
   */
  static unauthorized(
    res: Response,
    error: string = 'Unauthorized',
    message?: string
  ): Response<ApiResponse> {
    return this.error(res, error, 401, message);
  }

  /**
   * Send a forbidden response (403)
   */
  static forbidden(
    res: Response,
    error: string = 'Forbidden',
    message?: string
  ): Response<ApiResponse> {
    return this.error(res, error, 403, message);
  }

  /**
   * Send a not found response (404)
   */
  static notFound(
    res: Response,
    error: string = 'Not found',
    message?: string
  ): Response<ApiResponse> {
    return this.error(res, error, 404, message);
  }

  /**
   * Send a conflict response (409)
   */
  static conflict(
    res: Response,
    error: string,
    message?: string
  ): Response<ApiResponse> {
    return this.error(res, error, 409, message);
  }

  /**
   * Send a validation error response (422)
   */
  static validationError(
    res: Response,
    errors: string | string[],
    message?: string
  ): Response<ApiResponse> {
    const errorString = Array.isArray(errors) ? errors.join(', ') : errors;
    return this.error(res, errorString, 422, message);
  }

  /**
   * Send an internal server error response (500)
   */
  static internalError(
    res: Response,
    error: string = 'Internal server error',
    message?: string
  ): Response<ApiResponse> {
    return this.error(res, error, 500, message);
  }
}

export default ResponseService;