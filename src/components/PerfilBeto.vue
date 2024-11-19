<template>
    <div class="admin-profile">
      <h1>Perfil General</h1>
      
      <section class="stats">
        <div class="stat">
          <h2>Total de Internos</h2>
          <p>{{ totalInternos }}</p>
        </div>
        <div class="stat">
          <h2>Entradas Diarias</h2>
          <p>{{ entradasDiarias }}</p>
        </div>
        <div class="stat">
          <h2>Salidas en Tiempo Real</h2>
          <ul>
            <li v-for="salida in salidasEnTiempoReal" :key="salida.id">
              {{ salida.nombre }} - {{ salida.fechaEgreso }}
            </li>
          </ul>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        totalInternos: 0,
        entradasDiarias: 0,
        salidasEnTiempoReal: [],
      };
    },
    methods: {
      async fetchData() {
        try {
          // Obtener total de internos
          const internosResponse = await axios.get('http://localhost:3000/internos');
          this.totalInternos = internosResponse.data.length;
  
          // Obtener entradas diarias
          const entradasResponse = await axios.get('http://localhost:3000/entradas-diarias');
          this.entradasDiarias = entradasResponse.data.length;
  
          // Obtener salidas en tiempo real
          const salidasResponse = await axios.get('http://localhost:3000/salidas');
          this.salidasEnTiempoReal = salidasResponse.data;
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      },
    },
    mounted() {
      this.fetchData(); // Llama a la función al montar el componente
    },
  };
  </script>
  
  <style scoped>
  .admin-profile {
    padding: 20px;
  }
  
  .stats {
    display: flex;
    justify-content: space-around;
  }
  
  .stat {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 5px;
    width: 30%;
    text-align: center;
  }
  
  .stat h2 {
    margin-bottom: 10px;
  }
  
  .stat p, .stat ul {
    font-size: 1.5em;
  }
  </style>-->
  