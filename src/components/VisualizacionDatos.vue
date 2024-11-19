<template>
  <section id="visualizacion-datos" class="container" v-show="isVisible">
    <h3>Internos Cargados</h3>
    <div v-if="internos.length === 0">
      <p>No hay internos cargados.</p>
    </div>
    <div v-else>
      <ul>
        <li 
          v-for="interno in internos" 
          :key="interno.id" 
          @click="selectInterno(interno)"
          style="cursor: pointer;"
        >
          {{ interno.nombre }} - {{ interno.dni }} - {{ interno.fechaIngreso }}
        </li>
      </ul>
    </div>

    <div v-if="selectedInterno">
      <h3>Detalles del Interno</h3>
      <div class="row">
        <div class="col-md-6">
          <h3>Foto</h3>
          <img :src="selectedInterno.foto" class="card-img-top" alt="Foto del Interno" />
        </div>
        <div class="col-md-6">
          <p class="card-text">Nombre y Apellido: {{ selectedInterno.nombre }}</p>
          <p class="card-text">DNI: {{ selectedInterno.dni }}</p>
          <p class="card-text">Fecha Ingreso: {{ selectedInterno.fechaIngreso }}</p>
          <p class="card-text">Causa: {{ selectedInterno.causa }}</p>
          <p class="card-text">Prontuario: {{ selectedInterno.prontuario }}</p>
          <p class="card-text">Situación Procesal: {{ selectedInterno.situacionProcesal }}</p>
        </div>
      </div>
    </div>

        <!-- Botón OK para volver al SelectorHome -->
        <button @click="goBack" class="btn btn-primary mt-3">OK</button>
  </section>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    internos: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedInterno: null,
    };
  },
  methods: {
    selectInterno(interno) {
      this.selectedInterno = interno;
    },
    goBack() {
      // Aquí puedes manejar la lógica para volver al componente SelectorHome
      this.selectedInterno = null; // Limpiar la selección actual
      this.$emit('go-back'); // Emitir un evento para que el padre lo maneje
    },
  },
};

/*
Configuracion del Store para los
componentes que necesitan acceder a los internos
y salida del store como visualizaciondatos.vue y 
listadoInternos.vue

------------------------------------------------------------

import {useInternosStore} from '@/stores/useInternosStore';

export default {
  setup () {
    const internosStore = useInternosStore();
    return {
      internos: internosStore.internosList,
      salida: internosStore.salida,
    };
  },
};
*/
</script>

<style scoped>
#visualizacion-datos {
  border: 1px solid #000;
  padding: 20px;
  margin-top: 20px;
  background: #f9f9f9;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px 0;
}
</style>
