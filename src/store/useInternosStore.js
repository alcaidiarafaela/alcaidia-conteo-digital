//src/stores/useInternosStore.js

import {defineStore} from 'pinia';
import axios from 'axios';

export const useInternosStore = defineStore('internos',{
    state:() => ({
        internosList: [],
        salida: null,
    }),
    actions: {
        async fetchInternos() {
            try {
                const response = await axios.get('http://localhost:3000/internos');
                this.internosList = response.data;
            } catch (error) {
                console.error('Error al obtener los internos', error);
            }
        },
        agregarInternos(nuevoInterno){
            this.internosList.push(nuevoInterno);
        },
        handleSalidaSubmit(datos){
            this.salida = datos;
        },
    },
});