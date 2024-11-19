<template>
    <section id="salida-internos">
      <div class="container">
        <h2 class="fw-bold">Datos de Salida</h2>
        <div v-if="salida">
          <p><strong>Tipo de Salida:</strong> {{ salida.tipoSalida }}</p>
          <p><strong>Nombre y Apellido:</strong> {{ salida.nombre }}</p>
          <p><strong>Fecha y Hora de Salida:</strong> {{ salida.fechaEgreso }}</p>
          <p><strong>Registrar Huella:</strong> {{ salida.registrarHuella ? 'Sí' : 'No' }}</p>
        </div>
        <div v-else>
          <p>No hay datos de salida disponibles.</p>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    props: {
      salida: {
        type: Object,
        default: () => null,
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
  
  h2 {
    margin-bottom: 20px;
  }
  </style>