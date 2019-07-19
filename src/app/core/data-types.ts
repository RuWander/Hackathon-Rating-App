
export interface Event {
  id?: string;
  title: string;
  date: Date;
  description: string;
}

export interface Group {
  id: string;
  description: string;
  members: string[];
  name: string;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  roles: string[];
}
// TODO: use this interface in the auth service instead of the locally declared one
export interface AuthUser {
  id: string;
  email: string;
}

export interface Criteria {
  id?: string;
  eventsUsed?: string[];
  name: string;
  start: number;
  end: number;
}
