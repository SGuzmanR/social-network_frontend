import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';
import { Global } from '../../helpers/Global';
import { useLocation } from 'react-router-dom';

export const MyPublications = () => {
  const { auth } = useAuth();
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const location = useLocation(); // Para detectar redirección

  useEffect(() => {
    if (location.state && location.state.newPublication) {
      // Si venimos de la redirección con nueva publicación, recargar las publicaciones
      getPublications(1, true);
    } else {
      getPublications(1, false);
    }
  }, [location.state]);

  const getPublications = async (nextPage = 1, reset = false) => {
    const token = localStorage.getItem('token');
    const request = await fetch(`${Global.url}publication/publications-user/${auth._id}/${nextPage}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    const data = await request.json();

    if (data.status === 'success') {
      let newPublications = data.publications;

      if (!reset && publications.length >= 1) {
        newPublications = [...publications, ...data.publications];
      };

      setPublications(newPublications);

      if (publications.length >= (data.total - data.publications.length)) {
        setMore(false);
      };

      if (data.pages <= 1) {
        setMore(false);
      };
    };
  };

  return (
    <>
      <header className="">
        <h1 className="font-bold text-3xl">Mis Publicaciones</h1>
      </header>

      <PublicationList
        publications={publications}
        getPublications={getPublications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
        isProfile={true} // Esto es el perfil, no el feed
      />
    </>
  );
};
