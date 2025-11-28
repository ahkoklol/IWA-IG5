

const config = {
  issuer: `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/auth/realms/${process.env.EXPO_PUBLIC_KEYCLOAK_REALM}`,
  clientId: `${process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID}`,
  redirectUrl: 'com.yourapp://oauthredirect', // see below
  scopes: ['openid', 'profile'],
  additionalParameters: {},
};

export default config;