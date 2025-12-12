export enum DifyAiApiHeader {
  X_INNER_API_KEY = 'x-inner-api-key',
}

export class InternalApiDifyAiHeaderDto {
  [DifyAiApiHeader.X_INNER_API_KEY]: string;

  constructor(xInnerApiKey: string) {
    this[DifyAiApiHeader.X_INNER_API_KEY] = xInnerApiKey;
  }
}
