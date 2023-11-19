<template>
  <v-card color="grey-lighten-4" flat rounded="0" height="100%">
    <v-toolbar density="compact" height="100%">
      <img
        :width="200"
        aspect-ratio="1/1"
        cover
        src="../../assets/pulpo-logo.png"
        class="ml-16"
      />
      <v-toolbar-title v-if="routeNow === '/register-encounter'"><h3>{{ title }}</h3></v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="routeNow !== '/register-encounter'">
        <v-tabs
          v-if="!userLogged"
          v-model="tab"
          color="deep-purple-accent-4"
          align-tabs="end"
          height="5.5rem">
          <v-tab
            @click="handleItemClick(item)"
            v-model="tab"
            color="deep-purple-accent-4"
            align-tabs="end"
            v-for="item in items"
            :key="item"
            :value="item.value"
            >{{ item.title }}
          </v-tab>
        </v-tabs>
        <div v-else>
          <v-row align="center" justify="center">
            <v-col cols="auto">
              <v-btn icon="mdi-exit-to-app" size="x-large" @Click="logout"></v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-toolbar>
    <v-window v-model="tab">
        <v-container fluid>
          <router-view></router-view>
        </v-container>
    </v-window>
  </v-card>
</template>

<script>
import AuthService from '@/services/auth.service';

export default {
  data() {
    return {
      userConnect: null,
      tab: this.$store.state.tab,
      isAuthenticated: false,
      items: [
        { value: 1, title: "Iniciar Session" },
        { value: 2, title: "Registrarse" },
      ],
      title: "Registro Para Encuentro de Oración",
      routeNow: this.$router.currentRoute.value.fullPath
    };
  },
  computed: {
    userLogged() {
      return AuthService.getUserLogged();
    }
  },
  methods: {
    handleItemClick(item) {
      // Cambiar el valor de 'tab' al hacer clic en el botón
      this.$store.commit('setTab', item.value);
      // Redirigir a la página correspondiente al valor del botón
      if (item.value === 1) {
        this.$router.push("/login");
      } else if (item.value === 2) {
        this.$router.push("/register");
      }
    },
    logout(){
      localStorage.clear();
      document.cookie = `sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      this.$store.commit('setAuthentication', false);
      AuthService.deleteUserLogged();
      this.isAuthenticated = false;
      this.userConnect = null;
      window.location.href = "/login";
      // this.$router.push("/login");
    }
  },
  watch: {
    '$store.state.tab'(newValue) {
      this.tab = newValue;
      this.isAuthenticated = this.$store.state.isAuthenticated;
    },
    '$store.state.refreshComponent'(newValue) {
      console.log('Valor del Refresh cambió:', newValue);
      this.userConnect = AuthService.getUserLogged();
      this.$store.commit('setRefreshComponent', true);
    },
    '$store.state.userLogged'() {
      console.log('AQUUUU');
      // La cookie userLogged ha cambiado, realiza las acciones necesarias aquí
      this.userConnect = AuthService.getUserLogged();
    },
  },
  onMounted() {
    this.isAuthenticated = this.$store.state.isAuthenticated;
    this.userConnect = this.$store.state.getUserConnect;
    this.routeNow = this.$router.currentRoute.value.fullPath;
  }
};
</script>
