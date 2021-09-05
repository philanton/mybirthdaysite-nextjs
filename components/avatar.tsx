import { ChangeEvent, useEffect, useState } from "react"
import Image from 'next/image'
import supabase from '../utils/supabase'

interface AvatarProps {
    url: string;
    size: number;
    onUpload: (url: string) => void;
}

export default function Avatar({ url, size, onUpload }: AvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

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


  async function uploadAvatar(e: ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.floor(Math.random() * 1000)}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }
      console.log(filePath);

      onUpload(filePath)
    } catch (error) {
      console.log(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="avatar">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="image"
          style={{width: size, height: size}}
        />
      ) : (
        <Image
          src={require("../public/img/ducky_sunset.png")}
          width={size}
          height={size}
        />
      )}
      <div style={{ width: size }}>
        <label className="btn btn-pr block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}