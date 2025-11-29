import type { SignupData1 } from "../../screens/(auth)/RegisterScreen1";
import type { SignupData2 } from "../../screens/(auth)/RegisterScreen2";

type RegisterPayload = SignupData1 & SignupData2 & { password?: string };
type LoginPayload = { email: string; password: string };

class AuthService {
  // Inscription
  private step1: SignupData1 | null = null;
  private step2: SignupData2 | null = null;
  private password: string = "";

  // Connexion
  private loginEmail: string = "";
  private loginPassword: string = "";

  // Setters pour inscription
  setRegisterStep1(data: SignupData1) {
    this.step1 = data;
  }
  setRegisterStep2(data: SignupData2) {
    this.step2 = data;
  }
  setRegisterPassword(pwd: string) {
    this.password = pwd;
  }

  // Getters pour inscription
  getRegisterStep1() {
    return this.step1;
  }
  getRegisterStep2() {
    return this.step2;
  }
  getRegisterPayload(): RegisterPayload | null {
    if (this.step1 && this.step2 && this.password) {
      return { ...this.step1, ...this.step2, password: this.password };
    }
    return null;
  }

  // Soumission inscription (traditional payload)
  async registerSubmit() {
    const payload = this.getRegisterPayload();
    if (!payload) return { ok: false, error: "Données incomplètes" };
    try {
      // await api.post("/signup", payload);
      console.log("Register submit", payload);
      this.clearRegister();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  // New: register with Keycloak tokens + stored steps
  // tokens: may contain `accessToken` and/or `idToken`. Backend should validate tokens / fetch userinfo.
  async registerSubmitWithKeycloakTokens(tokens: {
    accessToken?: string | null;
    idToken?: string | null;
  }) {
    if (!this.step1 || !this.step2) {
      return {
        ok: false,
        error: "Données d'inscription manquantes (étape 1/2)",
      };
    }

    // Build a payload that backend can use to create the profile.
    // Important: Do NOT trust any client-side email — backend should validate email using Keycloak tokens.
    const payload = {
      profile: {
        ...this.step1,
        // note: email from step1 is not authoritative; backend should use Keycloak userinfo
        email: this.step1.email ?? "",
        ...this.step2,
      },
      keycloak: {
        id_token: tokens.idToken ?? null,
        access_token: tokens.accessToken ?? null,
      },
    };

    try {
      // TODO: call your backend endpoint to create the user profile using Keycloak tokens
      // Example (pseudo): await api.post("/auth/register-with-keycloak", payload)
      // Backend should verify the id_token/access_token, extract the official email and sub (id_user),
      // then create the user profile in your DB linking to Keycloak identity.
      console.log("registerSubmitWithKeycloakTokens: payload ->", payload);

      // For now we simulate success:
      this.clearRegister();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  clearRegister() {
    this.step1 = null;
    this.step2 = null;
    this.password = "";
  }

  // Setters pour connexion
  setLoginEmail(email: string) {
    this.loginEmail = email;
  }
  setLoginPassword(pwd: string) {
    this.loginPassword = pwd;
  }

  // Getters pour connexion
  getLoginEmail() {
    return this.loginEmail;
  }
  getLoginPayload(): LoginPayload | null {
    if (this.loginEmail && this.loginPassword) {
      return { email: this.loginEmail, password: this.loginPassword };
    }
    return null;
  }

  // Soumission connexion
  async loginSubmit() {
    const payload = this.getLoginPayload();
    if (!payload) return { ok: false, error: "Données incomplètes" };
    try {
      // await api.post("/login", payload);
      console.log("Login submit", payload);
      this.clearLogin();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  clearLogin() {
    this.setLoginEmail("");
    this.setLoginPassword("");
  }
}

export default new AuthService();
