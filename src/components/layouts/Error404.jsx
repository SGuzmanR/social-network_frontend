import { Link } from 'react-router-dom';


export const Error404 = () => {

  return (
    <div className="">
      <div className="">
        <span>404 Error</span>
        <div className="">
          <h1 className="">Algo no salió bien...</h1>
          <p className="">
            La página que intenta abrir no existe. Puede que haya escrito mal la dirección o que la página se haya movido a otra URL. Si cree que se trata de un error, póngase en contacto con servicio técnico al correo support@gmail.com
          </p>
          {/* Utiliza Link para enlazar al inicio */}
          <Link to="/" className="">Volver a la página de inicio</Link>
        </div>
      </div>
    </div>
  )
}
