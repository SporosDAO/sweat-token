

export interface User {
    id: string
    username: string
}

export interface SignupReq {
    key: string
    username: string
}

export interface Dao {
    name: string
    id: string
    contract?: string
}