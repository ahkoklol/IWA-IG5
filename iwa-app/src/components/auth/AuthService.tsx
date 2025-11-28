import type { SignupData1 } from "../../screens/(auth)/RegisterScreen1";
import type { SignupData2 } from "../../screens/(auth)/RegisterScreen2";

type RegisterPayload = SignupData1 & SignupData2 & { password: string };
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
    // Not getting the password for security reasons
    // getRegisterPassword() {
    //     return this.password;
    // }
    getRegisterPayload(): RegisterPayload | null {
        if (this.step1 && this.step2 && this.password) {
            return { ...this.step1, ...this.step2, password: this.password };
        }
        return null;
    }

    // Soumission inscription
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
    // Not getting the password for security reasons
    // getLoginPassword() {
    //     return this.loginPassword;
    // }
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