import { useState } from "react";
import { NavLink } from "react-router-dom";
import avatar from "/img/default_user.png";
import useAuth from "../../../hooks/useAuth";
import { Navlinks } from "../../../constants";

export const HeaderPriv = () => {
  // Usamos el hook Auth para tener disponible el objeto del usuario identificado.
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);

  const HandleTogleNav = () => {
    setOpen(!open);
  };

  return ( 
    <nav className={`flex flex-row w-full justify-between items-center py-4 ${open ? 'fixed' : ''}`}>
      {/* Mobile */}
      { open && (
        <div className="fixed bg-white h-screen w-screen left-0 bottom-0 overflow-hidden">
          <ul className="px-10 py-56 flex flex-col justify-between items-center w-full h-full">
            {Navlinks.map((item) => (
              <li key={item.name}>
                <NavLink to={item.navLink} className="" onClick={HandleTogleNav}>
                  <span className="">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-row justify-between w-full z-10">
        <div className="flex flex-row gap-4">
          <a onClick={HandleTogleNav} className="cursor-pointer hidden max-[690px]:flex">
            {open ? 'X' : 'HM'}
          </a>
          <a href="#" className="">Logo</a>
        </div>

        <div>
          <ul className="flex flex-row gap-4 max-[690px]:hidden">
            {Navlinks.map((item) => (
              <li key={item.name}>
                <NavLink to={item.navLink} className="">
                  <span className="">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul className="flex flex-row gap-4 items-center">
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-col items-end">
                <li className="">
                  <a href="#" className="">
                    <span className="">@{auth.nick}</span>
                  </a>
                </li>

                <li className="m-0 p-0">
                  <NavLink to="/rsocial/logout" className="text-gray-6 hover:underline font-bold text-sm">
                    Cerrar sesión
                  </NavLink>
                </li>
              </div>

              <div className="">
                <li className="">
                  <div className="">
                    <NavLink to="/rsocial/ajustes">
                      {auth.image != "default_user.png" && (
                        <img
                          src={auth.image}
                          className="w-12"
                          alt="Foto de perfil"
                        />
                      )}
                      {auth.image == "default_user.png" && (
                        <img
                          src={avatar}
                          className="w-12"
                          alt="Foto de perfil"
                        />
                      )}
                    </NavLink>
                  </div>
                </li>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  )
}
