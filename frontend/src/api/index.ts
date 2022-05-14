import { Dao, SignupReq, User } from "../dto";

export const getDao = async (name: string): Promise<Dao> => {
    return {
        id: "sporos",
        name: name
    }
}

export const getCurrentUser = async (): Promise<User> => {
    return {
        id: "test",
        username: "test"
    }
}

export const signup = async (data: SignupReq): Promise<User> => {
    return await getCurrentUser()
}

export const logout = async (): Promise<void> => {
    //
}

export const login = async (data: SignupReq): Promise<User> => {
    return await getCurrentUser()
}