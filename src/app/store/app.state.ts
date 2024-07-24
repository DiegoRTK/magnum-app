export interface InitialState {
  isAuthenticated: boolean;
  accountId: string | null;
  access_token: string | null;
  error: any | null;
  agentId: number;
  currentRoute?: number;
  subIndex?: number;
  role: RoleProps;
}

export interface AppStateProps {
  app: InitialState;
}

export interface RoleProps {
  roleId: number;
  roleName: string;
  description: string;
  createdAt: Date;
}

export interface UserState {
  accountId: number;
  agentId: number;
  email: string;
  resetPasswordToken: string;
  verificationTokenExpiration: Date;
  createdAt: Date;
  role: RoleProps;
  apiToken?: string;
}