import { GatingType, JoinContainerConfig, createContainerArgs } from "@/types";

// TODO get new contract
export const functionId = "bICP3RVVlAxY1Tama2yiT2kXj1Z8kWJvJFV39oiadYE";

export const userMessage = "akord-mem::";
export const adminMessage = "akord-admin-mem::";

export const emptyCreateContainerConfig: createContainerArgs = {
  vault_id: "1",
  gating_type: GatingType.ERC20,
  token_address: "",
  max_entries: 100,
  token_threshold: 1,
  akord_address: "",
};

export const emptyJoinContainerConfig: JoinContainerConfig = {
  akord_address: "",
  container_id: "",
  vault_id: "",
};

export const MockMEMState = {
  evm_molecule_endpoint: "http://evm.molecule.sh",
  admin_address: "0x197f818c1313dc58b32d88078ecdfb40ea822614",
  users_counter: 0,
  admin_counter: 0,
  containers: [],
  signatures: [],
  publicFunctions: {
    createContainer: ["config", "caller", "user_sig", "admin_sig"],
    joinContainer: [
      "caller",
      "akord_address",
      "user_sig",
      "admin_sig",
      "container_id",
      "vault_id",
    ],
  },
};
