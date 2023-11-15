<template>
  <v-sheet class="bg-deep-purple pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field v-model="email" :readonly="loading" :rules="[required, emailRule]" class="mb-2" clearable
          label="Email"></v-text-field>

        <v-text-field v-model="password" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'" :readonly="loading" :rules="[required, minLength]" clearable
          label="Password" placeholder="Enter your password"
          @click:append-inner="togglePasswordVisibility"></v-text-field>

        <v-alert v-if="errorValidation" variant="outlined" type="warning" prominent border="top" closable class="mt-4">
          {{ errorValidation }}
        </v-alert>
        <v-btn :disabled="!form" :loading="loading" block color="purple-darken-4" size="large" type="submit"
          variant="elevated" class="mt-4">
          Login
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script setup>
import AuthService from '@/services/auth.service';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setCookie, setObjectCookie } from '@/utils/cookieUtils.js';
import localStorageService from '@/services/localStorageService';

const store = useStore();

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const form = ref(false);
const loading = ref(false);
const errorValidation = ref('');

const onSubmit = () => {
  if (!form.value) return;

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
  login();
};

const required = (v) => {
  return !!v || 'Campo Requerido';
};
const minLength = (v) => (v && v.length >= 8) || 'Password must be at least 8 characters';
const emailRule = (v) => /.+@.+\..+/.test(v) || 'Ingrese una Dirección de Email Correcta';

const login = async () => {
  try {
    const userLogin = await AuthService.login(email.value, password.value);
    setCookie('sessionId', userLogin.authorization.token);
    localStorageService.setUser(userLogin.user);
    store.commit('setRefreshComponent', true);
    redirectToCurrencyConverter();

    // Aquí se manejara la respuesta del servicio, por ejemplo, almacenar el token en el almacenamiento local.
    // se redirigira al usuario o realizar otras acciones según tu lógica de aplicación.

  } catch (error) {
    console.log(error);
    // Aquí se maneja el error, por ejemplo, mostrar un mensaje al usuario.
    errorValidation.value = "Usario y/o Contraseña Incorrectos";
    setObjectCookie('userConnect', null);
    setCookie('sessionId', null);
  }
};

const redirectToCurrencyConverter = () => {
  // Aquí se implementara la lógica para redirigir a la página de registro.
  router.push('/currency-converter');
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

onMounted(() => {
  store.commit('setTab', 1);
  localStorageService.setUser(null);
});

</script>
