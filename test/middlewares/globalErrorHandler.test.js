const rewire = require('rewire');
const AppError = require('../../src/utils/appError');
let globalErrorHandler;

describe('globalErrorHandler tests', () => {
  beforeEach(() => {
    globalErrorHandler = rewire('../../src/middlewares/globalErrorHandler');
  });

  afterEach(() => {
    jest.clearAllMocks();
    globalErrorHandler = undefined;
  });

  describe('handleCastErrorDB', () => {
    it('should return an AppError with the correct properties', () => {
      // Arrange
      const err = {
        path: 'Example Path',
        value: 'Example Value',
      };

      const handleCastErrorDB = globalErrorHandler.__get__('handleCastErrorDB');
  
      // Act
      const result = handleCastErrorDB(err);
  
      // Assert
      expect(result.statusCode).toBe(400);
      expect(result.code).toBe('ERR-400');
      expect(result.details).toBe(`Invalid ${err.path}: ${err.value}.`);
      expect(result.message).toBe('The request contains malformed data in parameters.');
    });
  });

  describe('handleDuplicateFieldsDB', () => {
    it('should return an AppError with the correct properties', () => {
      // Arrange
      const err = {
        errmsg: 'E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "admin@admin.com" }',
      };

      const handleDuplicateFieldsDB = globalErrorHandler.__get__('handleDuplicateFieldsDB');
  
      // Act
      const result = handleDuplicateFieldsDB(err);
  
      // Assert
      expect(result.statusCode).toBe(400);
      expect(result.code).toBe('ERR-400');
      expect(result.details).toBe(`Duplicate field value: \"admin@admin.com\". Please use another value.`);
      expect(result.message).toBe('The request contains malformed data in parameters.');
    });
  });

  describe('handleValidationErrorDB', () => {
    it('should return an AppError with the correct properties', () => {
      // Arrange
      const err = {
        errors: {
          field1: { message: 'Error message 1' },
          field2: { message: 'Error message 2' },
        },
      };

      const handleValidationErrorDB = globalErrorHandler.__get__('handleValidationErrorDB');
  
      // Act
      const result = handleValidationErrorDB(err);
  
      // Assert
      expect(result.statusCode).toBe(400);
      expect(result.code).toBe('ERR-400');
      expect(result.details).toBe(`Invalid input data, Error message 1. Error message 2`);
      expect(result.message).toBe('The request contains malformed data in parameters.');
    });
  });

  describe('handleJWTError', () => {
    it('should return an AppError with the correct properties', () => {
      // Arrange
      const handleJWTError = globalErrorHandler.__get__('handleJWTError');
  
      // Act
      const result = handleJWTError();
  
      // Assert
      expect(result.statusCode).toBe(401);
      expect(result.code).toBe('ERR-401');
      expect(result.message).toBe('Unauthorized.');
    });
  });

  describe('handleJWTExpiredError', () => {
    it('should return an AppError with the correct properties', () => {
      // Arrange
      const handleJWTExpiredError = globalErrorHandler.__get__('handleJWTExpiredError');
  
      // Act
      const result = handleJWTExpiredError();
  
      // Assert
      expect(result.statusCode).toBe(401);
      expect(result.code).toBe('ERR-401');
      expect(result.message).toBe('Unauthorized.');
    });
  });

  describe('sendErrorDev', () => {
    it('should send the error response in development environment', () => {
      // Arrange
      const err = {
        statusCode: 500,
        status: 'error',
        message: 'Internal Server Error.',
        stack: 'example stack trace',
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const sendErrorDev = globalErrorHandler.__get__('sendErrorDev');

      // Act
      sendErrorDev(err,res);
  
      // Assert
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(err.statusCode);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        code: err.statusCode,
        status: err.status,
        error: err,
        message: err.message,
        details: err.message,
        stack: err.stack,
      });
    });
  });

  describe('sendErrorProd', () => {
    it('should send the operational error response', () => {
      // Arrange
      const err = {
        isOperational: true,
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Resource not found',
        details: 'The requested resource could not be found',
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const sendErrorProd = globalErrorHandler.__get__('sendErrorProd');

      // Act
      sendErrorProd(err, res);

      // Assert
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(err.statusCode);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        code: err.code,
        message: err.message,
        details: err.details,
      });
    });

    it('should send the generic error response for non-operational errors', () => {
      // Arrange
      const err = {
        isOperational: false,
        code: 'INTERNAL_SERVER_ERROR',
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      const sendErrorProd = globalErrorHandler.__get__('sendErrorProd');

      // Act
      sendErrorProd(err, res);
  
      // Assert
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        code: err.code,
        message: 'Something went very wrong!',
        details: 'There was a problem processing your request. Please try again later.',
      });
    });
  });
});
