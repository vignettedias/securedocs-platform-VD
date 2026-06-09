import { getOidcConfig } from "./oidc";

export async function testDiscovery() {
  const config = await getOidcConfig();

  return {
    issuer:
      config.serverMetadata().issuer
  };
}