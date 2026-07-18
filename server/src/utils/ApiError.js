class ApiError extends Error {
  constructor(statusCode, message = "An API error occurred", errors = []) {
    super(message); // Calls the parent Error constructor

    this.statusCode = statusCode; // e.g., 400, 404, 500
    this.errors = errors;         // For specific validation details
    this.success = false;         // Helper flag for frontend clients

    // Captures the exact line where the error happened
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
