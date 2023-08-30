import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

export async function createSignature(message: string) {
  const walletClient = createWalletClient({
    chain: mainnet,
    // @ts-ignore
    transport: custom(window?.ethereum),
  });

  // get user to sign signature
  const [account] = await walletClient.getAddresses();
  const signature = await walletClient.signMessage({
    account,
    message,
  });

  return signature;
}
