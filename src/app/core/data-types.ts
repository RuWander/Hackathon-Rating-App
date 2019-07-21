
export interface Event {
  id?: string;
  title: string;
  date: any;
  description: string;
  groups?: Group[];
  criteria?: Criteria[];
}

export interface Group {
  id: string;
  description: string;
  members: string[];
  name: string;
  criteria?: Criteria[];
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
