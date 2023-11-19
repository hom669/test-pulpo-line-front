import axios from 'axios';
import Cookies from "js-cookie";
import { API_ENDPOINT } from '@/config';

class AuthService {
  setUserLogged(userLogged) {
    Cookies.set("userLogged", userLogged);
  }

  getUserLogged() {
    return Cookies.get("userLogged");
  }

  isAuthenticated() {
    if (this.getUserLogged) {
      console.log('AQUIII');
      return true;
    }
    return false;
  }

  deleteUserLogged() {
    Cookies.remove('userLogged');
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_ENDPOINT}/login`, {
        email: email,
        password: password,
      });

      // se realizar acciones adicionales aquí, como almacenar el token.

      return response.data;
    } catch (error) {
      return error; // Propagar el error para manejarlo en la capa superior.
    }
  }

  async register(firstName, lastName, email, password) {
    try {
      const response = await axios.post(`${API_ENDPOINT}/register`, {
        name: `${firstName} ${lastName}`,
        email: email,
        password: password,
      });

      // Aquí se manejar la respuesta del backend, por ejemplo, almacenar el token en el almacenamiento local.

      return response.data;
    } catch (error) {
      return error; // Propagar el error para manejarlo en la capa superior.
    }
  }

}

export default new AuthService();
