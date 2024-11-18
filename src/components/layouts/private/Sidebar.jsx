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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Function to toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <section>
      <button
        type="button"
        className="fixed bg-blue-600 p-2 rounded-full text-white bottom-0 right-0 mr-5 mb-5 hover:shadow-lg hover:bg-blue-800 transition-all cursor-pointer z-10"
        onClick={toggleModal}
      >
        <svg
          width="40px"
          height="40px"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="p-1"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
            fill="#fff"
          />
        </svg>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20" onClick={toggleModal}>
          <div className="bg-white px-10 py-12 rounded-3xl shadow-lg relative" 
            onClick={(e) => e.stopPropagation()} // Prevent the modal from closing when clicking inside it
          >
            <button className="absolute top-2 right-4 text-4xl font-bold" onClick={toggleModal}>
              &times;
            </button>

            <div className="flex flex-col items-start justify-center gap-4">
              <header className="text-2xl mt-2">
                <h1 className="">Hola, <strong>{auth.name}</strong></h1>
              </header>

              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-row justify-between items-center gap-4">
                  <div className="flex flex-row gap-3 items-center justify-start">
                    <div>
                      {auth.image != "default_user.png" && (
                        <img
                          src={auth.image}
                          className="w-14"
                          alt="Foto de perfil"
                        />
                      )}
                      {auth.image == "default_user.png" && (
                        <img
                          src={avatar}
                          className="w-14"
                          alt="Foto de perfil"
                        />
                      )}
                    </div>

                    <div className="">
                      <Link to={"/rsocial/perfil/"+auth._id}
                        className="font-semibold">
                        {auth.name} {auth.last_name}
                      </Link>
                      <Link to={"/rsocial/perfil/"+auth._id}>
                        <p className="text-sm text-gray-600 hover:underline"> @{auth.nick}</p>
                      </Link>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="">
                      <Link to={"/rsocial/mis-publicaciones/"} className="flex flex-row-reverse gap-2 font-semibold">
                        <span className="">Publicaciones</span>
                        <span className="">
                          {" "}
                          {counters.publicationsCount}{" "}
                        </span>
                      </Link>
                    </div>

                    <div className="">
                      <Link to={"/rsocial/seguidores/" + auth._id} className="flex flex-row-reverse gap-2 font-semibold">
                        <span className="">Seguidores</span>
                        <span className="">
                          {" "}
                          {counters.followedCount}{" "}
                        </span>
                      </Link>
                    </div>

                    <div className="">
                      <Link to={"/rsocial/siguiendo/" + auth._id} className="flex flex-row-reverse gap-2 font-semibold">
                        <span className="">Siguiendo</span>
                        <span className="">
                          {" "}
                          {counters.followingCount}{" "}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="">
                  {/* {stored == "stored" &&
                    <strong className=""> ¡¡Publicada correctamente!!</strong>
                  }

                  {stored == "error" &&
                    <strong className=""> ¡¡No se ha publicado nada!!</strong>
                  } */}

                  <form id="publication-form" className="flex flex-col gap-3 justify-center items-center w-full" autoComplete="off" onSubmit={savePublication}>
                    <div className="flex flex-col w-full justify-end gap-2">
                      <label htmlFor="text" className="" >
                        ¿Qué quieres compartir hoy?
                      </label>
                      <textarea
                        id="text"
                        name="text"
                        className="outline-none border-b-2 resize-none overflow-hidden w-full min-h-[100px] h-auto"
                        onChange={changed} />
                    </div>

                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-white rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Clic para cargar</span> o arrastre y suelte</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, JPEG or GIF</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div> 

                    <div className="flex items-center w-full justify-center">
                      <input
                        type="submit"
                        value="Publicar"
                        className="cursor-pointer bg-blue-500 px-6 py-2 rounded-xl text-white hover:bg-blue-600 mt-2"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
