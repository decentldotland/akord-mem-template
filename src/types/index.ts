export enum GatingType {
  ERC20 = "erc20",
  ERC721 = "erc721",
}

export interface AkordContainerConfig {
  vault_id: string;
  gating_type: GatingType;
  token_address: string;
  max_entries: number;
  token_threshold: number;
  akord_address: string;
}

export interface createContainerArgs extends AkordContainerConfig {}

export interface JoinContainerConfig {
  akord_address: string;
  container_id?: string;
  vault_id?: string;
}

export type AkordContainerConfigKeys = keyof AkordContainerConfig;
export type JoinContainerConfigKeys = keyof JoinContainerConfig;

export interface Member {
  evm_address: string;
  akord_address: string;
}

export interface Container {
  id: string;
  config: AkordContainerConfig;
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
