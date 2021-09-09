import { useState, useEffect } from 'react'
import supabase from '../utils/supabase'
import ProfileCard, { CardProps } from './card'

export default function HomePage() {
  const [time, setTime] = useState(new Date());
  const [data, setData] = useState([] as CardProps[]);

  const getProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url, first_name, beer_ok, vodka_ok, whiskie_ok, wine_ok, gin_ok, wishes, created_at')
      .order('created_at', { ascending: true });

    if (error) return

    setData(data.map(v => {
      return {
        name: v.first_name,
        imageUrl: v.avatar_url,
        alco: (
          v.beer_ok ? "BEER" :
          v.vodka_ok ? "VODKA" :
          v.whiskie_ok ? "WHISKIE" :
          v.wine_ok ? "WINE" :
          v.gin_ok ? "GIN" :
          "BASTARD"
        ),
        wishes: v.wishes,
      };
    }))
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    getProfiles();
    return () => clearInterval(interval);
  }, [])

  return (
    <div className="desert desert-up">
      <div className="content">
          <div className="chunk">
            <div className="btn btn-sec m-auto text-2xl sm:text-5xl w-40 sm:w-96">
              {stringTimeRemaining(time)}
            </div>
          </div>
          <div className="chunk">
            <div className="paragraph">
              Hello everyone, this is my birthday party #6,
              and this page will contain 
              all the relevant information about it.
            </div>
            <div className="paragraph">
              There is a countdown above,
              and to put it simply,
              we will meet at 16:00 on September 16 at KPI
              (the exact location will appear here later).
            </div>
            <div className="paragraph">
              Everything will end on September 17th.
            </div>
            <div className="paragraph">
              You can also go to the profile in the menu,
              and fill in the data.
            </div>
            <div className="paragraph">
              Everyone who fills in their profile 
              automatically appears here below 
              and can choose a place in the queue for playing music.
            </div>
            <div className="paragraph">
              If this doesn't interest you,
              then the profile can be left blank.
            </div>
          </div>
          <div className="chunk">
            {data.map((v: CardProps, i: number) => <ProfileCard key={i} {...v} />)}
          </div>
        </div>
    </div>
  )
}

function stringTimeRemaining(time: Date): string {
  const td = new Date(2021, 9, 16, 16).getTime() - time.getTime();
  if (td < 0) return '00 : 00 : 00'
  const tr = new Date(td);
  return `${(24 * tr.getDate() + tr.getHours()).toString().padStart(3)} : 
    ${tr.getMinutes().toString().padStart(2, '0')} : 
    ${tr.getSeconds().toString().padStart(2, '0')}`
}