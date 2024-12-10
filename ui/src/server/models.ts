

export interface Session {
    id: string;
    type: string;
    owner: Player;
    players: Player[];
}

export interface Player {
    id: number;
    username: string;
}