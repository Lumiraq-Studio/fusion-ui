export interface CustomerFindDTO {
    id: number
    cRef: string
    fullName: string
    routeName: string
    shortName: string
    shopType: string
    status: string
    contact: string
}

export interface CustomerCreateDTO {
    id?: number
    fullName: string
    shortName: string
    address: string
    mobile: string
    routeId: string
    status: string
    createdBy?: number
    routeName?: string
    routeArea?: string
    cRef?: string

}

export interface CustomerGetDTO {
    id: number;
    cRef: string;
    fullName: string;
    shortName: string;
    address: string;
    mobile: string;
    status: string;
    routeId: number;
    routeName: string;
    routeArea: string;
}