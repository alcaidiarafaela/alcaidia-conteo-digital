<template>
  <section id="listado-internos" v-show="isVisible">
    <div id="visualList" class="container">
      <h3 class="titulo-internos">
        <div>Cantidad de Internos:</div>
        <div class="cantidad">{{ internosCount }}</div>
      </h3>

      <div class="row">
        <div class="col-left">
          <div class="search-container">
            <input 
              type="text"
              v-model="searchQuery"
              placeholder="Buscar por nombre..."
              class="form-control"
            />
          </div>

          <div class="accordion-container">
            <div class="accordion" id="accordionPanelsStayOpenExample">
              <div v-for="interno in filteredInternos" :key="interno.id" class="accordion-item">
                <h2 class="accordion-header" :id="'heading' + interno.id">
                  <button class="accordion-button" type="button" 
                          data-bs-toggle="collapse" 
                          :data-bs-target="'#collapse' + interno.id" 
                          @click="handleSelectInterno(interno)">
                    {{ interno.nombre }} - {{ interno.dni }}
                  </button>
                </h2>
                <div :id="'collapse' + interno.id" class="accordion-collapse collapse" :aria-labelledby="'heading' + interno.id">
                  <div class="accordion-body accordion-content">
                    <p><strong>Fecha de Ingreso:</strong> {{ formatDate(interno.fecha_ingreso) }}</p>
                    <p><strong>Causa:</strong> {{ interno.causa }}</p>
                    <button @click="editarInterno(interno)">Editar</button>
                    <button @click="eliminarInterno(interno)">Eliminar</button> <!-- Botón para eliminar -->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="button-container mt-4">
            <button class="btn btn-primary" @click="descargar">Descargar</button>
            <button class="btn btn-primary" @click="actualizar">Actualizar</button>
            <button class="btn btn-primary" @click="ok">OK</button>
          </div>
        </div>

        <div class="col-right">
          <div v-if="selectedInterno" class="details-container">
            <h4>Detalles de {{ selectedInterno.nombre }}</h4>
            <div class="details-content">
              <div class="photo-container">
                <img v-if="selectedInterno.foto" :src="getImageUrl(selectedInterno.foto)" alt="Foto de {{ selectedInterno.nombre }}" class="img-fluid" />
              </div>
              <div class="info-container">
                <p><strong>DNI:</strong> {{ selectedInterno.dni }}</p>
                <p><strong>Fecha de Ingreso:</strong> {{ formatDate(selectedInterno.fecha_ingreso) }}</p>
                <p><strong>Causa:</strong> {{ selectedInterno.causa }}</p>
                <p><strong>Prontuario:</strong> {{ selectedInterno.prontuario }}</p>
                <p><strong>Situación Procesal:</strong> {{ situaciones[selectedInterno.situacion_procesal] }}</p>
                <p><strong>Fecha de Egreso:</strong> {{ formatDate(selectedInterno.fecha_egreso) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isEditing" class="modal">
        <h4>Editar Interno</h4>
        <form @submit.prevent="guardarCambios">
          <label for="nombre">Nombre:</label>
          <input type="text" v-model="selectedInterno.nombre" required />
          <label for="dni">DNI:</label>
          <input type="text" v-model="selectedInterno.dni" required />
          <label for="causa">Causa:</label>
          <input type="text" v-model="selectedInterno.causa" required />
          <label for="prontuario">Prontuario:</label>
          <input type="text" v-model="selectedInterno.prontuario" required />
          <label for="situacion_procesal">Situación Procesal:</label>
          <input type="text" v-model="selectedInterno.situacion_procesal" required />
          <label for="fecha_egreso">Fecha de Egreso:</label>
          <input type="date" v-model="selectedInterno.fecha_egreso" required />
          <button type="submit">Guardar Cambios</button>
          <button type="button" @click="cancelarEdicion">Cancelar</button>
        </form>
      </div>

      <!-- Sección de Egresos -->
      <div class="listado-egresos mt-4">
        <h3 class="titulo-egresos">Lista de Egresos</h3>
        <div class="accordion-container">
          <div class="accordion" id="accordionEgresos">
            <div v-for="egreso in egresosList" :key="egreso.id" class="accordion-item">
              <h2 class="accordion-header" :id="'headingEgreso' + egreso.id">
                <button class="accordion-button" type="button" 
                        data-bs-toggle="collapse" 
                        :data-bs-target="'#collapseEgreso' + egreso.id">
                  {{ egreso.nombre }} - {{ formatDate(egreso.fechaEgreso) }}
                </button>
              </h2>
              <div :id="'collapseEgreso' + egreso.id" class="accordion-collapse collapse" :aria-labelledby="'headingEgreso' + egreso.id">
                <div class="accordion-body">
                  <p><strong>Fecha de Egreso:</strong> {{ formatDate(egreso.fechaEgreso) }}</p>
                  <p><strong>Detalles adicionales:</strong> {{ egreso.detalles || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import axios from 'axios';

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
    egresos: {
      type: Array,
      default: () => [],
    },
    selectInterno: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      selectedInterno: null,
      searchQuery: '',
      isEditing: false,
      situaciones: {
        1: "Procesado - Preventiva Sin Plazo",
        2: "Procesado - Preventiva 60 días",
        3: "Procesado - Preventiva 90 días",
        4: "Condenado",
        5: "Detenido",
      },
    };
  },
  computed: {
    ...mapState(['internosList', 'egresosList', 'searchQuery']),
    internosCount() {
      return this.internos.length;
    },
    filteredInternos() {
      if (!this.searchQuery) {
        return this.internos;
      }
      return this.internos.filter(interno => {
        return interno.nombre.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
  },
  mounted() {
    if (this.internos.length > 0) {
      this.selectedInterno = this.internos[0];
    }
  },
  methods: {
    ...mapActions(['setSearchQuery', 'setSelectedInterno', 'eliminarInterno']),
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },
    getImageUrl(foto) {
      const imageUrl = `http://localhost:3000/${foto.replace(/\\/g, '/')}`;
      return imageUrl;
    },
    handleSelectInterno(interno) {
      this.selectedInterno = interno;
      this.selectInterno(interno);
    },
    async eliminarInterno(interno) {
      try {
        await this.eliminarInterno(interno.id); // Eliminar desde el store
        // Filtrar el interno eliminado de la lista
        this.internos = this.internos.filter(i => i.id !== interno.id);
        this.selectedInterno = null; // Resetear el interno seleccionado si es el eliminado
      } catch (error) {
        console.error('Error al eliminar el interno:', error);
      }
    },
    descargar() {
      console.log('Descargando...');
    },
    actualizar() {
      console.log('Actualizando...');
    },
    ok() {
      this.$emit('goToSelectorHome');
    },
    editarInterno(interno) {
      this.selectedInterno = { ...interno };
      this.isEditing = true;
    },
    async guardarCambios() {
      try {
        const response = await axios.put(`http://localhost:3000/internos/${this.selectedInterno.id}`, this.selectedInterno);
        const index = this.internos.findIndex(i => i.id === this.selectedInterno.id);
        if (index !== -1) {
          this.$set(this.internos, index, this.selectedInterno);
        }
        this.isEditing = false;
        this.selectedInterno = null;
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
      }
    },
    cancelarEdicion() {
      this.isEditing = false;
      this.selectedInterno = null;
    },
  },
};
</script>


<style scoped>
#listado-internos {
  margin-top: 20px;
}

.titulo-internos {
  color: white;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.cantidad {
  font-size: 2.5em; 
  font-weight: bold; 
}

.row {
  display: flex;
  margin-top: 20px;
}

.col-left {
  flex: 2; 
  max-width: 50%; 
  padding-right: 10px; 
}

.col-right {
  flex: 3; 
  max-width: 70%; 
  padding-left: 10px; 
}

.accordion-button {
  cursor: pointer;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.button-container button {
  margin: 5px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.form-control {
  width: 100%;
  padding: 10px;
}

.accordion-container {
  max-height: 400px; 
  overflow-y: auto;  
}

.details-container {
  background: #f9f9f9;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.details-content {
  display: flex;
  align-items: flex-start;
}

.photo-container {
  margin-right: 15px;
}

.photo-container img {
  width: 450px;
  height: auto;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.info-container {
  margin: 5px 0;
  text-align: left;
}

.info-container p {
  margin: 5px 0;
}

.listado-egresos {
  margin-top: 20px;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 5px;
}

.titulo-egresos {
  color: black;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}
</style>
