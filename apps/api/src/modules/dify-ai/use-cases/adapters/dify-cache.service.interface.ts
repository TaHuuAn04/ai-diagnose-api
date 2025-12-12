export interface IDifyCacheService {
  getDifyAccessToken(key: string): Promise<string | null>;
  saveDifyAccessToken(key: string, value: string): Promise<void>;
}
