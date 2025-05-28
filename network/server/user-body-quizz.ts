import type UserBodyQuizz from "../../models/user-body-quizz"
import { fetchData } from "../helpers/fetch-data"
import { ApiResponse, ListResponse } from "../../models/response"

export const getUserBodyQuizzesByUserId = async (id: string): Promise<ListResponse<UserBodyQuizz>> => {
    const response = await fetchData(`/v1/users/${id}/body-quizzes`)
    return await response.json()
}

export const getAllUserBodyQuizzes = async (): Promise<ListResponse<UserBodyQuizz>> => {
    const response = await fetchData(`/v1/users/body-quizzes`)
    return await response.json()
}
    
export const getUserBodyQuizzById = async (id: string): Promise<ApiResponse<UserBodyQuizz>> => {
    const response = await fetchData(`/v1/users/body-quizzes/${id}`)
    return await response.json()
}

export const updateUserBodyQuizz = async (id: string, userBodyQuizz: UserBodyQuizz): Promise<ApiResponse<UserBodyQuizz>> => {
    const response = await fetchData(`/v1/users/body-quizzes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userBodyQuizz),
    })
    return await response.json()
}
    
