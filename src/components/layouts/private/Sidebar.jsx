import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import avatar from "../../../assets/img/default_user.png";
import { Global } from "../../../helpers/Global";
import useAuth from "../../../hooks/useAuth";
import { useForm } from '../../../hooks/useForm';

export const Sidebar = () => {
  const { auth, counters, setCounters } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const navigate = useNavigate();

  // useEffect para ocultar el mensaje de éxito después de 1 segundo
  useEffect(() => {
    if (stored === "stored") {
      const timer = setTimeout(() => {
        setStored("not_stored"); // Aquí se cambia el estado a "not_stored" para ocultar el mensaje
      }, 1000);

      // Limpiar el temporizador si el componente se desmonta antes de que se complete
      return () => clearTimeout(timer);
    };
  }, [stored]); // Este efecto solo se ejecuta cuando "stored" cambia

  const savePublication = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Recoger datos del formulario
    let newPublication = form;
    newPublication.user = auth._id;

    // Hacer request para guardar en bd
    const request = await fetch(Global.url + "publication/new-publication", {
      method: "POST",
      body: JSON.stringify(newPublication),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await request.json();

    // Mostrar mensaje de exito o error
    if (data.status == "success") {
      setStored("stored");

      // Actualizar el contador de publicaciones después de crear la publicación
      setCounters((prevCounters) => ({
        ...prevCounters,
        publicationsCount: prevCounters.publicationsCount + 1, // Incrementa en 1
      }));

      // Redirigir a la página de Mis Publicaciones y recargar las publicaciones
      navigate("/rsocial/mis-publicaciones", { state: { newPublication: true } });
    } else {
      setStored("error");
    }

    // Subir imagen
    const fileInput = document.querySelector("#file");

    if(data.status == "success" && fileInput.files[0]){
      const formData = new FormData();
      formData.append("file0", fileInput.files[0]);

      const uploadRequest = await fetch(Global.url + "publication/upload-media/" + data.publicationStored._id, {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": token
        }
      });

      const uploadData = await uploadRequest.json();

      if(uploadData.status !== "success"){
        setStored("error");
      };
    };

     // Resetear el formulario
    const myForm = document.querySelector("#publication-form");
    myForm.reset();
  };

  return (
    <aside className="flex flex-col w-[30vw]">
      <header className="">
        <h1 className="">Hola, <strong>{auth.name}</strong></h1>
      </header>

      <div className="">
        <div className="">
          <div className="">
            <div className="">
              {auth.image != "default_user.png" && (
                <img
                  src={auth.image}
                  className="w-10"
                  alt="Foto de perfil"
                />
              )}
              {auth.image == "default_user.png" && (
                <img
                  src={avatar}
                  className="w-10"
                  alt="Foto de perfil"
                />
              )}
            </div>

            <div className="">
              <Link to={"/rsocial/perfil/"+auth._id}
                className="">
                {auth.name} {auth.last_name}
              </Link>
              <p className=""> @{auth.nick}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="">
              <Link to={"/rsocial/siguiendo/" + auth._id} className="">
                <span className="">Siguiendo</span>
                <span className="">
                  {" "}
                  {counters.followingCount}{" "}
                </span>
              </Link>
            </div>
            <div className="">
              <Link to={"/rsocial/seguidores/" + auth._id} className="">
                <span className="">Seguidores</span>
                <span className="">
                  {" "}
                  {counters.followedCount}{" "}
                </span>
              </Link>
            </div>

            <div className="">
              <Link to={"/rsocial/mis-publicaciones/"} className="">
                <span className="">Publicaciones</span>
                <span className="">
                  {" "}
                  {counters.publicationsCount}{" "}
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="">
          {stored == "stored" &&
            <strong className=""> ¡¡Publicada correctamente!!</strong>
          }

          {stored == "error" &&
            <strong className=""> ¡¡No se ha publicado nada!!</strong>
          }

          <form id="publication-form" className="" autoComplete="off" onSubmit={savePublication}>

            <div className="">
              <label htmlFor="text" className="" >
                ¿Qué quieres compartir hoy?
              </label>
              <textarea
                id="text"
                name="text"
                className=""
                onChange={changed} />
            </div>

            <div className="">
              <label htmlFor="file" className="" >
                Sube imagen a publicación
              </label>
              <input
                type="file"
                id="file"
                name="file0"
                className=""
              />
            </div>

            <input
              type="submit"
              value="Enviar"
              className=""
            />
          </form>
        </div>
      </div>
    </aside>
  );
};
