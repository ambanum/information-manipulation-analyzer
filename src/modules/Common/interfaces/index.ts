export interface CommonResponse {
  status: 'ok' | 'ko';
  message?: string;
}

export interface Hashtag {
  name: string;
  status: 'PENDING' | 'DONE';
}

export interface GetHashtagsResponse extends CommonResponse {
  hashtags: Hashtag[];
}

export interface CreateHashtagInput extends CommonResponse {
  name: string;
}
