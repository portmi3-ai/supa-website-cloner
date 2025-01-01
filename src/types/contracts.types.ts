export type ContractStatus = 'draft' | 'pending' | 'active' | 'completed' | 'cancelled';

export interface Contract {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  contract_number: string | null;
  status: ContractStatus;
  value: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}