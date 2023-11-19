<template>
  <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap">
    <v-row>
      <v-col class="column">
        <v-img
          class="mx-auto mb-2"
          max-height="140"
          max-width="240"
          src="../assets/pulpo-logo.png"
        ></v-img>

        <v-text-field
          v-model="amount"
          clearable
          label="Label"
          @input="formatInputMoney"
        >
          <div>{{ symbol }}</div>
        </v-text-field>
        <v-autocomplete
          v-if="countries && countries.length > 0"
          v-model="fromCountry"
          :disabled="isUpdating"
          :items="countries"
          chips
          color="blue-grey-lighten-2"
          item-title="name"
          item-value="currency_name"
          label="Select"
          :rules="fromCountryRules"
          clearable
        >
          <template v-slot:chip="{ props, item }">
            <v-chip
              v-bind="props"
              :prepend-avatar="item.raw.avatar"
              :text="item.raw.name"
            ></v-chip>
          </template>

          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :prepend-avatar="item?.raw?.avatar"
              :title="item?.raw?.name"
              @click="
                setSymbol(item?.raw?.symbol);
                setInfoFromCurrency(item);
              "
            ></v-list-item>
          </template>
        </v-autocomplete>

        <v-autocomplete
          v-if="countries && countries.length > 0"
          v-model="toCountry"
          :disabled="isUpdating"
          :items="countries"
          chips
          color="blue-grey-lighten-2"
          item-title="name"
          item-value="currency_name"
          label="Select"
          clearable
          :rules="toCountryRules"
        >
          <template v-slot:chip="{ props, item }">
            <v-chip
              v-bind="props"
              :prepend-avatar="item.raw.avatar"
              :text="item.raw.name"
            ></v-chip>
          </template>

          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :prepend-avatar="item?.raw?.avatar"
              :title="item?.raw?.name"
              @click="setInfoToCurrency(item)"
            ></v-list-item>
          </template>
        </v-autocomplete>
        <v-card-actions class="justify-center px-6 py-3">
          <v-btn
            type="button"
            lass="text-white flex-grow-2 text-none"
            rounded="0"
            variant="flat"
            color="blue-darken-2"
            size="x-large"
            @click="clearSelect"
          >
            Limpiar
          </v-btn>
          <v-btn
            type="button"
            prepend-icon="mdi-currency-usd"
            class="text-white flex-grow-2 text-none"
            rounded="0"
            variant="flat"
            color="purple-darken-4"
            size="x-large"
            @click="currencyConvert"
          >
            Convertir
          </v-btn>
        </v-card-actions>
      </v-col>
      <v-col class="column mt-16">
        <v-alert
          v-if="valueConverter"
          color="primary"
          theme="dark"
          icon="mdi-cash-multiple"
          prominent
        >
          <h3>
            {{ infoFromCurrency.symbol }} {{ amount }}
            {{ infoFromCurrency.currency_name }} =
          </h3>
          <br />
          <h1>
            {{ infoToCurrency.symbol }} {{ valueConverter }}
            {{ infoToCurrency.currency_name }}
          </h1>
          <br />
          {{ infoToCurrency.symbol }} 1 {{ infoToCurrency.id }} =
          {{ oneCurrencyFrom }} {{ infoFromCurrency.id }}
          <br />
          {{ infoFromCurrency.symbol }} 1 {{ infoFromCurrency.id }} =
          {{ oneCurrencyTo }} {{ infoToCurrency.id }}
        </v-alert>

        <v-alert
          v-if="valueError"
          color="error"
          theme="dark"
          icon="mdi-cash-multiple"
          prominent
        >
          Sr, {{ userConnect.name }}
          <br />
          {{ valueError }}
        </v-alert>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import CurrencyConverterService from "@/services/currency.converter.service";
import localStorageService from "@/services/localStorageService";

export default {
  data() {
    return {
      autoUpdate: true,
      fromCountry: null,
      toCountry: null,
      isUpdating: false,
      name: "",
      countries: null,
      titleOne: "Moneda para Convertir",
      titleTwo: "Moneda a Convertir",
      timeout: null,
      amount: 0,
      symbol: "$",
      userConnect: localStorageService.getUser(),
      infoToCurrency: null,
      infoFromCurrency: null,
      oneCurrencyFrom: null,
      oneCurrencyTo: null,
      valueConverter: null,
      valueError: null,
    };
  },
  computed: {
    currencyRules() {
      if (this.amount > 0) {
        return [
          (v) => !!v || "El Valor es Requerido",
          (v) =>
            /^(\$?\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d{1,3})?)$/.test(v) ||
            "Formato Invalido de Moneda (e.g., $1, $1.000, $10.000, etc)",
        ];
      }
      return true;
    },
    fromCountryRules() {
      return [(v) => !!v || "El Valor es Requerido"];
    },
    toCountryRules() {
      return [(v) => !!v || "El Valor es Requerido"];
    },
  },
  watch: {
    isUpdating(val) {
      clearTimeout(this.timeout);

      if (val) {
        this.timeout = setTimeout(() => (this.isUpdating = false), 3000);
      }
    },
  },
  async beforeCreate() {
    this.countries = await CurrencyConverterService.getCountries();
  },
  methods: {
    remove(item) {
      const index = this.friends.indexOf(item.name);
      if (index >= 0) this.friends.splice(index, 1);
    },
    async getCountries() {
      const items = await CurrencyConverterService.getCountries();
      return items;
    },
    formatInputMoney() {
      // Eliminar caracteres no numéricos
      const numericValue = this.amount.replace(/[^\d]/g, "");

      // Formatear el número
      const formatted = new Intl.NumberFormat().format(Number(numericValue));

      // Actualizar el valor formateado
      this.amount = formatted;
    },
    setSymbol(symbol) {
      this.symbol = symbol;
    },
    setInfoToCurrency(item) {
      this.infoToCurrency = item.raw;
      this.valueConverter = null;
      this.oneCurrencyFrom = null;
      this.oneCurrencyTo = null;
      this.valueError = null;
    },
    setInfoFromCurrency(item) {
      this.infoFromCurrency = item.raw;
      this.valueConverter = null;
      this.oneCurrencyFrom = null;
      this.oneCurrencyTo = null;
      this.valueError = null;
    },
    async currencyConvert() {
      try {
        const currencyConverter =
          await CurrencyConverterService.currencyConvert(
            this.amount,
            this.infoFromCurrency.id,
            this.infoToCurrency.id
          );
        this.valueConverter = currencyConverter.value_convert;
        this.oneCurrencyFrom = currencyConverter.value_one_from;
        this.oneCurrencyTo = currencyConverter.value_one_to;
        this.valueError = null;
      } catch (error) {
        this.valueConverter = null;
        this.oneCurrencyFrom = null;
        this.oneCurrencyTo = null;
        this.valueError = error.response.data.error;
      }
    },
    clearSelect() {
      this.symbol = "$";
      this.amount = 0;
      this.fromCountry = null;
      this.toCountry = null;
      this.valueConverter = null;
      this.oneCurrencyFrom = null;
      this.oneCurrencyTo = null;
      this.valueError = null;
    },
  },
  onMounted() {
    location.reload();
  },
};
</script>
