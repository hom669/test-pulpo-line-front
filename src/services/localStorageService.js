const localStorageKey = 'user';

export default {
  getUser() {
    return JSON.parse(localStorage.getItem(localStorageKey)) || null;
  },
  setUser(user) {
    localStorage.setItem(localStorageKey, JSON.stringify(user));
  },
  eliminarUser() {
    localStorage.removeItem(localStorageKey);
  },
};
