import axios from 'axios';
import { API_ENDPOINT } from '@/config';
import { getCookie } from '@/utils/cookieUtils.js';
import localStorageService from '@/services/localStorageService';
import authService from './auth.service';

class CurrencyConverterService {

  getHeadersWithToken() {
    // Obtener el token de tu sistema de autenticación (se obtenerlo de tu sistema de gestión de estado, cookies, etc.)
    const token = getCookie('sessionId');

    // Configurar las cabeceras con el token JWT
    const headers = {
        Authorization: `Bearer ${token}`
    };

    return headers;
  }

  async getCountries() {
    try {
      const headers = this.getHeadersWithToken();

      const response = await axios.get(`${API_ENDPOINT}/countries`, {
        headers: headers
      });

      const convertResponse = response.data;

      // se realizar acciones adicionales aquí, como almacenar el token.

      return convertResponse;
    } catch (error) {
      console.error('Error during obtain countries', error);
      throw error; // Propagar el error para manejarlo en la capa superior.
    }
  }

  async currencyConvert(amount, fromCountry, toCountry) {
    try {

      const headers = this.getHeadersWithToken();
      const userConnect = authService.getUserLogged();
      const amountFormat = parseInt(amount.replace(/,/g, ''), 10);

      const response = await axios.post(`${API_ENDPOINT}/currency-convert`, {
        amount: amountFormat,
        fromCountry: fromCountry,
        toCountry: toCountry,
        userConnect: userConnect
      }, {
        headers: headers
      });

      const convertResponse = response.data;

      // se realizar acciones adicionales aquí, como almacenar el token.

      return convertResponse;
    } catch (error) {
      console.error('Error during obtain countries', error);
      throw error; // Propagar el error para manejarlo en la capa superior.
    }
  }

}

export default new CurrencyConverterService();
