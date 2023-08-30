import { Akord, Auth } from "@akord/akord-js";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { createContainer, joinContainer, readMEM } from "@/helpers";
import { createSignature } from "@/helpers/signature";
import { MEMState } from "@/types";

const ConnectButton = dynamic(() =>
  import("@rainbow-me/rainbowkit").then((mod) => mod.ConnectButton)
);

const emptyConfig = {
  vault_id: "",
  gating_type: "",
  token_address: "",
  max_entries: 1,
  token_threshold: 1000000,
  akord_address: "",
};

export default function Home() {
  const { address } = useAccount();

  // Akord
  const [akord, setAkord] = useState<Akord>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  // state and handlers
  const [state, setState] = useState<MEMState>();
  const [statusMessage, setStatusMessage] = useState<string | undefined>();

  async function akordSignIn() {
    if (!email || !password) return;
    const { wallet } = await Auth.signIn(email, password);
    Akord.init(wallet).then(setAkord).catch(console.log);
  }

  useEffect(() => {
    readMEM().then(setState).catch(console.log);
  }, []);

  async function handleCreateContainer() {
    setStatusMessage(undefined);
    if (!state || !address) return;
    const user_signature = await createSignature(
      `akord-mem::${state.users_counter}`
    );
    const admin_signature = await createSignature(
      `akord-mem::${state.admin_counter}`
    );
    const newState = await createContainer(
      address,
      emptyConfig,
      user_signature,
      admin_signature
    );
    if (newState) {
      const { containers } = newState;
      const lastContainer = containers[containers.length - 1];
      setStatusMessage(
        `Container created successfully! Container object: ${JSON.stringify(
          lastContainer
        )}`
      );
    } else {
      setStatusMessage("Failed to create container.");
    }
  }

  async function handleJoinContainer(
    akord_address = "",
    container_id = "",
    vault_id = ""
  ) {
    // status cleanup and validation
    setStatusMessage(undefined);
    if (!state || !address) return;

    // getting args
    const user_signature = await createSignature(
      `akord-mem::${state.users_counter}`
    );
    const admin_signature = await createSignature(
      `akord-mem::${state.admin_counter}`
    );

    const newState = await joinContainer(
      address,
      akord_address,
      user_signature,
      admin_signature,
      container_id,
      vault_id
    );

    if (newState) {
      const { containers } = newState;
      const lastContainer = containers[containers.length - 1];
      setStatusMessage(
        `Container joined successfully! Container object: ${JSON.stringify(
          lastContainer
        )}`
      );
    } else {
      setStatusMessage("Failed to join container.");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center gap-y-6 min-h-screen p-24">
      <h1 className="text-black text-4xl font-bold">
        Akord Token-Gated Access Proof of Concept
      </h1>
      <div className="flex gap-x-4">
        <a
          className="underline hover:text-blue-300"
          target="_blank"
          rel="noopener noreferrer"
          href="https://gist.github.com/charmful0x/7908734530a8551c11b02e0b553abbd3#file-akord-js"
        >
          Contract File ↗
        </a>
        <a
          className="underline hover:text-blue-300"
          target="_blank"
          rel="noopener noreferrer"
          href="https://gist.github.com/charmful0x/7908734530a8551c11b02e0b553abbd3#file-akord-json"
        >
          State File ↗
        </a>
      </div>
      <h2 className="font-bold text-center"> Application state </h2>
      <div className="border-2 border-black max-h-[200px] overflow-y-scroll p-2">
        <pre>
          <code>{JSON.stringify(state, null, 4)}</code>
        </pre>
      </div>
      <ConnectButton />
      <form
        className="flex flex-row gap-x-3 items-center justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          akordSignIn();
        }}
      >
        <input
          placeholder="email"
          className="border-2 border-black px-2 py-1"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="password"
          className="border-2 border-black px-2 py-1"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="border-2 border-black px-2 py-1" type="submit">
          Akord Sign In
        </button>
      </form>
      {address && (
        <>
          <button
            className="border-black border-2 px-2 py-1 hover:shadow-lg"
            onClick={() => handleCreateContainer()}
          >
            Create a new container
          </button>
          <button
            className="border-black border-2 px-2 py-1 hover:shadow-lg"
            onClick={() => handleJoinContainer()}
          >
            Join Container
          </button>
        </>
      )}
    </main>
  );
}
