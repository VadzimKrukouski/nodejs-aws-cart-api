import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  return '123e4567-e89b-12d3-a456-426614174001'
}

export function getOrderIdFromRequest(request: AppRequest): string {
  return '123e4567-e89b-12d3-a456-426614174009'
}

