import axios from "axios";
import { toast } from "react-hot-toast";

import { functionId } from "@/constants";
import { checkUserHoldings } from "./moralis";
import { AkordContainerConfig, MEMState } from "../types";

export async function readMEM() {
  const request = await axios.get("/api/mem/read", {
    params: { functionId },
  });
  return request.data;
}

export async function writeMEM(input: Record<any, any>, suppressError = false) {
  try {
    const request = await axios.post("/api/mem/write", {
      functionId,
      inputs: [{ input }],
    });
    const { state, errors } = request.data;
    const errorCount = Object.keys(errors).length;
    if (!errorCount) return state as MEMState;
    else {
      let textErrors = "";
      Object.values(errors).map((error) => (textErrors += error + "\n"));
      throw new Error(textErrors);
    }
  } catch (e: any) {
    if (!suppressError) toast.error(e.message, { duration: 3000 });
    return undefined;
  }
}

/**
 * @typedef {Object} MEMState
 * CreateContainer function from MEM
 * (https://gist.github.com/charmful0x/7908734530a8551c11b02e0b553abbd3#file-akord-js-L4)
 *
 * @param caller User Eth address
 * @param config Akord Config Object, <a href="../types">see ../types/index.ts For More Info</a>
 * @param user_sig Eth User Signature, Use <a href="./signature">createSignature</a> Helper Method
 * @param admin_sig Eth Admin Signature, Use <a href="./signature">createSignature</a> Helper Method
 * @returns {MEMState}
 */

export async function createContainer(
  caller: string,
  config: AkordContainerConfig,
  user_sig: string,
  admin_sig: string
) {
  let updatedConfig = { ...config };
  // typecast to Number
  updatedConfig["max_entries"] = Number(updatedConfig["max_entries"]);
  const payload = {
    function: "createContainer",
    caller,
    config: updatedConfig,
    user_sig,
    admin_sig,
  };

  // ! This is a temp fix so that the interactions get to MEM
  await writeMEM(payload, true);
  const request: MEMState | undefined = await writeMEM(payload);
  return request;
}

/**
 * @typedef {Object} MEMState
 * CreateContainer function from MEM
 * (https://gist.github.com/charmful0x/7908734530a8551c11b02e0b553abbd3#file-akord-js-L4)
 *
 * @param caller User Eth address
 * @param akord_address Akord address
 * @param user_sig Eth User Signature, Use <a href="./signature">createSignature</a> Helper Method
 * @param admin_sig Eth Admin Signature, Use <a href="./signature">createSignature</a> Helper Method
 * @param container_id Akord's Container ID
 * @param vault_id Akord's Vault ID
 * @returns {MEMState}
 */

export async function joinContainer(
  caller: string,
  token_address: string,
  token_threshold: number,
  akord_address: string,
  user_sig: string,
  admin_sig: string,
  container_id: string,
  vault_id: string
) {
  const payload = {
    function: "joinContainer",
    caller,
    token_address,
    token_threshold,
    akord_address,
    user_sig,
    admin_sig,
    container_id,
    vault_id,
  };

  // validate user holdings
  const tokenCount = await checkUserHoldings(caller, [token_address]);
  if (tokenCount < token_threshold) {
    console.log("Token Threshold Not Met");
    return;
  }

  // ! This is a temp fix so that the interactions get to MEM
  await writeMEM(payload, true);
  const request: MEMState | undefined = await writeMEM(payload);
  return request;
}

export async function updateAdmin(
  caller: string,
  admin_sig: string,
  new_admin_address: string
) {
  const payload = {
    function: "changeAdminAddress",
    caller,
    admin_sig,
    new_admin_address,
  };

  const request: MEMState | undefined = await writeMEM(payload);

  return request;
}
