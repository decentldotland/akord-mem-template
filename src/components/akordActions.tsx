import { Akord } from "@akord/akord-js";
import { useEffect, useState } from "react";

import {
  AkordContainerConfig,
  JoinContainerConfig,
  AkordContainerConfigKeys as CCKey,
  JoinContainerConfigKeys as JCKEY,
  GatingType,
} from "@/types";
import {
  emptyCreateContainerConfig,
  emptyJoinContainerConfig,
} from "@/constants";
import {
  onChangeCreateContainer,
  onChangeJoinContainer,
  updateCreateContainerConfig,
  updateJoinContainerConfig,
} from "@/helpers/akord";

interface AkordActionsProps {
  akord: Akord | undefined;
  ethAddress: string | undefined;
  handleCreateContainer: (args: AkordContainerConfig) => void;
  handleJoinContainer: (args: JoinContainerConfig) => void;
  handleUpdateAdmin: (address: string) => void;
}

export default function AkordActions({
  akord,
  ethAddress,
  handleCreateContainer,
  handleJoinContainer,
  handleUpdateAdmin,
}: AkordActionsProps) {
  const [address, setAddress] = useState<string>("");
  const [vaults, setVaults] = useState<string[]>([]);

  const [createContainerConfig, setCreateContainerConfig] =
    useState<AkordContainerConfig>(emptyCreateContainerConfig);

  const [joinContainerConfig, setJoinContainerConfig] =
    useState<JoinContainerConfig>(emptyJoinContainerConfig);

  // get akord info on signIn
  useEffect(() => {
    if (akord) {
      const updateInputFields = async () => {
        const userInfo = await akord.api.getUser();
        const { address } = userInfo;

        const cc = updateCreateContainerConfig(
          createContainerConfig,
          "akord_address",
          address
        );
        setCreateContainerConfig(cc);

        const jc = updateJoinContainerConfig(
          joinContainerConfig,
          "akord_address",
          address
        );
        setJoinContainerConfig(jc);
      };
      updateInputFields();
    }
  }, [akord]);

  return (
    <div className="flex flex-col gap-x-2 gap-y-2">
      <div className="flex flex-col gap-y-2 border-black border-2 p-3">
        <h3 className="text-2xl font-bold text-center mb-2">
          Change Admin Address
        </h3>
        <div className="flex flex-col items-center gap-y-2">
          <input
            value={address}
            placeholder={"New admin address"}
            onChange={(e) => setAddress(e.target.value)}
            className="border-2 border-black px-2 py-1 w-full"
          />
          <button
            className="border-2 border-black px-2 py-1 w-full"
            onClick={() => handleUpdateAdmin(address)}
          >
            Change
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 border-black border-2 p-3">
        <h3 className="text-2xl font-bold text-center mb-2">
          Create a New Container
        </h3>
        {/* map through create container inputs */}
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
              onChange={(e) =>
                onChangeCreateContainer(
                  e,
                  setCreateContainerConfig,
                  createContainerConfig,
                  key as CCKey
                )
              }
              value={createContainerConfig[key as CCKey]}
            />
          </div>
        ))}
        <button
          className="border-black border-2 px-2 py-1 mt-4 hover:shadow-lg disabled:bg-gray-300"
          disabled={!ethAddress}
          onClick={() => handleCreateContainer(createContainerConfig)}
        >
          Create
        </button>
      </div>

      <div className="flex flex-col gap-y-2 border-black border-2 p-3">
        <h3 className="text-2xl font-bold text-center mb-2">Join Containers</h3>
        {/* map through input options */}
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
              onChange={(e) =>
                onChangeJoinContainer(
                  e,
                  setJoinContainerConfig,
                  joinContainerConfig,
                  key as JCKEY
                )
              }
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
