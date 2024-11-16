import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { NavLink, useNavigate } from "react-router-dom";
import { Global } from '../../helpers/Global';
import Swal from 'sweetalert2';

export const Register = () => {
  // Usar el hook personalizado useForm para cargar los datos del formulario
  const { form, changed } = useForm({});

  // Estado para mostrar el resultado del registro del user en la BD
  const [ saved, setSaved ] = useState("not sended");

  // Hook para redirigir
  const navigate = useNavigate();

  // Método Guardar un usuario en la BD
  const saveUser = async (e) => {

    // Prevenir que se actualice la pantalla
    e.preventDefault();

    // Obtener los datos del formulario
    let newUser = form;

    // Petición a la API (Backend) para guardar el usuario en la BD
    const request = await fetch(Global.url + 'user/register', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Obtener la información retornada por el backend
    const data = await request.json();

    // Verificar si el estado de la respuesta es "created" seteamos la variable de estado saved con "saved"
    if(request.status === 201 && data.status === "created"){
      setSaved("saved");
      // Mostrar el modal de éxito
      Swal.fire({
        title: data.message,
        icon: 'success',
        confirmButtonText: 'Continuar',
      }).then(() => {
        // Redirigir después de cerrar el modal
        navigate('/login');
      });
    } else {
      setSaved("error");
      // Mostrar el modal de error
      Swal.fire({
        title: data.message || "¡Error en el registro!",
        icon: 'error',
        confirmButtonText: 'Intentar nuevamente',
      });
    };
  };

  return (
    <>
      <header className="w-full flex justify-center items-center">
          <div>
            Logo
          </div>
          <h1 className="font-bold text-2xl">Registro</h1>
        </header>

      {/* Formulario de Registro*/}
      <div className="content__posts">
        <div className="form-style">
          {/* Respuesta de usuario registrado */}
          {saved == "saved" ? (
            <strong className="alert alert-success">¡Usuario registrado correctamente!</strong>
          ) : ''}
          {saved == "error" ? (
            <strong className="alert alert-danger">¡El Usuario no se ha registrado correctamente!</strong>
          ) : ''}


          <form className="register-form" onSubmit={saveUser}>
            <div className="form-group">
              <label htmlFor="name">Nombres</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                onChange={changed}
                value={form.name || ''}
                autoComplete="given-name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Apellidos</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required
                onChange={changed}
                value={form.last_name || ''}
                autoComplete="family-name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="nick">Usuario</label>
              <input
                type="text"
                id="nick"
                name="nick"
                required
                onChange={changed}
                value={form.nick || ''}
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                onChange={changed}
                value={form.email || ''}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Biografía</label>
              <input
                type="text"
                id="bio"
                name="bio"
                onChange={changed}
                value={form.bio || ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                onChange={changed}
                value={form.password || ''}
                autoComplete="new-password"
              />
            </div>

            <input
              type="submit"
              value="Regístrate"
              className="cursor-pointer"
            />
          </form>
        </div>

        <div>
          <h1>O deseas
            <NavLink to='/login' className="">
              <span className=""> Iniciar Sesión</span>
            </NavLink>
          </h1>
        </div>
      </div>
    </>
  )
}
