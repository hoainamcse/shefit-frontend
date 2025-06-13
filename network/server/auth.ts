'use server'

import type { Login, Register, TokenResponse } from "@/models/auth";
import { fetchData } from "../helpers/fetch-data";
import { decodeJwt } from "jose";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";

export const login = async (data: Login): Promise<TokenResponse> => {
    const response = await fetchData("/v1/auth/token", {
        method: "POST",
        body: JSON.stringify(data),
    });
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
    const data: any = {
        grant_type: "refresh_token",
        refresh_token,
        // username: "",
        // password: "",
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

export const getOauth2AuthUrl = async (redirect_uri: string) => {
    const response = await fetchData(`/v1/auth/oauth2/google/auth-url?redirect_uri=${redirect_uri}`, {
        method: "GET",
    });

    return response.json();
};

export const handleGoogleCallback = async (params: string): Promise<any> => {
    const response = await fetchData(`/v1/auth/oauth2/google:handleCallback?provider=google&${params}`, {
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

export const changePassword = async (data: any): Promise<any> => {
    const response = await fetchData("/v1/auth:changePassword", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to change password");
    }

    return response.json();
};

export async function signin(data: any) {
  const jwt = decodeJwt(data.access_token)
  const userId = jwt.sub as string
  const role = Array.isArray(jwt.scopes) && jwt.scopes.length > 0 ? jwt.scopes[0] : 'user'
  await createSession({
    userId,
    role: role === 'user' ? 'normal_user' : role,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  })
  return { userId, scope: role }
}

export async function signout() {
  await deleteSession()
  redirect('/auth/login')
}
