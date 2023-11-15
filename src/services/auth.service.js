import axios from 'axios';
import { API_ENDPOINT } from '@/config';

class AuthService {

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
