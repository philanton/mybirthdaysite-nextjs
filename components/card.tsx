import { useState, useEffect } from 'react'
import Image from 'next/image'
import supabase from '../utils/supabase'

export interface CardProps {
  name: string;
  imageUrl: string;
  alco: string;
  wishes: string;
}

export default function ProfileCard(props: CardProps) {
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    if (props.imageUrl) downloadImage(props.imageUrl)
  }, [props.imageUrl])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      console.log(data, error);
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
    <div className="mx-16 my-8 border-4 border-yellow-400 rounded-3xl bg-white">
      <div className="p-4 flex items-stretch">
        <div className="mr-4">
          {avatarUrl ?
            <img
              src={avatarUrl}
              className="rounded-lg"
              style={{ width: 160, height: 160}}
            /> :
            <Image
              src={require("../public/img/ducky_sunset.png")}
              width={160}
              height={160}
            />
          }
        </div> {/* profile image */}
        <div className="flex flex-grow flex-col justify-around">
          <div className="text-4xl">
            {props.name || "NoName"}
          </div> {/* name */}
          <div className="border-t-4 border-yellow-400" />
          <div className="text-4xl">
            {props.alco}
          </div> {/* alco */}
        </div>
      </div>
      {props.wishes && (
        <>
          <div className="border-t-4 border-yellow-400" />
          <div className="p-4">
            {props.wishes}
          </div>
        </>
      )} {/* wishes */}
    </div>
  );
}