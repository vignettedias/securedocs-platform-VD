import {
  buildAuthorizationUrl,
  randomState,
  authorizationCodeGrant,
} from "openid-client";

import { getOidcConfig } from "./oidc";

export async function createLoginUrl() {
  const config = await getOidcConfig();

  const state = randomState();

  const authorizationUrl =
    buildAuthorizationUrl(config, {
      redirect_uri:
        process.env.AUTHENTIK_REDIRECT_URI!,
      scope: "openid profile email",
      state
    });

  const browserUrl =
    authorizationUrl
      .toString()
      .replace(
        "securedocs-authentik-server:9000",
        "localhost:9000"
      );

  return {
    state,
    authorizationUrl: browserUrl
  };
}

export async function exchangeCode(
  callbackUrl: string,
  state: string
) {
  const config = await getOidcConfig();

  const tokens =
    await authorizationCodeGrant(
      config,
      new URL(callbackUrl),
      {
        expectedState: state
      }
    );

  return tokens;
}