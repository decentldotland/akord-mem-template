import { Akord } from "@akord/akord-js";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";

import { MockMEMState, adminMessage, userMessage } from "@/constants";
import { AkordContainerConfig, MEMState } from "@/types";
import {
  createContainer,
  joinContainer,
  readMEM,
  updateAdmin,
} from "@/helpers";
import { createSignature, requestAdminSignature } from "@/helpers/signature";
import {
  getContainerIndexById,
  getContainerIndexByVaultId,
} from "@/helpers/state";

import AkordActions from "@/components/akordActions";
import AkordSignIn from "@/components/akordSignIn";
import CodeLinks from "@/components/codelinks";
import CodePreview from "@/components/codepreview";
import Guide from "@/components/guide";

const ConnectButton = dynamic(() =>
  import("@rainbow-me/rainbowkit").then((mod) => mod.ConnectButton)
);

export default function Home() {
  const [akord, setAkord] = useState<Akord>();
  const { address: ethAddress } = useAccount();

  // state and handlers
  const [state, setState] = useState<MEMState>();
  const [stateInit, setStateInit] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | undefined>();

  // create new akord container
  async function handleCreateContainer(config: AkordContainerConfig) {
    setStatusMessage(undefined);
    if (!ethAddress) return;

    let user_signature = "";
    let admin_signature = "";

    // generate user signatures
    try {
      user_signature = await createSignature(
        `${userMessage}${state?.users_counter || 0}`
      );
      admin_signature = await requestAdminSignature(
        `${adminMessage}${state?.admin_counter || 0}`
      );
    } catch (e) {
      toast.error("Signature generation failed", { duration: 3000 });
      return;
    }

    // call the createContainer helper function directly connected to MEM
    const newMEMState = await createContainer(
      ethAddress,
      config,
      user_signature,
      admin_signature
    );

    if (newMEMState) {
      setState(newMEMState);
      const { containers } = newMEMState;
      const lastContainer = containers[containers.length - 1];
      toast.success(
        `Container ${lastContainer.id.substr(0, 8)}... created successfully!`,
        { duration: 3000 }
      );
    } else {
      toast.error("Failed to create container.", { duration: 3000 });
    }
  }

  async function handleJoinContainer({
    akord_address = "",
    container_id = "",
    vault_id = "",
  }) {
    // status cleanup and validation
    setStatusMessage(undefined);
    if (!ethAddress) return;

    let user_signature = "";
    let admin_signature = "";

    // generate user signatures
    try {
      user_signature = await createSignature(
        `${userMessage}${state?.users_counter || 0}`
      );
      // request signature from our locally-stored private key
      admin_signature = await requestAdminSignature(
        `${adminMessage}${state?.admin_counter || 0}`
      );
    } catch (e) {
      toast.error("Signature generation failed", { duration: 3000 });
      return;
    }
    let token_address;
    let token_threshold = 0;

    // this ensures that you can still interact with unitialized state,
    // but this can be enforced when it is
    if (state) {
      const containerIndex =
        getContainerIndexById(state, container_id) ||
        getContainerIndexByVaultId(state, vault_id);

      if (containerIndex === -1) {
        console.log("no container found");
        return;
      }
      const currentContainer = state.containers[containerIndex];
      token_address = currentContainer.config.token_address;
      token_threshold = currentContainer.config.token_threshold;
    } else token_address = "";

    // call the joinContainer helper function directly connected to MEM
    const newMEMState = await joinContainer(
      ethAddress,
      token_address,
      token_threshold,
      akord_address,
      user_signature,
      admin_signature,
      container_id,
      vault_id
    );

    if (newMEMState) {
      setState(newMEMState);
      const { containers } = newMEMState;
      const lastContainer = containers[containers.length - 1];
      toast.success(
        `Container joined successfully! ID: ${lastContainer.id.substr(0, 8)}.`,
        { duration: 3000 }
      );
    } else {
      toast.error("Failed to join container.", { duration: 3000 });
    }
  }

  const handleUpdateAdmin = async (new_admin_address: string) => {
    if (!ethAddress) return;

    let admin_signature;
    try {
      admin_signature = await createSignature(
        `${adminMessage}${state?.users_counter || 0}`
      );
    } catch (e: any) {
      toast.error(e.message, { duration: 3000 });
      return;
    }

    const newMEMState = await updateAdmin(
      ethAddress,
      admin_signature,
      new_admin_address
    );

    if (newMEMState) {
      setState(newMEMState);
      const { admin_address } = newMEMState;
      toast.success(`Admin changed successfully! New admin: ${admin_address}`, {
        duration: 3000,
      });
    } else {
      toast.error("Failed to join container.", { duration: 3000 });
    }
  };

  // read and set MEM state object
  useEffect(() => {
    const asyncFuncs = async () => {
      let MEMState;
      try {
        MEMState = await readMEM();
        setState(MEMState);
        if (!MEMState) {
          setState(MockMEMState);
          setStateInit(false);
        } else setStateInit(true);
      } catch (e: any) {
        console.log(e.message);
      }
    };
    asyncFuncs();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center gap-y-6 min-h-screen p-24">
      <h1 className="text-black text-4xl font-bold text-center">
        Akord Token-Gated Access Proof of Concept
      </h1>
      <CodeLinks />
      <Guide />
      <CodePreview isMockup={stateInit} state={state} />
      <AkordSignIn {...{ setAkord }} />
      <ConnectButton />
      {ethAddress && (
        <AkordActions
          {...{
            akord,
            ethAddress,
            adminAddress: state?.admin_address,
            handleCreateContainer,
            handleJoinContainer,
            handleUpdateAdmin,
          }}
        />
      )}
    </main>
  );
}
