<template>
  <v-sheet class="bg-deep-purple pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field
          v-model="firstName"
          :readonly="loading"
          :rules="firstNameRules"
          class="mb-2"
          clearable
          label="Nombres"
        ></v-text-field>

        <v-text-field
          v-model="lastName"
          :readonly="loading"
          :rules="lastNameRules"
          class="mb-2"
          clearable
          label="Apellidos"
        ></v-text-field>

        <v-text-field
          v-model="email"
          :readonly="loading"
          :rules="emailRules"
          class="mb-2"
          clearable
          label="Email"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :readonly="loading"
          :rules="passwordRules"
          clearable
          label="Password"
          placeholder="Enter your password"
          @click:append-inner="togglePasswordVisibility"
        ></v-text-field>

        <v-alert v-if="errorMessage" variant="outlined" type="warning" prominent border="top" closable class="mt-4">
          {{ errorMessage }}
        </v-alert>

        <v-btn
          :disabled="!form"
          :loading="loading"
          block
          color="purple-darken-4"
          size="large"
          type="submit"
          variant="elevated"
          class="mt-4"
        >
          Registrarse
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script setup>
import AuthService from "@/services/auth.service";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { setCookie, setObjectCookie } from "@/utils/cookieUtils.js";
import localStorageService from "@/services/localStorageService";

const router = useRouter();

const store = useStore();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");

const form = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');

const onSubmit = () => {
  if (!form.value) return;

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
  register();
};

const firstNameRules = computed(() => [
  (v) => !!v || "First name is required",
  (v) => (v && v.length <= 255) || "Max 255 characters",
]);

const lastNameRules = computed(() => [
  (v) => !!v || "Last name is required",
  (v) => (v && v.length <= 255) || "Max 255 characters",
]);

const emailRules = computed(() => [
  (v) => !!v || "Email is required",
  (v) => (v && v.length <= 255) || "Max 255 characters",
  (v) => /.+@.+\..+/.test(v) || "Enter a valid email",
]);

const passwordRules = computed(() => [
  (v) => !!v || "Password is required",
  (v) => (v && v.length >= 8) || "Min 8 characters",
]);

const register = async () => {
  try {
    // Aquí se manejar la respuesta del servicio, por ejemplo, almacenar el token en el almacenamiento local.
    // se redirigira al usuario o realizar otras acciones según tu lógica de aplicación.
    const register = await AuthService.register(
      firstName.value,
      lastName.value,
      email.value,
      password.value
    );
    if (!register.response.data.errors) {
      login();
    } else {
      // Aquí se manejar el error, por ejemplo, mostrar un mensaje al usuario.
      errorMessage.value = register.response.data.message;
    }

  } catch (error) {
    console.error(error);
  }
};

const login = async () => {
  try {
    // Aquí se manejara la respuesta del servicio, por ejemplo, almacenar el token en el almacenamiento local.
    // se redirigira al usuario o realizar otras acciones según tu lógica de aplicación.
    const userLogin = await AuthService.login(email.value, password.value);
    setCookie("sessionId", userLogin.authorization.token);
    localStorageService.setUser(userLogin.user);
    store.commit("setRefreshComponent", true);
    router.push("/currency-converter");

  } catch (error) {
    console.error(error);
    setObjectCookie("userConnect", null);
    setCookie("sessionId", null);
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

onMounted(() => {
  store.commit("setTab", 2);
});
</script>
