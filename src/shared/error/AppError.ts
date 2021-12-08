class AppError {
  public readonly message: string;
  public readonly data?: unknown;
  public readonly statusCode: number;

  constructor(message: string, data?: unknown, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export default AppError;
