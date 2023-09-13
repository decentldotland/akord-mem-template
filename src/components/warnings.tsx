interface NotWhitelistedProps {
  address: string;
}

export function NotWhitelisted({ address }: NotWhitelistedProps) {
  return (
    <div className="text-orange-400 text-center">
      Warning! Cannot interact with the state! Admin address is different from
      the currently authenticated user. Please{" "}
      <a
        className="underline hover:text-blue-300"
        target="_blank"
        rel="noopener noreferrer"
        href="https://mem.tech/ide?launchExample=7908734530a8551c11b02e0b553abbd3?mainnet=true"
      >
        deploy ↗
      </a>{" "}
      the contract with <code className="text-gray-400">admin_address</code> of{" "}
      <code className="text-gray-400">{address}</code> and contact{" "}
      <a
        href="https://t.me/Akapepe007"
        className="underline hover:text-blue-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        @charmful0x
      </a>{" "}
      to get it whitelisted.
    </div>
  );
}

export function UnitializedState() {
  return (
    <p className="text-orange-400 text-center">
      Warning! State has not been initialized. You are seeing a mock state. Send
      an interaction to see the real state!
    </p>
  );
}
