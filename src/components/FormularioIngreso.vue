<template>
  <section id="formulario-ingreso" v-show="isVisible">
    <div class="container">
      <h5 class="fw-bold">Formulario de Ingreso - Alcaidia Rafaela</h5> 
      <form @submit.prevent="handleSubmit">
        <div class="mb-2">
          <label for="nombre" class="form-label label-small">Nombre y Apellido:</label>
          <input type="text" v-model="nombre" id="nombre" class="form-control" required />
        </div>

        <div class="mb-2">
          <label for="dni" class="form-label label-small">DNI:</label>
          <input type="text" v-model="dni" id="dni" class="form-control" required />
        </div>

        <div class="mb-2">
          <label for="fecha-ingreso" class="form-label label-small">Fecha y hora de Ingreso:</label>
          <input type="datetime-local" v-model="fechaIngreso" id="fecha-ingreso" class="form-control" required />
        </div>

        <div class="mb-2">
          <label for="prontuario" class="form-label label-small">Prontuario:</label>
          <input type="text" v-model="prontuario" id="prontuario" class="form-control" required />
        </div>

        <div class="mb-2">
          <label for="causa" class="form-label label-small">Causa:</label>
          <input type="text" v-model="causa" id="causa" class="form-control" required />
        </div>

        <div class="mb-2">
          <label for="situacion-procesal" class="form-label label-small">Situación procesal:</label>
          <select v-model="situacionProcesal" id="situacion-procesal" class="form-select" required>
            <option disabled value="">Elige una opción del menú</option>
            <option value="1">Procesado - Preventiva Sin Plazo</option>
            <option value="2">Procesado - Preventiva 60 días</option>
            <option value="3">Procesado - Preventiva 90 días</option>
            <option value="4">Condenado</option>
            <option value="5">Detenido</option>
          </select>
        </div>

        <div class="mb-2">
          <label for="foto" class="form-label label-small">Foto:</label>
          <input type="file" @change="handleFileChange" id="foto" class="form-control" required />
        </div>

        <div class="mb-2">
          <label for="fecha-egreso" class="form-label label-small">Fecha y hora de Egreso:</label>
          <input type="datetime-local" v-model="fechaEgreso" id="fecha-egreso" class="form-control" required />
        </div>

        <div class="form-check form-switch mb-2">
          <input class="form-check-input" type="checkbox" v-model="registrarHuella" id="flexSwitchCheckDefault" />
          <label class="form-check-label label-small" for="flexSwitchCheckDefault">Registrar la huella dactilar del interno</label>
        </div>

        <button id="button-frIngreso" type="submit" class="btn btn-primary">Enviar</button>
      </form>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  
  data() {
    return {
      nombre: '',
      dni: '',
      fechaIngreso: '',
      prontuario: '',
      causa: '',
      situacionProcesal: null,
      fechaEgreso: '',
      registrarHuella: false,
      foto: null,
    };
  },

  methods: {
    handleFileChange(event) {
      this.foto = event.target.files[0];
    },

    async handleSubmit() {
    if (!this.nombre || !this.dni || !this.fechaIngreso || !this.prontuario || !this.causa || this.situacionProcesal === null) {
    console.error('Por favor completa todos los campos obligatorios.');
    return;
  }
  
  const formData = new FormData();
  formData.append('nombre', this.nombre);
  formData.append('dni', this.dni);
  formData.append('fechaIngreso', new Date(this.fechaIngreso).toISOString());
  formData.append('prontuario', this.prontuario);
  formData.append('causa', this.causa);
  formData.append('situacionProcesal', Number(this.situacionProcesal));
  formData.append('fechaEgreso', this.fechaEgreso ? new Date(this.fechaEgreso).toISOString() : null);
  formData.append('registrarHuella', this.registrarHuella);
  
  if (this.foto) {
    formData.append('foto', this.foto);
  }

  console.log({
    nombre: this.nombre,
    dni: this.dni,
    fechaIngreso: this.fechaIngreso,
    prontuario: this.prontuario,
    causa: this.causa,
    situacionProcesal: Number(this.situacionProcesal),
    fechaEgreso: this.fechaEgreso,
    registrarHuella: this.registrarHuella,
  });

  try {
    const response = await axios.post('http://localhost:3000/internos', formData);
    this.$emit('nuevoInterno', response.data);
    this.limpiarFormulario();
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
  }
},

    limpiarFormulario() {
      this.nombre = '';
      this.dni = '';
      this.fechaIngreso = '';
      this.prontuario = '';
      this.causa = '';
      this.situacionProcesal = '';
      this.fechaEgreso = '';
      this.registrarHuella = false;
      this.foto = null;
    },
  },
}
</script>

<style scoped>
.container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  max-width: 600px;
}
h5 {
  margin-bottom: 15px;
  color: #333;
  text-align: left;
}
.form-label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
  text-align: left;
  display: block;
}
.label-small {
  font-size: 0.85rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.form-control,
.form-select {
  text-align: left;
}
</style>