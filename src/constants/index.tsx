// EDIT ME
export const functionId = "ucmuajHVQF4-3jr4f0VIxeJuZ-YSaY23d9PDMQAjJwk";

export const userMessage = "akord-mem::";
export const adminMessage = "akord-mem::";

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
