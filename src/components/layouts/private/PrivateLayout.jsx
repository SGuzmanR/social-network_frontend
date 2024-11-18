import { Navigate, Outlet } from "react-router-dom";
import { HeaderPriv } from "./HeaderPriv"
import { Sidebar } from "./Sidebar"
import useAuth from '../../../hooks/useAuth';

export const PrivateLayout = () => {

  const { auth, loading } = useAuth();

  if (loading) {
    return <h1 className="absolute inset-0 flex items-center justify-center text-xl text-gray-800 text-center h-screen">
      Cargando...
    </h1>
  } else {
    return (
      <>
        <main className="screen-max-width">
          <div className="flex flex-col w-full max-[1260px]:px-10">
            {/* Cabecera y navegación*/}
            <HeaderPriv />
            
            {/* Modal Publicar   */}
            <Sidebar />

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
              </div>
            </section>
          </div>
        </main>
      </>
    );
  };
};
