type SessionPayload = {
  userId: string
  role: "admin" | "sub_admin" | "normal_user"
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

type Login = {
    username: string;
    password: string;
    grant_type: "password" | "refresh_token";
    refresh_token?: string;
    access_token?: string;
};

type Register = {
    username: string;
    password: string;
    fullname: string;
    phone_number: string;
};

type TokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
};

type Account = {
    id: string;
    name: string;
    phone_number: string;
    username: string;
    password: string;
}

type Oauth2AuthUrlResponse = {
    url: string;
};

export type { Login, Register, TokenResponse, Account, Oauth2AuthUrlResponse };

export type { SessionPayload }
