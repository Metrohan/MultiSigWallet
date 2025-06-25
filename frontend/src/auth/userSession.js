// src/auth/userSession.js
import { UserSession, AppConfig } from '@stacks/auth';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });
