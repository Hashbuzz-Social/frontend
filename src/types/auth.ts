export type Payload = {
  url: string;
  data: {
    token: string;
  };
};

export type WCPayload = {
  id: string;
  message: string;
  timestamp: number;
};

export type WCChallange = {
  payload: WCPayload;
};

export type WCVerifyResponseBody = {
  originalPayload: WCPayload;
  signature: string;
  signingAccount: string;
};

export type Challenge = {
  payload: Payload;
  server: {
    signature: string;
    account: string;
  };
};

export type GenerateAstPayload = {
  payload: {
    url: string;
    data: any;
  };

  clientPayload: {
    serverSignature: string | Uint8Array;
    originalPayload: {
      url: string;
      data: any;
    };
  };
  signatures: {
    server: string;
    wallet: {
      accountId: string;
      value: string;
    };
  };
};

export type GnerateReseponse = {
  ast: string;
  deviceId: string;
  refreshToken: string;
  message: string;
  auth: true;
};
