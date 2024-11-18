import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { NavLink, useNavigate } from "react-router-dom";
import { Global } from '../../helpers/Global';
import Swal from 'sweetalert2';

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <>
      <div className="flex flex-col gap-4 justify-between">
        <header className="w-full flex justify-center items-center flex-col gap-2">
          <div>
            Logo
          </div>
          <h1 className="font-bold text-3xl pb-6">Registrarse</h1>
        </header>

        {/* Formulario de Login*/}
        <div className="">
          <div className="">
            {/* Respuesta de usuario registrado */}
          {saved == "saved" ? (
            <strong className="alert alert-success">¡Usuario registrado correctamente!</strong>
          ) : ''}
          {saved == "error" ? (
            <strong className="alert alert-danger">¡El Usuario no se ha registrado correctamente!</strong>
          ) : ''}

            <form className="flex flex-col items-start w-full gap-6" onSubmit={saveUser}>
              <div className="flex flex-col gap-3 items-start justify-center w-full">
                <label htmlFor="name">Nombres:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  onChange={changed}
                  value={form.name || ''}
                  autoComplete="given-name"
                  className="py-1 px-2 border-b-2 outline-none w-full"
                  placeholder="Walter Hartwell"
                />
              </div>

              <div className="flex flex-col gap-3 items-start justify-center w-full">
                <label htmlFor="last_name">Apellidos:</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  required
                  onChange={changed}
                  value={form.last_name || ''}
                  autoComplete="family-name"
                  className="py-1 px-2 border-b-2 outline-none w-full"
                  placeholder="White"
                />
              </div>

              <div className="flex flex-col gap-3 items-start justify-center w-full">
                <label htmlFor="nick">Usuario:</label>
                <input
                  type="text"
                  id="nick"
                  name="nick"
                  required
                  onChange={changed}
                  value={form.nick || ''}
                  autoComplete="username"
                  className="py-1 px-2 border-b-2 outline-none w-full"
                  placeholder="@heisenberg"
                />
              </div>

              <div className="flex flex-col gap-3 items-start justify-center w-full">
                <label htmlFor="email">Correo Electrónico:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  onChange={changed}
                  value={form.email || ''}
                  autoComplete="email"
                  className="py-1 px-2 border-b-2 outline-none w-full"
                  placeholder="email@example.com"
                />
              </div>

              <div className="flex flex-col gap-3 items-start justify-center w-full">
                <label htmlFor="bio">Biografía:</label>
                <input
                  type="text"
                  id="bio"
                  name="bio"
                  onChange={changed}
                  value={form.bio || ''}
                  className="py-1 px-2 border-b-2 outline-none w-full"
                  placeholder="A skilled chemist who co-founded a technology firm before he accepted a buy-out from his partners..."
                />
              </div>

              <div className="flex flex-row gap-3 items-center justify-start">
                <label htmlFor="password">Contraseña:</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={form.password || ''}
                  onChange={changed}
                  autoComplete="new-password"
                  className="py-1 px-2 border-b-2 outline-none w-full"
                  placeholder={showPassword ? '3828Piermont' : "••••••••••••"}
                />
                <div className="flex gap-1 items-center justify-center text-center">
                  <input id="showPassword" type="checkbox" onClick={togglePasswordVisibility} className="size-7" /> 
                  <label htmlFor="showPassword" className="select-none text-sm">Mostrar Contraseña</label>
                </div>
              </div>

              <div className="flex items-center w-full justify-center">
                <input
                  type="submit"
                  value="Registrarte"
                  className="cursor-pointer bg-blue-500 px-6 py-2 rounded-xl text-white hover:bg-blue-600"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <span className="text-sm">O deseas mejor 
            <NavLink to='/login' className="">
              {" "}<span className="hover:underline hover:text-gray-600">Iniciar Sesión</span>
            </NavLink>
          </span>
        </div>
      </div>
    </>
  )
}
