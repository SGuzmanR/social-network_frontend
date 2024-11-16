import { Navigate, Outlet } from "react-router-dom";
import { HeaderPriv } from "./HeaderPriv"
// import { Sidebar } from "./Sidebar"
import useAuth from '../../../hooks/useAuth';

export const PrivateLayout = () => {

  const { auth, loading } = useAuth();

  if (loading) {
    return <h1 className="">Cargando...</h1>
  } else {
    return (
      <>
        {/* Cabecera y navegación*/}
        <HeaderPriv />

        {/* Contenido Principal */}
        <section className='screen-max-width'>
          <div className='flex w-full max-[1260px]:px-10'>
            <div className="flex flex-col justify-center items-center w-full h-full">
              {auth._id ?
                <Outlet />
                :
                <Navigate to="/login" />
              }
            </div>
            {/* Barra Lateral */}
            {/* <Sidebar /> */}
          </div>
        </section>

      </>
    );
  };
};
