// typescript
import type { SignupData1 } from "../../screens/(auth)/RegisterScreen1";
import type { SignupData2 } from "../../screens/(auth)/RegisterScreen2";
import { registerUser } from "../../api/userApi";


type RegisterPayload = SignupData1 & SignupData2 & { password?: string };
type LoginPayload = { email: string; password: string };


//Function for the payload date conversion
function toIsoDate(dateStr: string): string {
  // dateStr: "10/10/2003" → "2003-10-10"
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
}


class AuthService {
  // Inscription
  private step1: SignupData1 | null = null;
  private step2: SignupData2 | null = null;
  private password: string = "";

  private jwtToken: string | null = null;

  setJwtToken(token: string | null) {
    this.jwtToken = token;
  }




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
    if (this.step1 && this.step2) {
      return { ...this.step1, ...this.step2, password: this.password || undefined };
    }
    return null;
  }

  // Soumission inscription (traditional payload -> backend route)
  async registerSubmit(userId: string | null = null) {
    console.log("entering registerSubmit");
    console.log("step1:", this.step1);
    console.log("step2:", this.step2);
    const payload = this.getRegisterPayload();
    if (!payload) return { ok: false, error: "Données incomplètes" };
    try {
      console.log("payload:", payload);
      // Build api payload expected by backend
      const apiPayload = {

          firstName: payload.firstName,
          lastName: payload.lastName,
        dateOfBirth: toIsoDate(payload.birthDate),
          phone: payload.phone,
          username: payload.username,
          address: payload.address,
          postalCode: payload.postalCode,
          country: payload.country,
          nationality: payload.nationality,
          userId: userId

      };

      console.log("test 123");

      let user;
      if (this.jwtToken) {
        const user = await registerUser(apiPayload as any, this.jwtToken);

      }
      else {
        const user = await registerUser(apiPayload as any);
      }

      console
.log("registered user:", user);
      return { ok: true, user };
    } catch (e: any) {
      return { ok: false, error: e?.response?.data ?? e?.message ?? String(e) };
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
    const profile = {
      firstName: this.step1.firstName,
      lastName: this.step1.lastName,
      birthDate: this.step1.birthDate,
      phone: this.step1.phone,
      username: this.step1.username,
      address: this.step2.address,
      postalCode: this.step2.postalCode,
      country: this.step2.country,
      nationality: this.step2.nationality,

    };

    const payload = {
      profile,
      keycloak: {
        accessToken: tokens.accessToken ?? null,
        idToken: tokens.idToken ?? null,
      },
    };

    try {
      const user = await registerUser(payload as any);
      return { ok: true, user };
    } catch (e: any) {
      return { ok: false, error: e?.response?.data ?? e?.message ?? String(e) };
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

  // Soumission connexion (reste inchangé / non développé ici)
  async loginSubmit() {
    const payload = this.getLoginPayload();
    if (!payload) return { ok: false, error: "Données incomplètes" };
    try {
      // TODO: appeler l'API de login backend si nécessaire
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