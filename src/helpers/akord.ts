import { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  AkordContainerConfig,
  JoinContainerConfig,
  AkordContainerConfigKeys as CCKey,
  JoinContainerConfigKeys as JCKey,
} from "@/types";

export function updateCreateContainerConfig<K extends CCKey>(
  config: AkordContainerConfig,
  key: K,
  value: AkordContainerConfig[K]
): AkordContainerConfig {
  return { ...config, [key]: value };
}

export function updateJoinContainerConfig<K extends JCKey>(
  config: JoinContainerConfig,
  key: K,
  value: JoinContainerConfig[K]
): JoinContainerConfig {
  return { ...config, [key]: value };
}

export function onChangeCreateContainer(
  e: ChangeEvent<HTMLInputElement>,
  setState: Dispatch<SetStateAction<AkordContainerConfig>>,
  config: any,
  key: CCKey
) {
  const { value } = e.target;
  const updatedConfig = updateCreateContainerConfig(config, key, value as any);
  setState(updatedConfig);
}

export function onChangeJoinContainer(
  e: ChangeEvent<HTMLInputElement>,
  setState: Dispatch<SetStateAction<JoinContainerConfig>>,
  config: any,
  key: JCKey
) {
  const { value } = e.target;
  const updatedConfig = updateJoinContainerConfig(config, key, value as any);
  setState(updatedConfig);
}
