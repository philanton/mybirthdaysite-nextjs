import router from "next/router";
import goTrueClient from "../utils/auth"

export default function GoogleAuth() {
  const signInWithGoogle = async () => {
    const { error } = await goTrueClient.signIn({ provider: 'google' });
    if (error) {
      alert(error.message);
    } else {
      router.replace('/');
    }
  };

  return (
    <button
      className="btn btn-sec w-full mx-0 sm:mx-0 my-10 sm:my-20"
      onClick={signInWithGoogle}
    >
      Have an account in Google? Use it!
    </button>
  )
}