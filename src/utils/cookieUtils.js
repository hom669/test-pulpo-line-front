// Función para establecer una cookie
function setCookie(name, value) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);
  const cookieValue = escape(value) + `; expires=${expirationDate.toUTCString()}`;
  document.cookie = `${name}=${cookieValue}`;
}

// Función para obtener el valor de una cookie por su nombre
function getCookie(cookieName) {
  // Obtener todas las cookies presentes en el documento
  const cookies = document.cookie.split(';');

  // Buscar la cookie con el nombre específico
  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      // Verificar si la cookie tiene el formato correcto
      if (cookie.startsWith(`${cookieName}=`)) {
          // Devolver el valor de la cookie
          return cookie.substring(cookieName.length + 1);
      }
  }

  // Si la cookie no se encuentra, devolver null o un valor predeterminado
  return null;
}

function setObjectCookie(name, object) {
  const jsonString = JSON.stringify(object);
  setCookie(name, jsonString);
}

// Función para obtener un objeto desde una cookie (parseando JSON)
function getObjectCookie(name) {
  const jsonString = getCookie(name);
  return jsonString ? JSON.parse(jsonString) : null;
}

// Exportar las funciones para usarlas en otros archivos
export { setCookie, getCookie, setObjectCookie, getObjectCookie };
