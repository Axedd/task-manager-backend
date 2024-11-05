import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface AuthUser extends RowDataPacket {
    id: number;
    username: string;
    password: string; 
}

export interface PublicUser extends RowDataPacket {
    id: number;
    username: string;
}

export interface DecodedToken {
    id: number;
    username: string;
    exp: number;
}

export default PublicUser;

