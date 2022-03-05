import { execAsync } from './getCreationTime';

export async function execAsyncWithRetry(command: string) {
  let lastError: any;
  for (let retry = 1; retry <= 3; retry++) {
    try {
      return await execAsync(command);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
