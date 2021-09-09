import { ChangeEvent, SyntheticEvent, useState, useEffect } from 'react'
import { Session } from '@supabase/gotrue-js'
import supabase from '../utils/supabase'
import Avatar from '../components/avatar'
import useCheckbox from '../hooks/useCheckbox'
import router from 'next/router'
import goTrueClient from '../utils/auth'

interface SurveyProps {
  session: Session;
}

export default function SurveyContent({ session }: SurveyProps) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [wishes, setWishes] = useState("");

  const [beerOk, setBeerOk, BeerCheckbox] = useCheckbox("beer");
  const [vodkaOk, setVodkaOk, VodkaCheckbox] = useCheckbox("vodka");
  const [whiskieOk, setWhiskieOk, WhiskieCheckbox] = useCheckbox("whiskie");
  const [wineOk, setWineOk, WineCheckbox] = useCheckbox("wine");
  const [ginOk, setGinOk, GinCheckbox] = useCheckbox("gin");

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      const user = goTrueClient.user();

      const { data, error, status } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        setAvatarUrl("");
        setFirstName("");
        setLastName("");
        setPhone("");
        setCountry("");
        setCity("");
        setBeerOk(false);
        setVodkaOk(false);
        setWhiskieOk(false);
        setWineOk(false);
        setGinOk(false);
        setWishes("");
      }

      if (data) {
        setAvatarUrl(data.avatar_url);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhone(data.phone);
        setCountry(data.country);
        setCity(data.city);
        setBeerOk(data.beer_ok);
        setVodkaOk(data.vodka_ok);
        setWhiskieOk(data.whiskie_ok);
        setWineOk(data.wine_ok);
        setGinOk(data.gin_ok);
        setWishes(data.wishes);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function updateProfile(url?: string) {
    try {
      const user = goTrueClient.user();

      const { data } = await supabase
        .from('profiles')
        .select(`created_at`)
        .eq('id', user.id)
        .single();

      const updates = {
        id: user.id,
        avatar_url: url || avatarUrl,
        first_name: firstName,
        last_name: lastName,
        phone,
        country,
        city,
        beer_ok: beerOk,
        vodka_ok: vodkaOk,
        whiskie_ok: whiskieOk,
        wine_ok: wineOk,
        gin_ok: ginOk,
        wishes,
        updated_at: new Date(),
        created_at: !data ? new Date() : data.created_at,
      }

      const { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', 
      });

      if (error) {
        throw error
      } else {
        router.replace('/profile');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (/^\d{0,10}$/.test(e.target.value)) {
      setPhone(e.target.value);
    }
  }

  return (
    <div className="desert desert-up">
      <div className="content">
        <h2 id="title">Profile</h2>
        <div className="chunk" id="description">
          <p className="paragraph">
            Fill fields below, so we will know you more
          </p>
        </div>
        <form id="survey-form" onSubmit={(e: SyntheticEvent) => {
          e.preventDefault();
          updateProfile();
        }}>
          <div className="chunk flex justify-center">
            <Avatar
              url={avatarUrl}
              size={250}
              onUpload={url => {
                setAvatarUrl(url);
                updateProfile(url);
              }}
            />
          </div>
          <div className="chunk">
            <label
              className="lbl"
              htmlFor="first_name"
            >
              First name:
            </label>
            <input
              type="text" id="first_name"
              placeholder="Ivan"
              onChange={e => setFirstName(e.target.value)}
              value={firstName}
            />
          </div>
          <div className="chunk">
            <label
              className="lbl"
              htmlFor="last_name"
            >
              Last name:
            </label>
            <input
              type="text" id="last_name"
              placeholder="Ivanov"
              onChange={e => setLastName(e.target.value)}
              value={lastName}
            />
          </div>
          <div className="chunk">
            <label
              className="lbl"
              htmlFor="phone"
            >
              Phone number:
            </label>
            <input
              type="text" id="phone"
              placeholder="0987654321"
              onChange={handlePhoneChange}
              value={phone}
            />
          </div>
          <div className="chunk">
            <label
              className="lbl"
              htmlFor="country"
            >
              Country:
            </label>
            <input
              type="text" id="country"
              placeholder="Ukraine"
              onChange={e => setCountry(e.target.value)}
              value={country}
            />
          </div>
          <div className="chunk">
            <label
              className="lbl"
              htmlFor="city"
            >
              City:
            </label>
            <input
              type="text"id="city"
              placeholder="Kyiv"
              onChange={e => setCity(e.target.value)}
              value={city}
            />
          </div>
          <div className="chunk">
            <label className="lbl">
              Favorite drinks:
            </label>
            <div className="flex flex-wrap">
                <BeerCheckbox />
                <VodkaCheckbox />
                <WhiskieCheckbox />
                <WineCheckbox />
                <GinCheckbox />       
            </div>
          </div>
          <div className="chunk">
            <label className="lbl" htmlFor="wishes">
              What you want?
            </label>
            <textarea
              placeholder="Type something..."
              id="wishes"
              onChange={e => setWishes(e.target.value)}
              value={wishes}
            ></textarea>
          </div>
          <div className="chunk">
            <button type="submit" className="btn btn-pr float-right">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}