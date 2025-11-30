export enum UserType {
    Standard = 'standard',
    Pro = 'pro'
}

export interface User {
    name: string;
    email: string;
    avatarUrl?: string;
    password: string;
    type: UserType;
}
