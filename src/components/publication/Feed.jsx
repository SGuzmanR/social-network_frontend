import { useState } from 'react';
import { useEffect } from 'react';
import { Global } from '../../helpers/Global';
import { PublicationList } from '../publication/PublicationList';
import useAuth from '../../hooks/useAuth';

export const Feed = () => {
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  const { auth } = useAuth();

  useEffect(() => {
      getPublications(1, false);
  }, []);

  const getPublications = async (nextPage = 1, showNews = false) => {
    if(showNews){
        setPublications([]);
        setPage(1);
        nextPage = 1;
    };

    const request = await fetch(Global.url + "publication/feed/" + nextPage, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    if (data.status == "success") {
      let newPublications = data.publications;

      if (!showNews && publications.length >= 1) {
          newPublications = [...publications, ...data.publications];
      };

      setPublications(newPublications);

      if (!showNews && publications.length >= (data.total - data.publications.length)) {
          setMore(false);
      };

      if(data.pages <= 1){
          setMore(false);
      };
    };
  };

  return (
    <>
      <header className="flex flex-col justify-center items-center gap-2">
        <h2 className="font-bold text-3xl">Bienvenido, {auth.name} {auth.last_name}</h2>
        <button className="mb-6" onClick={() => getPublications(1, true)}>Actualizar Feed</button>
      </header>

      <PublicationList
        publications={publications}
        getPublications={getPublications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
        isProfile={false}
      />
      <br />
    </>
  )
}
