import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { PathFirewall } from '../pages/_app'
import MenuItem from './menuItem'

interface HeaderProps {
  menuPathes: PathFirewall[];
}

export default function Header(props: HeaderProps) {
  const router = useRouter();
  const isHomePage = router.asPath === '/';
  const [menuOpened, setMenuOpened] = useState(false);

  const handleClick = useCallback(() => {
    setMenuOpened(!menuOpened);
  }, [menuOpened]);

  return (
    <>
      <header>
        <Link href="/">
          <a className={menuOpened ? "icon-s" : "icon-m"}>
            {menuOpened ? (
              <Image
                src={require("../public/img/ducky_logo_sec.png")}
                width={32}
                height={32}
                alt=""
              />
            ) : (
              <Image
                src={require("../public/img/ducky_logo.png")}
                width={48}
                height={48}
                alt=""
              />
            )}
          </a>
        </Link>
        <h1>
          {isHomePage ?
            "Welcome to my Birthday Party" :
            "MyBirthdayParty#6"}
        </h1>
        <div className="icon-s">
          <Image
            src={menuOpened ?
              require("../public/img/close.png") :
              require("../public/img/menu.png")
            }
            width={32}
            height={32}
            alt=""
            onClick={handleClick}
          />
        </div>
      </header>
      <div className={menuOpened ? "menu" : "hidden"}>
        <div>
          {props.menuPathes.map(data => (
            <MenuItem
              path={data.path}
              name={data.name}
              handleClick={handleClick}
              key={data.path}
            />
          ))}
        </div>
      </div>
    </>
  );
}