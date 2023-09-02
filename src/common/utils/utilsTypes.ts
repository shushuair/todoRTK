export type BaseResponse<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
}

export type AxiosError = { messages: string[] }