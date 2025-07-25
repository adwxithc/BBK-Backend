export interface IAdmin {
    _id: string;
    name: string;
    email: string;
    password: string;
    profile?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IMediaData {
    key: string;
    contentType: string;
    size: number;
}
export interface IEvent {
    _id?: string;
    title: string;
    description?: string;
    photos: IMediaData[];
    videos: IMediaData[];
    createdAt?: string;
    updatedAt?: string;
}

export interface MediaFile {
    contentType: string;
    size?: number;
}
