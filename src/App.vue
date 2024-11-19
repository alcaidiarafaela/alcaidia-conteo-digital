<template>
  <div id="app">
    <div class="overlay"></div>
    <IngresoGuardia
      v-if="currentSection === 'ingreso-guardia'"
      :isVisible="currentSection === 'ingreso-guardia'" 
      @next="goToSection('selector-home')"
    />
    <SelectorHome
      v-if="currentSection === 'selector-home'"
      :isVisible="currentSection === 'selector-home'"
      @goToForm="goToForm"
      @goToList="goToList" 
    />
    <FormularioIngreso
      v-if="currentSection === 'formulario-ingreso'"
      :isVisible="currentSection === 'formulario-ingreso'"
      @nuevoInterno="agregarInterno"
      @next="goToSection('visualizacion-datos')"
    />
    <FormularioSalida
      v-if="currentSection === 'formulario-salida'"
      :isVisible="currentSection === 'formulario-salida'"
      @salidaInterno="handleSalida"  
      @next="goToSection('visualizacion-datos')"
    />
    <VisualizacionDatos
      v-if="currentSection === 'visualizacion-datos'"
      :isVisible="currentSection === 'visualizacion-datos'"
      :internos="internosList"
      :salida="salida"  
      @next="goToSection('listado-internos')"
    />
    <ListadoInternos
      v-if="currentSection === 'listado-internos'"
      :isVisible="currentSection === 'listado-internos'"
      :internos="internosList"
      @next="goToSection('selector-home')"
      @goToSelectorHome="goToSection('selector-home')"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import IngresoGuardia from './components/IngresoGuardia.vue';
import SelectorHome from './components/SelectorHome.vue';
import FormularioIngreso from './components/FormularioIngreso.vue';
import FormularioSalida from './components/FormularioSalida.vue';
import VisualizacionDatos from './components/VisualizacionDatos.vue';
import ListadoInternos from './components/ListadoInternos.vue';

export default {
  components: {
    IngresoGuardia,
    SelectorHome,
    FormularioIngreso,
    FormularioSalida,
    VisualizacionDatos,
    ListadoInternos,
  },

  computed: {
    ...mapState(['currentSection', 'internosList', 'salida', 'egresosList']),
  },

  methods: {
    ...mapActions([
      'fetchInternos',
      'setCurrentSection',
      'addInterno',
      'updateSalida',
      'setSearchQuery',
      'setSelectedInterno',
      'eliminarInterno',  // Acción para manejar la eliminación de internos
    ]),

    goToSection(section) {
      this.setCurrentSection(section);
    },

    async goToList() {
      await this.fetchInternos();
      this.goToSection('listado-internos');
    },

    goToForm(tipoEntrada) {
      if (tipoEntrada === '1') {
        this.goToSection('formulario-ingreso');
      } else if (tipoEntrada === '2') {
        this.goToSection('formulario-salida');
      }
    },

    agregarInterno(nuevoInterno) {
      this.addInterno(nuevoInterno);
      this.goToSection('visualizacion-datos');
    },

    async handleSalida(datos) {
      // Si el tipo de salida es Traslado o Libertad, eliminamos el interno
      if (datos.tipoSalida === '4' || datos.tipoSalida === '5') {
        try {
          // Llamar a la acción de Vuex para eliminar el interno
          await this.eliminarInterno({ 
            nombre: datos.nombre, 
            tipoSalida: datos.tipoSalida 
          });

          // Emitir el evento para que el componente hijo actualice su lista
          this.internoEliminado(datos.nombre);

        } catch (error) {
          console.error('Error al procesar la salida del interno:', error);
        }
      }
    },

    // Este método ahora puede ser utilizado para actualizar los datos en la vista
    internoEliminado(nombre) {
      // Aquí puedes filtrar la lista de internos y eliminar el que ya no existe
      this.internosList = this.internosList.filter(interno => interno.nombre !== nombre);
    },
  },

  mounted() {
    this.fetchInternos();
  },
};
</script>


<style>
/* Agrega aquí el CSS global si es necesario */
</style>

