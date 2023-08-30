export interface Config {
  vault_id: string;
  gating_type: string;
  token_address: string;
  max_entries: number;
  token_threshold: number;
  akord_address: string;
}

export interface Member {
  evm_address: string;
  akord_address: string;
}

export interface Container {
  id: string;
  config: Config;
  controller_address: string;
  // epoch time
  creation_timestamp: number;
  members: Member[];
}

export interface MEMState {
  evm_molecule_endpoint: string;
  admin_address: string;
  users_counter: number;
  admin_counter: number;
  containers: Container[];
  signatures: string[];
}
