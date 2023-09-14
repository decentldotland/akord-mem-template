import { ChangeEvent, useState } from "react";
import {
  AkordContainerConfig,
  JoinContainerConfig,
  AkordContainerConfigKeys as CCKey,
  JoinContainerConfigKeys as JCKEY,
  GatingType,
} from "@/types";

const emptyCreateContainerConfig = {
  vault_id: "1",
  gating_type: GatingType.ERC20,
  token_address: "0x",
  max_entries: 100,
  token_threshold: 1,
  akord_address: "0x",
};

const emptyJoinContainerConfig: JoinContainerConfig = {
  akord_address: "0x",
  container_id: "1",
  vault_id: "1",
};

interface AkordActionsProps {
  ethAddress: string | undefined;
  handleCreateContainer: (args: AkordContainerConfig) => void;
  handleJoinContainer: (args: JoinContainerConfig) => void;
}

export function AkordActions({
  ethAddress,
  handleCreateContainer,
  handleJoinContainer,
}: AkordActionsProps) {
  const [createContainerConfig, setCreateContainerConfig] =
    useState<AkordContainerConfig>(emptyCreateContainerConfig);

  const [joinContainerConfig, setJoinContainerConfig] =
    useState<JoinContainerConfig>(emptyJoinContainerConfig);

  const onCreateContainerChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: CCKey
  ) => {
    const { value } = e.target;

    function updateCreateContainerConfig<K extends CCKey>(
      config: AkordContainerConfig,
      key: K,
      value: AkordContainerConfig[K]
    ): AkordContainerConfig {
      return { ...config, [key]: value };
    }

    const updatedConfig = updateCreateContainerConfig(
      createContainerConfig,
      key,
      value as any
    );
    setCreateContainerConfig(updatedConfig);
  };

  const onJoinContainerChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: JCKEY
  ) => {
    const { value } = e.target;

    function updateJoinContainerConfig<K extends JCKEY>(
      config: JoinContainerConfig,
      key: K,
      value: JoinContainerConfig[K]
    ): JoinContainerConfig {
      return { ...config, [key]: value };
    }

    const updatedConfig = updateJoinContainerConfig(
      joinContainerConfig,
      key,
      value as any
    );

    setJoinContainerConfig(updatedConfig);
  };

  return (
    <div className="flex flex-col gap-x-2 gap-y-2">
      <div className="flex flex-col gap-y-2 border-black border-2 p-3">
        <h3 className="text-2xl font-bold text-center mb-2">
          Create a New Container
        </h3>
        {Object.keys(emptyCreateContainerConfig).map((key, idx) => (
          <div key={idx} className="flex gap-x-2 items-center">
            <label className="w-full" htmlFor={key}>
              {key}{" "}
              {key === "gating_type" && (
                <span className="text-xs font-bold">(erc20 or erc721)</span>
              )}
            </label>
            <input
              id={key}
              className={`w-full border-2 border-black px-1 ${
                !createContainerConfig[key as CCKey] ||
                // check if gating_type is erc20 or erc721
                (key === "gating_type" &&
                  createContainerConfig[key as CCKey] !== GatingType.ERC20 &&
                  createContainerConfig[key as CCKey] !== GatingType.ERC721)
                  ? "border-red-500"
                  : "border-black"
              }`}
              placeholder={key}
              onChange={(e) => onCreateContainerChange(e, key as CCKey)}
              value={createContainerConfig[key as CCKey]}
            />
          </div>
        ))}
        <button
          className="border-black border-2 px-2 py-1 mt-4 hover:shadow-lg disabled:bg-gray-300"
          disabled={!ethAddress}
          onClick={() => {
            console.log(createContainerConfig);
            handleCreateContainer(createContainerConfig);
          }}
        >
          Create
        </button>
      </div>

      <div className="flex flex-col gap-y-2 border-black border-2 p-3">
        <h3 className="text-2xl font-bold text-center mb-2">Join Containers</h3>

        {Object.keys(emptyJoinContainerConfig).map((key, idx) => (
          <div key={idx} className="flex gap-x-2 items-center">
            <label className="w-full" htmlFor={key}>
              {key}
            </label>
            <input
              id={key}
              className={`w-full border-2 border-black px-1 ${!joinContainerConfig[
                key as JCKEY
              ]}`}
              placeholder={key}
              onChange={(e) => onJoinContainerChange(e, key as JCKEY)}
              value={joinContainerConfig[key as JCKEY]}
            />
          </div>
        ))}
        <button
          className="border-black border-2 px-2 py-1 hover:shadow-lg disabled:bg-gray-300"
          disabled={!ethAddress}
          onClick={() => handleJoinContainer(joinContainerConfig)}
        >
          Join
        </button>
      </div>
    </div>
  );
}
