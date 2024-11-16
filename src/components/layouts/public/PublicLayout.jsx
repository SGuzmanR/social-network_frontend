import { Navigate, Outlet } from "react-router-dom";
import useAuth from '../../../hooks/useAuth';

export const PublicLayout = () => {
  const { auth } = useAuth();

  // Verificación de que `auth` y `auth._id` están definidos
  const isAuthenticated = auth && auth._id;

  return (
    <>
      {/* Contenido Principal */}
      <section className="flex flex-col items-center justify-center h-[90vh]">
        {!isAuthenticated ? (
          <Outlet />
        ) : (
          <Navigate to="/rsocial" />
        )}
      </section>
    </>
  );
};
