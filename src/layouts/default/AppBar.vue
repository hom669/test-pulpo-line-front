<template>
  <v-card color="grey-lighten-4" flat rounded="0" height="100%">
    <v-toolbar density="compact" height="100%">
      <img
        :width="200"
        aspect-ratio="1/1"
        cover
        src="../../assets/pulpo-logo.png"
      />

      <v-toolbar-title><h3>{{ title }}</h3></v-toolbar-title>

      <v-spacer></v-spacer>
      <v-tabs
        v-if="!userConnect"
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
            <h3>Bienvenido, {{ userConnect.name }}</h3>
          </v-col>
          <v-col cols="auto">
            <v-btn icon="mdi-exit-to-app" size="x-large" @Click="logout"></v-btn>
          </v-col>
        </v-row>
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
import localStorageService from '@/services/localStorageService';

export default {
  data() {
    return {
      userConnect: localStorageService.getUser(),
      tab: this.$store.state.tab,
      items: [
        { value: 1, title: "Iniciar Session" },
        { value: 2, title: "Registrarse" },
      ],
      title: "Conversión de Divisas",
    };
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
      this.userConnect = null;
      this.$router.push("/login");
    }
  },
  watch: {
    '$store.state.tab'(newValue) {
      console.log('Valor del store.someValue cambió:', newValue);
      this.tab = newValue;
    },
    'localStorageService.getUser'() {
      this.userConnect = JSON.parse(localStorageService.getUser());
    },
    '$store.state.refreshComponent'(newValue) {
      console.log('Valor del Refresh cambió:', newValue);
      this.$store.commit('setRefreshComponent', true);
      this.$nextTick(() => {
        this.userConnect = localStorageService.getUser();
      });
    },
  },
  onMounted() {
    this.userConnect = localStorageService.getUser();
  }
};
</script>
