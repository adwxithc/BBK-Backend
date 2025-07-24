export interface IAdmin {
    name: string;
    email: string;
    password: string;
    profile?:string;
    createdAt?: string;
    updatedAt?: string;
}


export interface MediaFile {
    contentType: string;
    size?: number;
}