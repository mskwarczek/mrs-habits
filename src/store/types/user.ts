export interface IUserTemplate {
  uid?: string;
  goals?: string[];
  habits?: string[];
}

export interface IUser extends IUserTemplate {
  uid: string;
  goals?: string[];
  habits?: string[];
}
