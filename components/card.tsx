import { useState, useEffect } from 'react'
import Image from 'next/image'
import supabase from '../utils/supabase'

export interface CardProps {
  name: string;
  imageUrl: string;
  alco: string;
  wishes: string;
  queue: number;
  stageName: string;
}

export default function ProfileCard(props: CardProps) {
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    if (props.imageUrl) downloadImage(props.imageUrl)
  }, [props.imageUrl])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  return (
    <div className={
      `mx-0 sm:mx-16 my-4 sm:my-8 border-4 
      border-yellow-400 rounded-3xl overflow-hidden
      bg-indigo-${props.queue === 0 ? 2 : 3}00`
    }>
      <div className="p-4 flex items-stretch">
        <div className="mr-4 w-24 sm:w-auto h-24 sm:h-auto object-contain">
          {avatarUrl ?
            <img
              src={avatarUrl}
              className="rounded-lg w-24 sm:w-40 h-24 sm:h-40 object-cover"
            /> :
            <Image
              src={require("../public/img/ducky_sunset.png")}
              width={160}
              height={160}
            />
          }
        </div>
        <div className="flex flex-grow flex-col justify-around">
          <div className="text-2xl sm:text-4xl">
            {props.name || "NoName"}
          </div>
          <div className="border-t-4 border-yellow-400" />
          <div className="text-2xl sm:text-4xl">
            {props.alco}
          </div>
        </div>
      </div>
      {props.queue !== 0 && (
        <>
          <div className="border-t-4 border-yellow-400" />
          <div className="flex p-4 items-center bg-indigo-300">
            <div className="py-1 px-3 bg-indigo-400 text-white rounded-lg text-center">
              {props.queue || "0"}
            </div>
            <div className="flex-grow text-center">
              Stage: {props.stageName || "Boring"}
            </div>
          </div>
        </>
      )}
      {props.wishes && (
        <>
          <div className="border-t-4 border-yellow-400" />
          <div className="p-4 bg-purple-400">
            {props.wishes}
          </div>
        </>
      )}
    </div>
  );
}