export const GARAGE_PAGE_SIZE = 7;
export const WINNERS_PAGE_SIZE = 10;

export const API_BASE_URL = 'http://localhost:3000';
export const GARAGE_ENDPOINT = `${API_BASE_URL}/garage`;
export const ENGINE_ENDPOINT = `${API_BASE_URL}/engine`;
export const WINNERS_ENDPOINT = `${API_BASE_URL}/winners`;

export const CAR_STATUS = {
  STOPPED: 'stopped',
  STARTED: 'started',
  DRIVING: 'driving',
  BROKEN: 'broken',
} as const;
