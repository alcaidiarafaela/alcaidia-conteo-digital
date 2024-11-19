<template>
  <section id="formulario-salida" v-show="isVisible">
    <div class="container">
      <form @submit.prevent="handleSubmit">
        <h2 class="fw-bold">Tipo de Salida</h2>
        <label for="tipo-salida1" class="form-label">Seleccionar</label>
        
        <select v-model="tipoSalida" id="tipo-salida1" class="form-select mb-3" required>
          <option disabled value="">Elige una opción del menú</option>
          <option value="1">Audiencia</option>
          <option value="2">Médico</option>
          <option value="3">Mantenimiento</option>
          <option value="4">Traslado</option>
          <option value="5">Libertad</option>
        </select>
        
        <div class="mb-2">
          <label for="nombre" class="form-label label-small">Nombre y Apellido:</label>
          <input 
            type="text" 
            v-model="nombre" 
            id="nombre" 
            class="form-control" 
            @input="onInput" 
            placeholder="Escribe para buscar"
            required 
          />
          <!-- Lista de sugerencias -->
          <ul v-if="filteredNames.length > 0" class="suggestions-list">
            <li 
              v-for="(suggestion, index) in filteredNames" 
              :key="index"
              @click="selectName(suggestion)"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>

        <div class="mb-2">
          <label for="fecha-egreso" class="form-label label-small">Fecha y hora de Salida:</label>
          <input type="datetime-local" v-model="fechaEgreso" id="fecha-egreso" class="form-control" required />
        </div>

        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" v-model="registrarHuella" id="flexSwitchCheckDefault1" />
          <label class="form-check-label" for="flexSwitchCheckDefault1">Registrar la huella dactilar del interno</label>
        </div>
        
        <button id="button-salida" type="submit" class="btn btn-primary w-100 mt-3">Enviar</button>
      </form>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tipoSalida: '',
      nombre: '',
      fechaEgreso: '',
      registrarHuella: false,
      internos: [],  // Lista de internos obtenidos del servidor
      filteredNames: [],  // Para las sugerencias filtradas
    };
  },
  mounted() {
    this.obtenerInternos(); // Llamar al servidor para cargar los internos cuando se monta el componente
  },
  computed: {
    filteredNames() {
      if (!this.nombre) {
        return [];
      }
      return this.internos
        .map(interno => interno.nombre)  // Obtener solo los nombres
        .filter(name => name.toLowerCase().includes(this.nombre.toLowerCase()));
    },
  },
  methods: {
    async obtenerInternos() {
      try {
        const response = await axios.get('/internos');
        this.internos = response.data;
      } catch (error) {
        console.error('Error al obtener los internos:', error);
      }
    },

    async handleSubmit() {
      // Verificación de campos obligatorios
      if (!this.tipoSalida || !this.nombre || !this.fechaEgreso) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      // Buscar el ID del interno usando su nombre
      const interno = this.internos.find(i => i.nombre.toLowerCase() === this.nombre.toLowerCase());

      if (!interno) {
        alert('Interno no encontrado');
        return;
      }

      // Emitir los datos al componente padre
      const salidaInterno = {
        tipoSalida: Number(this.tipoSalida),
        nombre: this.nombre,
        fechaEgreso: this.fechaEgreso,
        registrarHuella: this.registrarHuella,
      };

      // Emitir el evento de salida al componente padre
      this.$emit('salidaInterno', salidaInterno);

      // Si el tipo de salida es Traslado o Libertad, eliminamos al interno
      if (this.tipoSalida === '4' || this.tipoSalida === '5') {
        try {
          // Eliminar el interno del servidor
          await axios.delete(`/internos/${interno.id}`);

          // Emitir evento para que el componente padre también lo registre
          this.$emit('internoEliminado', this.nombre); // Emitir evento para eliminarlo de la lista
          
        } catch (error) {
          console.error('Error al procesar la salida del interno:', error);
        }
      }

      // Limpiar el formulario después de enviar
      this.resetForm();
    },

    resetForm() {
      this.tipoSalida = '';
      this.nombre = '';
      this.fechaEgreso = '';
      this.registrarHuella = false;
    },

    // Método para filtrar nombres según la búsqueda del usuario
    onInput() {
      // Los nombres se filtran automáticamente gracias a filteredNames
    },

    // Método para seleccionar un nombre de la lista de sugerencias
    selectName(suggestion) {
      this.nombre = suggestion;
      this.filteredNames = []; // Limpiar las sugerencias
    },
  },
}
</script>

<style scoped>
.container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 600px;
}

h2 {
  margin-bottom: 20px;
}

.form-label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
  text-align: left;
  display: block; 
}

.form-check {
  margin-bottom: 15px;
}

/* Estilo para el listado de sugerencias */
.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  background-color: #fff;
  z-index: 10;
}

.suggestions-list li {
  padding: 10px;
  cursor: pointer;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}
</style>


