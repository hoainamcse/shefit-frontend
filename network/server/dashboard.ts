import { ApiResponse } from "@/models/response"
import { fetchData } from "../helpers/fetch-data"
import { Dashboard } from "@/models/dashboard"

export async function getDashboard(token: string): Promise<ApiResponse<Dashboard>> {
    const response = await fetchData("/v1/sub_admin/count", {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 0, tags: ["dashboard"] }
    })
    return await response.json()
}
