export const devBaseUrl = 'http://192.168.18.76:8000';
export const webSocketUrl = 'ws://192.168.18.76:8080';
export const prodBaseUrl = '';
export const baseAPIPath = '/api/v1';
export const baseUrl = (process.env.NODE_ENV === 'development' ? devBaseUrl : prodBaseUrl) + baseAPIPath;

export const USER_ACCESS_TOKEN_KEY = 'userAccessToken';
export const USER_REFRESH_TOKEN_KEY = 'userRefreshToken';

export const DEFAULT_LANGUAGE = 'en';

export const DEFAULT_ITEM_PER_PAGE = 10;

export const CALL_TYPE_INCOMING = 'INCOMING';
export const CALL_TYPE_QUEUED = 'QUEUED';

export const CALL_STATUS_PENDING = 'PENDING';
export const CALL_STATUS_ACCEPTED = 'ACCEPTED';
export const CALL_STATUS_REJECTED = 'REJECTED';
export const CALL_STATUS_NOT_RESPONDED = 'NOT-RESPONDED';
export const CALL_STATUS_IN_PROGRESS = 'IN_PROGRESS';
export const CALL_STATUS_ENDED = 'ENDED';

