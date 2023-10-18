import { IUserPoints } from '../models/userPoints';


export interface IupdateScoreReq{
    userPoints: Partial<IUserPoints>;
}
export interface IresetScoreReq{
    userPoints: Partial<IUserPoints>;
}
export interface IregisterReq {
  username: string;
  password: string;
  userPoints: object;
}
export interface IloginReq {
  username: string;
  password: string;
}
export interface IlogoutReq {
  username: string;
}
export interface IgameStartReq {
  IDPlaying: string;
  IDAdmin: string;
  nuberCardAutobahn: number;
}
export interface IgameEndReq {
  gameID: number;
  IDPlaying: string;
  IDAdmin: string;
  endTime: string;
  nuberCardAutobahn: number;
  userPoints: IUserPoints;
}

