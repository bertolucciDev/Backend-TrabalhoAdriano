export abstract class DBHealthRepository {
  abstract checkConnection(): Promise<boolean>;
}
