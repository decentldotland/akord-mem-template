import { Akord } from "@akord/akord-js";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";

import { MockMEMState, adminMessage, userMessage } from "@/constants";
import { createContainer, joinContainer, readMEM } from "@/helpers";
import { createSignature, requestAdminSignature } from "@/helpers/signature";
import { AkordContainerConfig, MEMState } from "@/types";

import CodeLinks from "@/components/codelinks";
import CodePreview from "@/components/codepreview";
import { AkordSignIn } from "@/components/akordSignIn";
import { AkordActions } from "@/components/akordActions";
import { NotWhitelisted, UnitializedState } from "@/components/warnings";

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
    // call the joinContainer helper function directly connected to MEM
    const newMEMState = await joinContainer(
      ethAddress,
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
      {!stateInit && <UnitializedState />}
      {ethAddress && state && state.admin_address !== ethAddress && (
        <NotWhitelisted address={ethAddress} />
      )}
      <CodePreview state={state} />
      <ConnectButton />
      {ethAddress && (
        <AkordActions
          {...{
            ethAddress,
            handleCreateContainer,
            handleJoinContainer,
          }}
        />
      )}
      <AkordSignIn {...{ setAkord }} />
    </main>
  );
}
