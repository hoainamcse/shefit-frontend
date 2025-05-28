import { fetchData } from "../helpers/fetch-data";

export const generateQrToken = async () => {
    const username = process.env.NEXT_PUBLIC_VIETQR_HOST_USERNAME;
    const password = process.env.NEXT_PUBLIC_VIETQR_HOST_PASSWORD;

    const response = await fetchData("/v1/vietqr/generate-qr-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to generate QR token");
    }

    return response.json();
};

export const createQr = async (accessToken: string, amount: number, orderId: string, content: string) => {
    const response = await fetchData("/v1/vietqr/create-qr", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amount,
            content,
            order_id: orderId
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to create QR");
    }

    return response.json();
};

export const generateToken = async (qrToken: string) => {
    const username = "shefit-vietqr";
    const password = "IlhtYFpFkh1ztl2hkJXuRgTpr+Ef9BZbL9Z9oYXk";

    const response = await fetchData("/v1/vietqr/api/token_generate", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrToken }),
    });

    if (!response.ok) {
        throw new Error("Failed to generate token");
    }

    return response.json();
};

export const syncTransaction = async (accessToken: string, orderId: string = "string", content: string = "string") => {
    const response = await fetchData("/v1/vietqr/bank/api/transaction-sync", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            bankaccount: "string",
            amount: 0,
            transType: "string",
            content: content,
            orderId: orderId
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to sync transaction");
    }

    return response.json();
};