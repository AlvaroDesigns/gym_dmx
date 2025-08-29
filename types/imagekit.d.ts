declare module 'imagekit' {
  export interface ImageKitOptions {
    publicKey: string;
    privateKey: string;
    urlEndpoint: string;
  }

  export interface AuthenticationParameters {
    token: string;
    expire: number;
    signature: string;
  }

  export default class ImageKit {
    constructor(options: ImageKitOptions);
    getAuthenticationParameters(options?: {
      token?: string;
      expire?: number;
    }): AuthenticationParameters;
  }
}
