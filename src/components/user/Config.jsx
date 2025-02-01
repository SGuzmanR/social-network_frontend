import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import avatar from '/img/default_user.png';
import { SerializeForm } from "../../helpers/SerializeForm";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export const Config = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Se recibe la información desde el Contexto a través del hook useAuth
  const { auth, setAuth } = useAuth();

  // Estado para mostrar resultado del registro del user
  const [saved, setSaved] = useState("not_saved");

  // Hook para redirigir
  const navigate = useNavigate();

  // Función para actualizar el usuario
  const updateUser = async (e) => {

    // Prevenir que se actualice la pantalla
    e.preventDefault();

    // Variable para almacenar el token para las peticiones a realizar en este componente
    const token = localStorage.getItem("token");

    // Obtener los datos del formulario
    let newDataUser = SerializeForm(e.target);

    // Borrar file0 porque no lo vamos a actualizar por acá
    delete newDataUser.file0;

    try {
      // Actualizar el usuario modificado en la BD con una petición Ajax
      const userUpdateResponse = await fetch(`${Global.url}user/update`, {
        method: "PUT",
        body: JSON.stringify(newDataUser),
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      // Obtener la información retornada por la request
      const userData = await userUpdateResponse.json();

      if (userData?.status === "success" && userData.user) {

        // Eliminar del objeto recibido la contraseña
        delete userData.user.password;

        // Actualizar en el Contexto los datos del usuario modificado
        setAuth(userData.user);
        setSaved("saved");

        // Seleccionar el elemento del formulario donde se va a subir el archivo del avatar
        const fileInput = document.querySelector("#file-avatar");
        if (fileInput.files[0]) {
          await uploadAvatar(fileInput.files[0], token);
        }

        // Mostrar modal de éxito con el mensaje del backend o un mensaje por defecto
        const successMessage = userData?.message || '¡Usuario actualizado correctamente!';

        Swal.fire({
          title: successMessage,
          icon: 'success',
          confirmButtonText: 'Continuar',
        }).then(() => {
          // Redirigir después de cerrar el modal
          navigate('/login');
        });

      } else {
        setSaved("error");

        // Mostrar modal de error con el mensaje del backend o un mensaje por defecto
        const errorMessage = userData?.message || '¡El usuario no se ha actualizado!';

        // Mostrar modal de error
        Swal.fire({
          title: errorMessage,
          icon: 'error',
          confirmButtonText: 'Intentar nuevamente',
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setSaved("error");

      // Mostrar modal de error con el mensaje del backend o un mensaje por defecto
      const errorMessage = error.response?.data?.message || '¡Error al actualizar el usuario!';

      // Mostrar modal de error
      Swal.fire({
        title: errorMessage,
        icon: 'error',
        confirmButtonText: 'Intentar nuevamente',
      });
    }; 
  };

  // Función para actualizar el avatar del usuario
  const uploadAvatar = async (file, token) => {
    try {
      // Obtener el archivo a subir
      const formData = new FormData();
      formData.append('file0', file);

      // Petición para enviar el archivo a la api del Backend y guardarla
      const uploadResponse = await fetch(`${Global.url}user/upload-avatar`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": token
        }
      });

      // Obtener la información retornada por la request
      const uploadData = await uploadResponse.json();

      if (uploadData.status === "success" && uploadData.user) {
        // Eliminar del objeto recibido la contraseña
        delete uploadData.user.password;

        // Actualizar en el Contexto los datos del usuario modificado
        setAuth(uploadData.user);
        setSaved("saved");
      } else {
        setSaved("error");
      };
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setSaved("error");

      // Mostrar modal de error con el mensaje del backend o un mensaje por defecto
      const errorMessage = error.response?.data?.message || '¡Error al subir el avatar!';

      Swal.fire({
        title: errorMessage,
        icon: 'error',
        confirmButtonText: 'Intentar nuevamente',
      });
    };
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <>
      <header className="">
        <h1 className="font-bold text-3xl">Editar Perfil</h1>
      </header>
      <div className="">
        <div className="">
          {/* Respuestas de usuario registrado*/}
          {saved === "saved" ? (
            <strong className="">¡Usuario actualizado correctamente!</strong>
          ) : ''}
          {saved === "error" ? (
            <strong className="">¡El usuario no se ha actualizado!</strong>
          ) : ''}

          <form className="" onSubmit={updateUser}>
            <div className="">
              <label htmlFor="name">Nombres</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                autoComplete="given-name"
                defaultValue={auth.name}
              />
            </div>

            <div className="">
              <label htmlFor="last_name">Apellidos</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required
                autoComplete="family-name"
                defaultValue={auth.last_name}
              />
            </div>

            <div className="">
              <label htmlFor="nick">Nick</label>
              <input
                type="text"
                id="nick"
                name="nick"
                required
                autoComplete="nickname"
                defaultValue={auth.nick}
              />
            </div>

            <div className="">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                autoComplete="off"
                defaultValue={auth.bio}
              />
            </div>

            <div className="">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                defaultValue={auth.email}
              />
            </div>

            <div className="">
              <label htmlFor="password">Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                autoComplete="new-password"
              />
              <div>
                <input type="checkbox" onClick={togglePasswordVisibility} /> 
                <label htmlFor="showPassword">Mostrar Contraseña</label>
              </div>
            </div>

            <div className="">
              <label htmlFor="file">Avatar</label>
              <div className="">
                <div className="">
                  {auth.image !== "default_user.png" ? (
                    <img src={auth.image} className="rounded-full w-12" alt="Foto de perfil" />
                  ) : (
                    <img src={avatar} className="rounded-full w-12" alt="Foto de perfil" />
                  )}
                </div>
              </div>
              <br/>
              <input type="file" name="file0" id="file-avatar" autoComplete="file"/>
            </div>
            <input type="submit" value="Editar" className="" />
          </form>
        </div>
      </div>
    </>
  )
}
