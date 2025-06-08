import { fetchData } from "../helpers/fetch-data";

export const SendOTP = async (email: string) => {
    const response = await fetchData("/v1/email/send-otp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error("Failed to send OTP");
    }

    return response.json();
}

export const VerifyOTP = async (email: string, otp: string, counter: number) => {
    const response = await fetchData("/v1/email/verify-otp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, counter }),
    });

    if (!response.ok) {
        throw new Error("Failed to verify OTP");
    }

    return response.json();
}

