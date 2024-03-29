import Image from 'next/image'
import { WeatherDataFiltered } from "../utils/weatherAPI"

interface CurrentWeatherProps {
    sunrise: Date;
    sunset: Date;
    other: WeatherDataFiltered
}

export default function CurrentWeather(props: CurrentWeatherProps) {
  return (
    <div className="chunk bg-indigo-200 rounded-3xl p-6">
      <div className="flex flex-wrap justify-center items-center m-6">
        <p className="w-30 sm:w-60">
          {new Date(props.other.date * 1000).toDateString()}
        </p>
        <em className="emph p-4">
          {props.other.weather_description}
        </em>
        <div>
          <Image
            src={props.other.weather_icon_uri}
            alt={props.other.weather_main}
            width={96}
            height={96}
          />
        </div>
      </div>
      <div className="paragraph bg-indigo-300 rounded-lg p-2 my-0 sm:my-0">
        <p>
          Sunrise at {props.sunrise.toTimeString().match(/\d\d:\d\d/)} and 
          sunset at {props.sunset.toTimeString().match(/\d\d:\d\d/)}.
        </p>
        <p>
          Temperature is {props.other.temp} C
          and it feels like {props.other.feels_like} C.
        </p>
        <p>
          Humidity: {props.other.humidity}%.
        </p>
        <p>
          Pressure: {props.other.pressure}hPa.
        </p>
      </div>
    </div>
  );
}