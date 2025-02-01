import PropTypes from 'prop-types';
import avatar from '/img/default_user.png';
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";

export const UserList = ({ users, getUsers, following, setFollowing, more, page, setPage, setCounters }) => {
  // Variable para almacenar el token para las peticiones a realizar en este componente
  const token = localStorage.getItem("token");

  // Se recibe la información desde el Contexto a través del hook useAuth
  const { auth } = useAuth();

  // Método para gestionar la paginación
  const nextPage = () => {
    let next = page + 1;
    setPage(next);

    // Le enviamos el número de página actual al método getUsers
    getUsers(next);
  };

  // Método para seguir a un usuario
  const follow = async (userId) => {
    // Petición Ajax al Backend para seguir a un usuario
    const request = await fetch(Global.url + "follow/follow", {
      method: "POST",
      body: JSON.stringify({ followed_user: userId }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    if (data.status == "success") {
      // Actualizar el estado de following, agregando al nuevo usuario seguido al array de following
      setFollowing([...following, userId]);

      // Actualizar el contador de "siguiendo" en el contexto
      setCounters(prev => ({
        ...prev,
        followingCount: prev.followingCount + 1
      }));
    };
  };

  // Método para dejar de seguir a un usuario
  const unfollow = async (userId) => {
    // Petición Ajax al Backend para dejar de seguir a un usuario
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    // Actualizar el estado de unfollow para eliminar el follow
    if (data.status == "success") {
      // Actualizar el estado de following, filtrando los datos para eliminar el antiguo follow (userId)
      let filterFollowings = following.filter(followingUserId => userId !== followingUserId);

      setFollowing(filterFollowings);

      // Actualizar el contador de "seguidores" en el contexto
      setCounters(prev => ({
        ...prev,
        followingCount: prev.followingCount - 1
      }));
    };
  };

  // Filtrar usuarios duplicados por _id
  const uniqueUsers = [...new Map(users.map(user => [user._id, user])).values()];

  return (
    <>
      <div className="grid w-full h-full grid-cols-4 max-[1260px]:px-10">
        {uniqueUsers.map((user) => (
          // Comprobar que user no es undefined
          user && (
          <article className="" key={user._id}>
            <div className="">
              <div className="">
                <div className="">
                  <div className="">
                    {user.image && user.image !== "/default_user.png" ? (
                      <img src={user.image} className="rounded-full w-40" alt="Foto de perfil" />
                    ) : (
                      <img src={avatar} className="rounded-full w-40" alt="Foto de perfil" />
                    )}
                  </div>
                </div>
              </div>

              <div className="">
                <div className="flex flex-col">
                  <a href="#" className="">{user.name} {user.last_name}</a>
                  <a href="#" className="">{user.created_at}</a>
                </div>
                <h4 className="font-light text-sm">{user.bio}</h4>
              </div>
            </div>
            {/* Con esta condición, si se muestra el usuario logueado en la lista, no muestra los botones de seguir o dejar de seguir*/}
            {user._id !== auth._id &&
              <div className="">
                {!following?.includes(user._id) &&
                  <button className=""
                    onClick={() => follow(user._id)} >
                    Seguir
                  </button>
                }
                {/* Si el usuario ya está en la lista following, muestra "Dejar de Seguir" */}
                {following?.includes(user._id) &&
                  <button className=""
                    onClick={() => unfollow(user._id)} >
                    Dejar de Seguir
                  </button>
                }
              </div>
            }
          </article>
          )
        ))}
        <br />
      </div>

      {more && (
        <div className="">
          <button className="" onClick={nextPage}>
            Ver más personas
          </button>
        </div>
      )}
    </>
  );
};

// Validación de props usando PropTypes
UserList.propTypes = {
  users: PropTypes.array.isRequired,
  getUsers: PropTypes.func,
  following: PropTypes.array.isRequired,
  setFollowing: PropTypes.func,
  more: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func,
  setCounters: PropTypes.func
};