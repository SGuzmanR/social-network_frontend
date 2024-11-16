import PropTypes from 'prop-types';
import { Global } from '../../helpers/Global';
import { Link, useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/img/default_user.png';
import ReactTimeAgo from "react-time-ago";
import Swal from 'sweetalert2';

export const PublicationList = ({publications, getPublications, page, setPage, more, setMore, isProfile = false}) => {
  const { auth, setCounters } = useAuth();
  const navigate = useNavigate();

  // Función para manejar la redirección al detalle de la publicación
  const handleClick = (publicationId) => {
    // Redirigir al detalle de la publicación, pasando información del origen (Feed o MyPublications)
    const from = isProfile ? 'myPublications' : 'feed';
    navigate(`/rsocial/publicacion/${publicationId}`, { state: { from } });
  };

  // Función para cargar la siguiente página de publicaciones
  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getPublications(next);
  };

  // Función para eliminar una publicación con confirmación de SweetAlert
  const deletePublication = async (publicationId) => {
    // Modal de confirmación antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Si se confirma, realiza la petición para eliminar la publicación
        const request = await fetch(Global.url + "publication/delete-publication/" + publicationId, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
          }
        });

        const data = await request.json();

        // Mostrar mensaje de éxito o error
        if (data.status === "success") {
          Swal.fire(
            '¡Eliminada!',
            'La publicación ha sido eliminada.',
            'success'
          );
          // Actualizar las publicaciones
          setPage(1);
          setMore(true);
          getPublications(1, true);

          // Actualizar el contador de publicaciones después de eliminar la publicación
          setCounters((prevCounters) => ({
            ...prevCounters,
            publicationsCount: prevCounters.publicationsCount - 1, // Decrementa en 1
          }));
        } else {
          Swal.fire(
            'Error',
            'Hubo un error al eliminar la publicación.',
            'error'
          );
        };
      };
    });
  };

  return (
    <>
      <div className="content__posts">
        {publications.map(publication => {
          // Verificar que publication y publication.user no sean undefined
          if (!publication || !publication.user_id) {
            return null; // Saltar publicaciones sin usuario
          };

          return (
            <article className="posts__post" key={publication._id}
              onClick={() => handleClick(publication._id)} // Maneja el clic en la publicación
              style={{ cursor: 'pointer' }} // Cambiar el cursor a pointer para mostrar que es clicable
            >
              <div className="post__container">
                <div className="post__image-user">
                  <Link to={`/rsocial/perfil/${publication.user_id._id}`} className="post__image-link">
                    {publication.user_id.image !== "default_user.png" && (
                      <img src={publication.user_id.image} className="post__user-image" alt="Foto de perfil" />
                    )}
                    {publication.user_id.image === "default_user.png" && (
                      <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                    )}
                  </Link>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <Link to={`/rsocial/perfil/${publication.user_id._id}`} className="user-info__name">
                      {publication.user_id.name && publication.user_id.last_name ? (
                        publication.user_id.name + " " + publication.user_id.last_name
                        ) : "Usuario Desconocido"}
                    </Link>
                    <span className="user-info__divider"> | </span>
                    <span className="user-info__create-date">
                      <ReactTimeAgo date={new Date(publication.created_at).getTime()} locale="es-ES" />
                    </span>
                  </div>

                  <h4 className="post__content">{publication.text}</h4>

                  {publication.file && (
                    <img src={publication.file} alt="Imagen de publicación" className="post__image-publication" />
                  )}
                </div>
              </div>

              {/* Mostrar botón para eliminar si el usuario es el dueño de la publicación */}
              {auth._id === publication.user_id._id &&
                <div className="post__buttons">
                  <button onClick={() => deletePublication(publication._id)} className="post__button">Delete</button>
                </div>
              }
            </article>
          );
        })};
      </div>

      {/* Si no estamos en el perfil, mostrar el botón de "Ver más publicaciones" */}
      {!isProfile && more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver más publicaciones
          </button>
        </div>
      )}

      {/* Si estamos en el perfil, mostrar un botón para volver al feed */}
      {isProfile && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={() => navigate('/rsocial/feed')}>
            Volver al Feed
          </button>
        </div>
      )}
    </>
  )
};

PublicationList.propTypes = {
  publications: PropTypes.array.isRequired,
  getPublications: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  more: PropTypes.bool.isRequired,
  setMore: PropTypes.func.isRequired,
  isProfile: PropTypes.bool
};
