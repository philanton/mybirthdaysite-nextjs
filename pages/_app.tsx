import '../styles/globals.css'
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import Header from '../components/header'
import goTrueClient from '../utils/auth'
import { AuthChangeEvent, Session } from '@supabase/gotrue-js'

export interface PathFirewall {
  path: string;
  wall_level: 0 /* only public */ | 1 /* only private */ | -1 /* both */;
  name: string;
}

export default function MyApp({ Component, router, pageProps }: AppProps) {
  const [session, setSession] = useState({} as Session);
  const [menuPathes, setMenuPathes] = useState([] as PathFirewall[]);

  const pathFirewalls: PathFirewall[] = [
    {
      path: '/',
      wall_level: -1,
      name: 'home',
    },
    {
      path: '/profile',
      wall_level: 1,
      name: 'profile',
    },
    {
      path: '/history',
      wall_level: -1,
      name: 'history',
    },
    {
      path: '/login',
      wall_level: 0,
      name: 'log in',
    },
    {
      path: '/signup',
      wall_level: 0,
      name: 'sign up',
    },
    {
      path: '/forecast',
      wall_level: 1,
      name: 'weather',
    },
    {
      path: '/signout',
      wall_level: 1,
      name: 'sign out',
    },
  ];

  function updatePathes(loggedIn: boolean) {
    const pathFirewall: PathFirewall = pathFirewalls.filter(data => data.path === router.asPath)[0];
    if (!pathFirewall || !(pathFirewall.wall_level !== +!loggedIn)) {
      router.replace('/');
    }

    const _menuPathes: PathFirewall[] = pathFirewalls.filter(data => {
      return data.wall_level !== +!loggedIn
    });
    setMenuPathes(_menuPathes);
    
  }

  useEffect(() => {
    setSession(goTrueClient.session());
    updatePathes(!!goTrueClient.session());

    goTrueClient.onAuthStateChange((_: AuthChangeEvent, _session: Session) => {
      setSession(_session);
      updatePathes(!!_session);
    });
  }, []);

  return (
    <>
      <Head>
        <title>My Birthday Party</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header menuPathes={menuPathes} />
      <Component {...pageProps} session={session}/>
    </>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};