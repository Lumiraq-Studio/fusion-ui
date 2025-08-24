export interface PaginatedRoutesDTO {
    id: number
    area: string
    name: string
    shopCount?: number
}

export interface FindRoutesDTO {
    id: number
    area: string
    name: string
}

export interface RouteCreateDTO {
    area: string
    name: string
}
