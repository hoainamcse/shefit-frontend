import type UserBodyQuizz from "../../models/user-body-quizz"
import { fetchData } from "../helpers/fetch-data"
import { ListResponse } from "../../models/response"

export const getUserBodyQuizzesByUserId = async (id: string): Promise<ListResponse<UserBodyQuizz>> => {
    const response = await fetchData(`/v1/users/${id}/body-quizzes`)
    return await response.json()
}
