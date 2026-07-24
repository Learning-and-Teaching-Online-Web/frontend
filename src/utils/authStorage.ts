const TOKEN_KEY = 'access_token';
const AUTH_FLAG_KEY = 'isAuthenticated';
const ROLE_KEY = 'userRole';
const NAME_KEY = 'userName';

export const authStorage = {
  getToken: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  },

  getUserRole: (): string | null => {
    return sessionStorage.getItem(ROLE_KEY) || localStorage.getItem(ROLE_KEY);
  },

  getUserName: (): string | null => {
    return sessionStorage.getItem(NAME_KEY) || localStorage.getItem(NAME_KEY);
  },

  isAuthenticated: (): boolean => {
    const flag = sessionStorage.getItem(AUTH_FLAG_KEY) || localStorage.getItem(AUTH_FLAG_KEY);
    return flag === 'true';
  },

  setAuthSession: (token?: string | null, role?: string | null, name?: string | null) => {
    sessionStorage.setItem(AUTH_FLAG_KEY, 'true');
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    if (role) sessionStorage.setItem(ROLE_KEY, role);
    if (name) sessionStorage.setItem(NAME_KEY, name);

    // Clear legacy localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_FLAG_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
  },

  clearAuthSession: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(AUTH_FLAG_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem(NAME_KEY);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_FLAG_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
  }
};

export default authStorage;
