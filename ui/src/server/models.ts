

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

export interface RockPaperScissorsGame {
    id: number;
    scoreToWin: number;
    player1: User;
    player2: User;
    leaderboard: Leaderboard;
    currentRound: Round;
}

export interface Leaderboard {
    rounds: Round[];
    player1Wins: number;
    player2Wins: number;
    winner: User;
}

export interface Round {
    player1Move: Move;
    player2Move: Move;
    result: RoundResult;
}

export enum Move {
    ROCK = 0,
    PAPER = 1,
    SCISSORS = 2
}

export enum RoundResult {
    ROCK = 0,
    PAPER = 1,
    SCISSORS = 2
}

export enum GameType {
    ROCK_PAPER_SCISSORS = 0,
}