import { discovery } from "openid-client";

let config: any;

export async function getOidcConfig() {
  if (config) {
    return config;
  }

  config = await discovery(
    new URL(process.env.AUTHENTIK_ISSUER!),
    process.env.AUTHENTIK_CLIENT_ID!,
    {
      client_secret:
        process.env.AUTHENTIK_CLIENT_SECRET!
    }
  );

  return config;
}