// apiResponse.js
class ApiResponse {
  constructor(statusCode, data = null, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // True for 2xx and 3xx statuses
  }
}

export default ApiResponse;
