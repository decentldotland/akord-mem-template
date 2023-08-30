import axios from "axios";

import { functionId } from "@/constants";
import { Config, MEMState } from "../types";

export async function readMEM() {
  const request = await axios.get("/api/mem/read", {
    params: { functionId },
  });
  return request.data;
}

export async function writeMEM(input: Record<any, any>) {
  try {
    const request = await axios.post("/api/mem/write", {
      functionId,
      inputs: [{ input }],
    });
    return request.data as MEMState;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function createContainer(
  caller: string,
  config: Config,
  user_sig: string,
  admin_sig: string
) {
  const payload = {
    function: "createContainer",
    caller,
    config,
    user_sig,
    admin_sig,
  };

  const request: MEMState | undefined = await writeMEM(payload);
  return request;
}

export async function joinContainer(
  caller: string,
  akord_address: string,
  user_sig: string,
  admin_sig: string,
  container_id: string,
  vault_id: string
) {
  const payload = {
    function: "joinCointainer",
    caller,
    akord_address,
    user_sig,
    admin_sig,
    container_id,
    vault_id,
  };

  const request: MEMState | undefined = await writeMEM(payload);
  return request;
}
