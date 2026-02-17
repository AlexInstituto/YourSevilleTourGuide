# Your Seville Tour Guide

Aplicación móvil desarrollada con **React Native + Expo** para gestionar tours personalizados en Sevilla. Permite crear tours, añadir paradas con geolocalización e imágenes, generar PDFs, y autenticación con **Supabase**.

---

## 🚀 Características

* Autenticación con **Supabase** (login y registro).
* Gestión de **perfiles de usuario** con avatar editable.
* Crear y administrar **tours**.
* Añadir **stops** con título, descripción, coordenadas y foto.
* Visualización de paradas en **mapa interactivo**.
* Generación de **PDFs de tours**.
* Chatbot integrado usando **Rasa**.

---

## 📂 Estructura del proyecto

```
/src
  /screens      # Pantallas de la app
    HomeScreen.tsx
    LoginScreen.tsx
    RegisterScreen.tsx
    ProfileScreen.tsx
    ProfileEdit.tsx
    ToursScreen.tsx
    TourFormScreen.tsx
    StopsScreen.tsx
    StopFormScreen.tsx
    ChatBotScreen.tsx
  /services     # Conexiones y utilidades
    auth.ts
    db.ts
    rasa.ts
    image.ts
    pdf.ts
  /navigation   # Stack y BottomTabs
    AuthStack.tsx
    BottomTabs.tsx
/App.tsx
/index.js
```

---

## ⚡ Tecnologías

* **Expo**: Desarrollo multiplataforma.
* **React Native**: UI nativa.
* **Supabase**: Autenticación y base de datos.
* **React Navigation**: Navegación entre pantallas.
* **Formik + Yup**: Formularios con validación.
* **react-native-maps**: Mapas e integración de geolocalización.
* **expo-print + expo-sharing**: Generación y compartición de PDFs.
* **Rasa**: Chatbot conversacional.
* **TypeScript**: Tipado seguro en toda la app.

---

## 🛠️ Instalación

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd your-seville-tour-guide
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar la app:

```bash
npm start
```

4. Abrir en dispositivo/emulador:

* iOS: `i`
* Android: `a`
* Web: `w`

---

## 🔧 Configuración

1. **Supabase**: Crear proyecto y reemplazar URL y `anon key` en `src/services/auth.ts` y `db.ts`.
2. **Rasa**: Configurar endpoint en `src/services/rasa.ts`.
3. **Permisos**: Para fotos y mapas, Expo pedirá permisos automáticamente.

---

## 📌 Uso

* Registrarse o iniciar sesión.
* Completar perfil y subir avatar.
* Crear tours, añadir stops con fotos y ubicación.
* Visualizar tours y stops en mapa.
* Generar PDF de tour y compartirlo.
* Usar el chatbot para consultas.

---

### LICENSE

```text
MIT License

Copyright (c) 2025 Alejandro Angorrilla Blanco

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
