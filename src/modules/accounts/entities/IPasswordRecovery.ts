export interface IPasswordRecovery {
  id: string;
  account_id: string;
  expires_at: Date;
  created_at: Date;
}
