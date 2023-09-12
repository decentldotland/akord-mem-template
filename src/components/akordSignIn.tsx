import { Akord, Auth } from "@akord/akord-js";
import { Dispatch, SetStateAction, useState } from "react";

interface AkordSignInProps {
  setAkord: Dispatch<SetStateAction<Akord | undefined>>;
}

export function AkordSignIn({ setAkord }: AkordSignInProps) {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  async function akordSignIn() {
    if (!email || !password) return;
    const { wallet } = await Auth.signIn(email, password);
    Akord.init(wallet).then(setAkord).catch(console.log);
  }

  return (
    <>
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
    </>
  );
}
