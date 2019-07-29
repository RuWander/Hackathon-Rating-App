export interface Event {
  id?: string;
  title: string;
  date: any;
  description: string;
  groups?: Group[];
  criteria?: Criteria[];
}

export interface Group {
  id?: string;
  description?: string;
  members?: string[];
  name: string;
  criteria?: Criteria[];
}

export interface User {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
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
  value: number;
  votes: number;
  criteria?: string;
}

export interface VoteDocument {
  id?: string;
  eventId: string;
  groupId: string;
  userId: string;
  votes: Vote[];
}

export interface Vote {
  name?: string;
  criteriaId: string;
  value: number;
}
