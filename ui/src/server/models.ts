

export interface Session {
    id: string;
    type: string;
    owner: User;
    players: User[];
}

export interface User {
    id: number;
    username: string;
}