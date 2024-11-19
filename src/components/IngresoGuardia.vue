<template>
    <div class="container" v-if="isVisible">
      <h2 class="mb-3">Alcaidia Rafaela</h2>
      <h3 class="fw-bold">Ingreso Guardia</h3>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="usuario" class="form-label">Usuario</label>
          <input type="email" class="form-control" id="usuario" v-model="usuario" required />
          <div class="form-text">No compartas tu usuario con nadie.</div>
        </div>
        <div class="mb-3">
          <label for="contrasena" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="contrasena" v-model="contrasena" required />
        </div>
        <button type="submit" class="btn btn-primary">Ingresar</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: Boolean,
    },
    data() {
      return {
        usuario: '',
        contrasena: '',
        users: {
          admin: {
            email: 'beto@admin',
            password: '1013',
            backup: [],
          },
          testUser: {
            email: 'admin@admin',
            password: 'admin',
          },
        },
        regularUsers: [
          { email: 'user1@example.com', password: 'password1' },
          { email: 'user2@example.com', password: 'password2' },
        ],
      };
    },
    methods: {
      handleSubmit() {
        if (this.usuario === this.users.admin.email && this.contrasena === this.users.admin.password) {
          alert('Ingreso exitoso como Administrador');
          this.$emit('next');
        } else if (this.usuario === this.users.testUser.email && this.contrasena === this.users.testUser.password) {
          //alert('Ingreso exitoso como Usuario de Prueba');
          this.$emit('next');
        } else {
          const user = this.regularUsers.find(
            user => user.email === this.usuario && user.password === this.contrasena
          );
          if (user) {
            alert('Ingreso exitoso como Usuario Regular');
            this.users.admin.backup.push({
              email: user.email,
              timestamp: new Date().toISOString(),
            });
            console.log('Backup actualizado', this.users.admin.backup);
            this.$emit('next');
          } else {
            alert('Usuario o contraseña incorrectos');
          }
        }
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
  
  h3 {
    margin-bottom: 20px;
    color: #333;
  }
  
  label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
    text-align: left;
    display: block; /* Asegura que el label ocupa el ancho completo */
  }
  
  input[type="email"],
  input[type="password"] {
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
  }
  
  button {
    padding: 10px 15px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }

  </style>