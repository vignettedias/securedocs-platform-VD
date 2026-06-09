import { getOidcConfig } from "./oidc";

export async function testDiscovery() {
  return await getOidcConfig();
}