import { Session } from "@supabase/gotrue-js"
import WelcomeContent from "../components/welcome"
import HomePage from "../components/homePage"

interface HomeProps {
  session: Session;
}

export default function Home({ session }: HomeProps) {
  return (!session ? 
    <WelcomeContent /> :
    <HomePage />)
}