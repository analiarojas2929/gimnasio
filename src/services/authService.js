const SESSION_KEY = "fitzone-demo-session";
const PROFILE_KEY = "fitzone-demo-profile";

function readProfile() {
  try {
    const stored = window.localStorage.getItem(PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("No se pudo leer el perfil de demostración.", error);
    return null;
  }
}

function saveProfile(profile) {
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("No se pudo guardar el perfil de demostración.", error);
  }
}

export const authService = {
  async signIn({ email, name }) {
    const profile = readProfile();
    const session = {
      email,
      name: name || (profile?.email === email ? profile.name : "Usuario demo"),
    };
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async register({ name, email }) {
    const profile = {
      ...readProfile(),
      name,
      email,
    };
    saveProfile(profile);
    return this.signIn({ email, name });
  },

  async signOut() {
    window.sessionStorage.removeItem(SESSION_KEY);
  },

  async updateProfile(profile) {
    saveProfile(profile);
    window.sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ email: profile.email, name: profile.name }),
    );
    return profile;
  },

  getCurrentUser() {
    try {
      const session = window.sessionStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error("No se pudo leer la sesión de demostración.", error);
      return null;
    }
  },
};
