import { useState, useEffect, ChangeEvent } from 'react'
import router from 'next/router'
import supabase from '../utils/supabase'
import ProfileCard, { CardProps } from './card'
import { Session } from '@supabase/gotrue-js';

interface CurrentMember {
  isI: boolean;
  queue: number;
  stageName: string;
}

export default function HomePage() {
  const [time, setTime] = useState(new Date());
  const [data, setData] = useState([] as CardProps[]);
  const [currentMember, setCurrentMember] = useState({} as CurrentMember);
  const [buttons, setButtons] = useState([] as boolean[]);

  const updateQueue = async () => {
    const userId = supabase.auth.user().id;
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', userId)
      .single()
    
    if (error) return

    data.queue = currentMember.queue;
    data.stage_name = currentMember.stageName;

    const { error: err } = await supabase
      .from('profiles')
      .upsert(data, {
        returning: 'minimal', 
      });

    if (err) {
      console.log(err);
    } else {
      router.push('/')
      setCurrentMember(Object.assign({}, currentMember, {isI: !currentMember.isI}));
    }
  };

  const getProfiles = async () => {
    const { data: dat, error } = await supabase
      .from('profiles')
      .select('id, avatar_url, first_name, beer_ok, vodka_ok, whiskie_ok, wine_ok, gin_ok, wishes, created_at, queue, stage_name')
      .order('created_at', { ascending: true })

    if (error) return

    const data = dat.sort((a, b) => a.queue - b.queue);

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
        queue: v.queue,
        stageName: v.stage_name,
      };
    }));

    const leftUsers = data.filter(v => v.queue === 0);
    if (leftUsers.length > 0 && leftUsers[0].id === supabase.auth.user().id) {
      setCurrentMember({
        isI: true,
        queue: leftUsers[0].queue,
        stageName: leftUsers[0].stage_name
      })
    }

    const inQueue = data.filter(v => v.queue !== 0).map(v => v.queue);
    const queueButtons = Array
      .from(Array(data.length).keys())
      .map(v => !inQueue.includes(v + 1));
    setButtons(queueButtons);
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    getProfiles();
    return () => clearInterval(interval);
  }, [currentMember.isI])

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
              As you can see above,
              there is only a short time left,
              less than 100 hours.
            </div>
            <div className="paragraph">
              So that you do not get bored,
              I give each of you the opportunity
              to create your own musical set,
              which will become part of the larger that evening.
            </div>
            <div className="paragraph">
              Below you will soon be able to choose
              which one in turn you want your music to play.
              In general, I think everything will stretch from 18:00 to 2:00,
              that is, everyone will have up to 45 minutes,
              and for example the 6th will play at about 9 o'clock.
            </div>
            <div className="paragraph">
              The queue to choose now belongs to the one
              who is the highest in the list below.
            </div>
            <div className="paragraph">
              Well, my additional desire,
              let those who have pop and rap be the first,
              and techno closer to the end,
              otherwise I'm not ready to listen
              to the first before going to bed.
            </div>
            <div className="paragraph">
              I am waiting for you in telegram
              with ready-made lists of links
              to music videos from YouTube.
              And I will repeat myself up to
              a maximum of 45 minutes,
              that is, up to 10-15 tracks.
            </div>
          </div>
          {currentMember.isI && (
            <div className="chunk border-indigo-400 rounded-3xl border-8 p-4">
              <label className="lbl">Choose your place in the queue:</label>
              <div className="flex flex-wrap">
                {buttons.map((v, i) => v && !(currentMember.queue === i + 1) ?
                  <button
                    className="m-2 py-1 px-3 bg-indigo-400 text-white rounded-lg"
                    key={i}
                    onClick={() => setCurrentMember(Object.assign({}, currentMember, { queue: i + 1 }))}
                  >
                    {i + 1}
                  </button> :
                  <button
                    className={
                      `m-2 py-1 px-3 bg-indigo-${currentMember.queue !== i + 1 ? 2 : 3}00 text-indigo-400 
                      rounded-lg border-indigo-400 border-2`
                    }
                    key={i}
                    disabled
                  >
                    {i + 1}
                  </button>
                )}
              </div>
              <label
                className="lbl"
                htmlFor="stage"
              >
                Give a name for your stage:
              </label>
              <input
                type="text"
                id="stage"
                placeholder="Boring"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setCurrentMember(Object.assign(
                    {},
                    currentMember,
                    { stageName: e.target.value }
                  ))
                }}
                value={currentMember.stageName}
              />
              <button
                className="btn btn-pr m-auto"
                onClick={updateQueue}
              >
                OK
              </button>
            </div>
          )}
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