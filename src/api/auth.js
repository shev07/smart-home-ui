import { apiRequest } from "./client";
import { demoUsers } from "../mock/auth";

const TOKEN_KEY = "token";
const USER_KEY = "auth_user";

const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const createDemoToken = (username) => `demo-token-${username}`;

const findDemoUser = ({ username, phone }) =>
  demoUsers.find((user) => {
    const matchUsername = username ? user.username === username.trim() : true;
    const matchPhone = phone ? user.phone === phone.trim() : true;
    return matchUsername && matchPhone;
  });

export const loginUser = async ({ username, password }) => {
  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { username, password }
    });

    const token = data?.token || createDemoToken(username);
    const user = data?.user || { username };
    saveSession(token, user);

    return { data, fallback: false };
  } catch (error) {
    const user = findDemoUser({ username });

    if (!user || user.password !== password) {
      throw new Error("Invalid username or password.");
    }

    saveSession(createDemoToken(user.username), {
      username: user.username,
      fullName: user.fullName,
      phone: user.phone
    });

    return {
      data: { token: createDemoToken(user.username), user },
      fallback: true,
      error
    };
  }
};

export const recoverPassword = async ({ username, phone }) => {
  try {
    const data = await apiRequest("/auth/forgot-password", {
      method: "POST",
      body: { username, phone }
    });

    return { data, fallback: false };
  } catch (error) {
    const user = findDemoUser({ username, phone });

    if (!user) {
      throw new Error("Username and phone number do not match any account.");
    }

    return {
      data: {
        password: user.password,
        message: "Demo mode only. Do not return plaintext passwords in production."
      },
      fallback: true,
      error
    };
  }
};

export const logoutUser = () => {
  clearSession();
};

export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    clearSession();
    return null;
  }
};

export const isAuthenticated = () => Boolean(localStorage.getItem(TOKEN_KEY));
