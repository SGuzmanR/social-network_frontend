import { Global } from "../../helpers/Global";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { UserList } from "../user/UserList";
import { useParams } from "react-router-dom";

export const Followers = () => {
  // Variable para almacenar el token para las peticiones a realizar en este componente
  const token = localStorage.getItem("token");

  // Se recibe la información desde el Contexto a través del hook useAuth
  const { auth } = useAuth();

  // Estado para guardar el array de usuarios que sigues recibido desde el backend
  const [users, setUsers] = useState([]);

  // Estado para guardar la página actual y se va actualizando al hacer clic en el botón mostrar más
  const [page, setPage] = useState(1);

  // Estado para gestionar la visibilidad del botón "Ver más personas"
  const [more, setMore] = useState(true);

  // Estado para verificar si yo sigo a un usuario, para configurar la visualización de los botones "Seguir" y "Dejar de seguir"
  const [following, setFollowing] = useState([]);

  // Usar desde el react-router-dom el Hook useParams para tener acceso a los parámetros que vienen en la url
  const params = useParams();

  // Hook para ejecutar el método getUsers, se ejecuta la primera vez que se carga este componente
  useEffect(() => {
    getUsers(1);
  }, []);

  // Método para hacer la petición al Backend y obtener los usuarios que sigues
  const getUsers = async (nextPaginate = 1) => {
    try {
      // Obtener el userId desde la url
      const userId = params.userId;

      // Petición al Backend para obtener los usuarios que sigues desde la BD del API Backend - page actualiza la pagina a mostrar
      const response = await fetch(
        Global.url + "follow/followers/" + userId + "/" + nextPaginate,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      // Obtener la información retornada por la request
      const data = await response.json();

      // Recorrer y limpiar follows para quedarme con followed
      let cleanUsers = [];
      data.follows.forEach((follow) => {
        cleanUsers = [...cleanUsers, follow.following_user];
      });
      data.users = cleanUsers;

      // Usar la variable de estado para asignar el array de usuarios que sigues recibido
      if (data.users && data.status === "success") {
        let newUsers = data.users;

        if (users.length >= 1) {
          newUsers = [...users, ...data.users];
        }
        setUsers(newUsers);

        // Asignamos a la variable de estado following, el array de seguidores que me devolvió el backend
        setFollowing(data.users_following);

        // Paginación. Comprobar si existen más usuarios para mostrar en la respuesta de la petición
        // (data.totalDocs - 5) porque el listado de usuarios ya tiene 5 usuarios en pantalla que no está contabilizando en user.length
        if (users.length >= data.total - 5) {
          setMore(false);
        }
      }
    } catch (error) {
      console.error("Error en la petición al backend:", error);
    };
  };

  return (
    <>
      <header className="">
        <h1 className="">
          Seguidores de {auth.name} {auth.last_name}{" "}
        </h1>
      </header>
      {/* Si no tienes seguidores, mostrar el mensaje */}
      {users.length === 0 ? (
        <div className="">
          <h3>Aún no tienes seguidores en la red social.</h3>
        </div>
      ) : (
        <UserList
          users={users}
          getUsers={getUsers}
          following={following}
          setFollowing={setFollowing}
          more={more}
          page={page}
          setPage={setPage}
        />
      )}
    </>
  );
};
