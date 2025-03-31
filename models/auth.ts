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

export type { Login, Register, TokenResponse };
