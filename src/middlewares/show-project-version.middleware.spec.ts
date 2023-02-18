import { NextFunction, Request, Response } from 'express';
import showProjectVersion from './show-project-version.middleware';

describe('Show project version middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();
  const version = '1.0.0';
  const templateVersion = '0.0.1';

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(), // This line
      send: jest.fn(), // also mocking for send function
      json: jest.fn(),
      header: jest.fn().mockReturnThis(),
    };
  });

  it('should to show project version in response header', async () => {
    await showProjectVersion(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
      version,
      templateVersion,
    );

    expect(mockResponse.header).toHaveBeenCalledWith(
      'X-Project-Version',
      '1.0.0',
    );
    expect(mockResponse.header).toHaveBeenCalledWith(
      'X-Project-Template-Version',
      '0.0.1',
    );
    expect(nextFunction).toHaveBeenCalled();
  });
});
