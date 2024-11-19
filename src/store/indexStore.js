import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    currentSection: 'ingreso-guardia',
    internosList: [],
    salida: null,
    egresosList: [],
    searchQuery: '',
    selectedInternos: null,
  },

  getters: {
    internosCount(state) {
      if (!state.searchQuery) {
        return state.internosList;
      }
      return state.internosList.filter(internos =>
        internos.nombre.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
  },

  mutations: {
    setCurrentSection(state, section) {
      state.currentSection = section;
    },
    setInternosList(state, internos) {
      state.internosList = internos;
    },
    addInterno(state, nuevoInterno) {
      state.internosList.push(nuevoInterno);
    },
    setSalida(state, salidaData) {
      state.salida = salidaData;
    },
    setEgresosList(state, egresoData) {
      state.egresosList.push(egresoData);
    },
    setSearchQuery(state, query) {
      state.searchQuery = query;
    },
    setSelectedInternos(state, interno) {
      state.selectedInternos = interno;
    },
    removeInterno(state, id) {
      // Mutación para eliminar un interno de la lista por id
      state.internosList = state.internosList.filter(interno => interno.id !== id);
    },
    addEgreso(state, egreso) {
      state.egresosList.push(egreso);
    }
  },

  actions: {
    async fetchInternos({ commit }) {
      try {
        const response = await axios.get('http://localhost:3000/internos');
        commit('setInternosList', response.data);
      } catch (error) {
        console.error('Error al obtener los internos', error);
      }
    },

    addInterno({ commit }, nuevoInterno) {
      commit('addInterno', nuevoInterno);
    },

    updateSalida({ commit }, salidaData) {
      commit('setSalida', salidaData);
    },

    updateEgresos({ commit }, egresoData) {
      commit('setEgresosList', egresoData);
    },

    setCurrentSection({ commit }, section) {
      commit('setCurrentSection', section);
    },

    setSearchQuery({ commit }, query) {
      commit('setSearchQuery', query);
    },

    setSelectedInternos({ commit }, interno) {
      commit('setSelectedInternos', interno);
    },

    // Acción modificada para eliminar el interno usando el ID
    async eliminarInterno({ commit }, interno) {
      try {
        if (!interno.id){
          console.error('El interno no tiene un ID válido:', interno);
          throw new Error ('El ID del interno es inválido');
        }
        // Enviamos la solicitud DELETE con el ID del interno
        const response = await axios.delete(`http://localhost:3000/internos/${interno.id}`);

        // Si la eliminación fue exitosa, actualizamos el estado de Vuex
        commit('removeInterno', interno.id);
        console.log('Interno eliminado:', response.data);
      } catch (error) {
        console.error('Error al eliminar el interno:', error);
      }
    },

    // Acción para agregar un egreso a la lista de egresos
    addEgreso({ commit }, egreso) {
      commit('addEgreso', egreso);
    }
  },
});
