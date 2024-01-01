import {BaseResponseType, LoginRequest, urlCaptcha} from "types/typesAPI";
import {instance} from "common/api";


export const authAPI = {
    login(modelData: LoginRequest) {
        return instance.post<BaseResponseType<{ userId: number }>>("auth/login", modelData)
    },
    logout() {
        return instance.delete<BaseResponseType>("auth/login")
    },
    statusLogin(){
        return instance.get<BaseResponseType<{id: number, email: string, login: string}>>("auth/me")
    },
    getCaptcha(){
        return instance.get<urlCaptcha>("security/get-captcha-url")
    }
}
