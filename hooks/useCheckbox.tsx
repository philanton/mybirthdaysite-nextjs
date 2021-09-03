import { useState } from "react";

export default function useCheckbox(name: string): [boolean, React.FC] {
  const [isChecked, setIsChecked] = useState(false);

  return [
    isChecked,
    () => (
      <div>
        <input
          type="checkbox" id={name}
          name={name} value={name}
          onChange={() => setIsChecked(!isChecked)}
          checked={isChecked}
        />
        <label htmlFor={name}>
          {`${name[0].toUpperCase()}${name.slice(1)}`}
        </label>
      </div>
    )
  ]
}