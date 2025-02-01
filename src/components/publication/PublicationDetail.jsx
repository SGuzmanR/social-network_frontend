import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import avatar from "/img/default_user.png";

export const PublicationDetail = () => {
  const { id } = useParams(); // Obtener el ID de la publicación desde la URL
  const location = useLocation(); // Saber si venimos del Feed o de MyPublications
  const [publication, setPublication] = useState(null);

  useEffect(() => {
    getPublication();
  }, []);

  // Función para obtener la publicación desde la API
  const getPublication = async () => {
    try {
      const token = localStorage.getItem('token');
      const request = await fetch(`${Global.url}publication/show-publication/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (!request.ok) {
        throw new Error('Error al cargar la publicación');
      };

      const data = await request.json();

      // Verificar que la respuesta contenga la publicación y el usuario
      if (data.status === 'success' && data.publication && data.publication.user_id) {
        setPublication(data.publication);
      } else {
        console.error("Error: publicación o usuario no encontrados.");
      };
    } catch (error) {
      console.error('Error en la solicitud de la publicación:', error);
    };
  };

  if (!publication) {
    return <p>Cargando...</p>; // Mostrar mientras se carga la publicación
  };

  // Verificar que los datos del usuario estén disponibles
  const user = publication.user_id || {}; // Si `user_id` no está definido, asigna un objeto vacío
  const userImage = user.image && user.image !== "default.png" ? user.image : avatar; // Imagen predeterminada si no hay imagen
  const userName = `${user.name || "Usuario"} ${user.last_name || ""}`; // Nombre predeterminado si no hay datos
  const userNick = user.nick || "usuario"; // Nick predeterminado si no hay datos

  return (
    <div className="">
      <div className="">
        {/* Verificar y mostrar el avatar del usuario */}
        <img src={userImage} alt="Perfil" className="" />
        <div className="">
          <h2>{userName}</h2>
          <p className="">{userNick}</p>
        </div>
      </div>

      <div className="">
        <div className="">
          <p>{publication.text}</p>
        </div>
        {publication.file && (
          <img src={publication.file} alt="Publicación" className="" />
        )}
      </div>

      <div className="">
        {location.state?.from === 'feed' ? (
          <Link to="/rsocial/feed">
            <button className="">Volver al Feed</button>
          </Link>
        ) : (
          <Link to="/rsocial/mis-publicaciones">
            <button className="">Volver a Mis Publicaciones</button>
          </Link>
        )}
      </div>
    </div>
  );
};
