'use server'

import type { Login, Register, TokenResponse } from "@/models/auth";
import { fetchData } from "../helpers/fetch-data";

export const login = async (data: Login): Promise<TokenResponse> => {
    const response = await fetchData("/v1/auth/token", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to login");
    }

    return response.json();
};

export const register = async (data: Register) => {
    const response = await fetchData("/v1/auth:signUp", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to register");
    }

    return response.json();
};

export const refreshToken = async (refresh_token: string): Promise<TokenResponse> => {
    const data: Login = {
        grant_type: "refresh_token",
        refresh_token,
        username: "",
        password: "",
    };

    const response = await fetchData("/v1/auth/token", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    return response.json();
};

export const getOauth2AuthUrl = async () => {
    const response = await fetchData(`/v1/auth/oauth2/google/auth-url`, {
        method: "GET",
    });

    return response.json();
};

export const handleGoogleCallback = async (code: string): Promise<TokenResponse> => {
    const response = await fetchData(`/v1/auth/oauth2/google:handleCallback?code=${encodeURIComponent(code)}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to handle Google callback");
    }

    return response.json();
};