/*
✅ ESTRUCTURA DE LA STORE
Crea un store que maneje todos los datos que necesitas compartir entre tus componentes. 
Por ejemplo, puedes crear un store useInternosStore.js 
que maneje la lista de internos, la salida, y también el estado del buscador.
*/

// src/stores/useInternosStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useInternosStore = defineStore('internos', {
  state: () => ({
    internosList: [],
    salida: null,
    buscarTermino: '',
  }),
  actions: {
    async fetchInternos() {
      try {
        const response = await axios.get('http://localhost:3000/internos');
        this.internosList = response.data;
      } catch (error) {
        console.error('Error al obtener los internos:', error);
      }
    },
    agregarInterno(nuevoInterno) {
      this.internosList.push(nuevoInterno);
    },
    actualizarInterno(updatedInterno) {
      const index = this.internosList.findIndex(interno => interno.id === updatedInterno.id);
      if (index !== -1) {
        this.internosList[index] = updatedInterno;
      }
    },
    eliminarInterno(id) {
      this.internosList = this.internosList.filter(interno => interno.id !== id);
    },
    handleSalidaSubmit(datos) {
      this.salida = datos;
    },
    setBuscarTermino(termino) {
      this.buscarTermino = termino;
    },
  },
  getters:{
    totalEntradas: (state) => {
        return state.internosList.filter(interno => interno.estado === 'ingreso').length; // Ajusta según tu lógica
    },
    totalSalidas: (state) => {
        return state.internosList.filter(interno => interno.estado === 'salida').length; // Ajusta según tu lógica
      },
      getFiltrados: (state) => {
        return state.internosList.filter(interno => 
          interno.nombre.includes(state.buscarTermino) // Ajusta según tus campos
        );
      },
    },
  });

/*
✅ USAR EL STORE EN COMPONENTES
Ahora, integrar el store en tus componentes para que }
cada uno pueda acceder a los datos necesarios.

App.vue
Asegúrate de inicializar el store en tu componente principal.

<script>
import { useInternosStore } from '@/stores/useInternosStore';
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
  setup() {
    const internosStore = useInternosStore();
    const currentSection = ref('ingreso-guardia');

    const goToSection = (section) => {
      currentSection.value = section;
    };

    const goToList = () => {
      internosStore.fetchInternos();
      goToSection('listado-internos');
    };

    const goToForm = (tipoEntrada) => {
      goToSection(tipoEntrada === '1' ? 'formulario-ingreso' : 'formulario-salida');
    };

    return {
      currentSection,
      goToSection,
      goToList,
      goToForm,
      internosStore,
    };
  },
};
</script>

*/

/*
✅ SELECTORHOME.VUE
Este componente puede actualizar el término de búsqueda en el store.

<script>
import { useInternosStore } from '@/stores/useInternosStore';

export default {
  setup() {
    const internosStore = useInternosStore();

    const actualizarBusqueda = (termino) => {
      internosStore.setBuscarTermino(termino);
    };

    return {
      actualizarBusqueda,
    };
  },
};
</script>

*/

/*
✅ VISUALIZACIONDATOS.VUE
Aquí mostrarás la información basada en el estado del store.

<template>
  <div>
    <h2>Visualización de Datos</h2>
    <p>Total de Entradas: {{ totalEntradas }}</p>
    <p>Total de Salidas: {{ totalSalidas }}</p>
    <p>Internos Filtrados:</p>
    <ul>
      <li v-for="interno in filtrados" :key="interno.id">{{ interno.nombre }}</li>
    </ul>
  </div>
</template>

<script>
import { useInternosStore } from '@/stores/useInternosStore';

export default {
  setup() {
    const internosStore = useInternosStore();
    
    return {
      totalEntradas: internosStore.totalEntradas,
      totalSalidas: internosStore.totalSalidas,
      filtrados: internosStore.getFiltrados,
    };
  },
};
</script>

*/

/*
✅ LISTADOINTERNOS.VUE
Para la edición y eliminación de internos.

<script>
import { useInternosStore } from '@/stores/useInternosStore';

export default {
  setup() {
    const internosStore = useInternosStore();

    const editarInterno = (interno) => {
      // Implementa lógica para editar interno
      internosStore.actualizarInterno(interno);
    };

    const eliminarInterno = (id) => {
      internosStore.eliminarInterno(id);
    };

    return {
      internosList: internosStore.internosList,
      editarInterno,
      eliminarInterno,
    };
  },
};
</script>

*/

/*
✅ VISUALIZACION DE DATOS Y REPORTES
Para mostrar los datos de entrada/salida, podrías implementar 
funciones en el store que calculen estos valores y los expongan como getters.

getters: {
  totalEntradas: (state) => {
    // Lógica para contar entradas
  },
  totalSalidas: (state) => {
    // Lógica para contar salidas
  },
},

*/


/*
✅ RESUMEN Y CONCLUSIONES
Store Centralizado: Utiliza un store de Pinia para manejar la 
lista de internos y las salidas.

Interacciones: Cada componente interactúa con el store 
según sus necesidades.

Funcionalidades: Implementa funciones específicas para 
manejar la búsqueda, edición y eliminación de internos.

Con esta estructura, deberías poder manejar el estado de 
manera efectiva y permitir que tus componentes interactúen 
entre sí sin duplicar lógica. Si necesitas más detalles sobre
 alguna parte específica, ¡hazmelo saber!
*/


/*
✅ RESUMEN Y CONCLUSIONES 2

1. Getters en el Store: Se agregan getters para calcular 
el total de entradas y salidas.
2. Uso en Componente: En VisualizacionDatos.vue, se accede a 
estos getters para mostrar los datos.
3.Lógica de Estado: Asegúrate de que tu estado se maneje 
correctamente para reflejar el estado de ingreso o salida.
 */