import { useEffect } from "react"
import router from "next/router"
import goTrueClient from "../utils/auth"

export default function SignOut() {
  const signOut = async () => {
    const { error } = await goTrueClient.signOut();
    if (!error) {
      router.replace('/');
    }
  };

  useEffect(() => {
    signOut();
  }, []);

  return null;
}