import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  // Devuelve un useContext donde cargamos el contexto del AuthContext para tener acceso a los estados y usarlos en los componentes que necesitemos
  return useContext(AuthContext);
};

export default useAuth;