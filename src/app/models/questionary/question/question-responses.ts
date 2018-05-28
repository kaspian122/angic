export interface QuestionResponse {
  freeAnswer?: string,
  questionId: string,
  questionOptionIds: string[],
  required: boolean
}

export interface QuestionResponses {
  responses: QuestionResponse[]
}