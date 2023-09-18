import { Akord, Auth } from "@akord/akord-js";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";

interface AkordSignInProps {
  setAkord: Dispatch<SetStateAction<Akord | undefined>>;
}

export default function AkordSignIn({ setAkord }: AkordSignInProps) {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  async function akordSignIn() {
    if (!email || !password) return;
    try {
      Auth.configure({ storage: window.sessionStorage });
      const { wallet } = await Auth.signIn(email, password);
      const akord = await Akord.init(wallet);
      const akordUser = await akord.api.getUser();
      setAkord(akord);
      toast.success("Signed in as " + akordUser.email, { duration: 3000 });
    } catch (e: any) {
      toast.error(e.message);
    }
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
