// env.config.ts
import { InjectionToken } from "@angular/core";

export type EnvConfig = {
  apiUrl: string;
};

export const ENV_CONFIG = new InjectionToken<EnvConfig>('ENV_CONFIG', {
  factory: () => {

      if (!('envConfig' in window)) {
        throw new Error('No environment config found!');
      }

      const envConfig = window.envConfig;
      delete window.envConfig;

      return envConfig as EnvConfig;
  }
})