<template>
  <section id="selector-home" v-show="isVisible">
    <div class="container">
      <h4 class="fw-bold">Bienvenido al Sistema de Registro de Internos de Alcaidia Rafaela</h4>
      <h6>Selector de Entrada o Salida de Interno</h6>
      <form @submit.prevent="handleSelection">
        
        <div class="mb-3">
        <label for="tipo-entrada"></label>
        <select id="tipo-entrada" class="form-select" v-model="tipoEntrada">
          <option disabled value="">Elige una opción del menú</option>
          <option value="1">Entrada</option>
          <option value="2">Salida</option>
        </select>
        </div>

        <div class="d-flex justify-content-between mt-5">
          <button type="button" class="btn btn-primary w-100 me-3" @click="listarInternos">Listado de Internos</button>
          <button type="button" class="btn btn-primary w-100" @click="irAFormularios">Ir a Formulario</button>
        </div>
        
      </form>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tipoEntrada: '',
    };
  },
  methods: {
    handleSelection() {
      // Emitir evento para ir a formulario
      this.$emit('goToForm', this.tipoEntrada);
    },
    listarInternos() {
      // Emitir evento para mostrar listado
      this.$emit('goToList');
    },
    irAFormularios() {
      // Emitir evento para ir a formularios
      this.handleSelection();
    },
  },
};
</script>

<style scoped>
.container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 600px;
}

h6{
  margin: 15px 0;
}

.form-label{
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.btn{
  display: block;
}

</style>

  