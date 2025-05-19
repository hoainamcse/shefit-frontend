import type BodyQuiz from "../../models/body-quiz"
import { fetchData } from "../helpers/fetch-data"
import { ListResponse } from "../../models/response"

export const getBodyQuiz = (): Promise<ListResponse<BodyQuiz>> => {
    return fetchData(`/v1/body-quizzes`)
        .then(response => response.json())
}
