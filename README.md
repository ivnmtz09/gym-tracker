# 🔥 ForgeFit (Anteriormente Gym Tracker)

ForgeFit es una aplicación web progresiva (PWA) de fitness de próxima generación. No es solo un tracker de rutinas; es un ecosistema completo diseñado para crear adherencia al entrenamiento mediante gamificación, análisis de métricas, y un fuerte componente social y comunitario.

Construida con las tecnologías más modernas del ecosistema frontend: **React 19**, **Tailwind CSS v4** y **Firebase**.

![ForgeFit Dashboard](https://via.placeholder.com/1200x600.png?text=ForgeFit+Dashboard+Preview)

---

## ✨ Características Principales

### 🏋️ Planificación Dinámica (Mi Plan Semanal)
- **Programas Base:** Elige entre rutinas precargadas (Push/Pull/Legs, CrossFit, Powerlifting, Torso/Pierna, etc.).
- **Totalmente Personalizable:** Modifica día por día. Si no te gusta el "Miércoles de Halterofilia", cámbialo por "Pierna". El sistema lo reconoce y adapta tu dashboard automáticamente.
- **Días de Descanso Inteligentes:** La aplicación oculta los requerimientos intensos y te motiva a recuperarte en tus días libres.

### 🎮 Gamificación y Retención
- **Sistema de XP y Niveles:** Gana Puntos de Experiencia (XP) por cada Check-in basado en la intensidad (Suave, Normal, Fuerte, Extremo). Sube de nivel mientras te pones en forma.
- **Rachas (Streaks):** Mantén tu racha diaria activa. Pierdes la racha si dejas de entrenar más de 24 horas después de tu último registro.
- **Mascota Evolutiva ("Burny"):** Nuestra mascota SVG sube de nivel contigo. A nivel 5 consigue una banda de sudor, a nivel 10 consigue mancuernas y a nivel 20 adquiere gafas de sol.

### 📈 Récords Personales y Estadísticas
- **Tracker de 1RM (PRs):** Registra tus levantamientos máximos en Press Banca, Sentadilla y Peso Muerto.
- **Gráficas Visuales:** Visualiza tus picos de asistencia mensuales mediante gráficos interactivos construidos con `Recharts`.
- **Mapa Muscular:** Un diagrama visual (SVG) te muestra exactamente qué grupos musculares estás trabajando en el día actual según tu rutina.

### 🤝 Comunidad y Muro Social
- **Grupos Cerrados:** Crea un grupo privado con tus amigos del gimnasio o únete mediante un código secreto.
- **Leaderboard:** Compite sanamente viendo quién tiene más Check-ins en el mes actual.
- **Muro de Actividad:** Un feed en tiempo real (estilo red social) donde ves los Check-ins recientes de tus amigos, sus notas de entrenamiento, intensidad, y puedes darles ánimos.

### 🎨 Arquitectura de Temas Avanzada (Tailwind v4)
- **Modos de Visualización:** Elige entre Modo Claro, Oscuro (Clásico) o Nocturno (Negro puro/OLED).
- **Temas de Acento:** 8 colores intercambiables en caliente (Azul, Rosa, Verde, Morado, Naranja, Rojo, Amarillo, Cian). Todo manejado con variables CSS puras para transiciones fluidas.
- **Glassmorphism:** Diseño moderno basado en transparencias, desenfoques de fondo y bordes sutiles.

### 📴 Offline-First y PWA
- **App Instalable:** Configurado con `vite-plugin-pwa` para poder instalarse de forma nativa en iOS, Android y Escritorio.
- **Persistencia Firebase:** Gracias a `IndexedDB`, puedes entrar al gimnasio (donde suele haber mala señal), registrar tu Check-in sin conexión a internet, y la app sincronizará los datos a la nube automáticamente al detectar red.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19 (Hooks, Context API).
- **Build Tool:** Vite (Ultra rápido).
- **Estilos:** Tailwind CSS v4 (Nueva arquitectura basada en `@theme` y variables CSS puras).
- **Base de Datos & Auth:** Firebase v10 (Firestore Database, Authentication).
- **Iconos:** Lucide-React.
- **Gráficos:** Recharts.
- **Routing:** React Router v6.
- **PWA:** vite-plugin-pwa.

---

## 🚀 Instalación y Uso Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/gym-tracker.git
cd gym-tracker
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase
Crea un proyecto en Firebase (con Authentication y Firestore habilitados). Luego, crea un archivo `.env` en la raíz del proyecto y añade tus credenciales:

```env
VITE_FIREBASE_API_KEY="tu-api-key"
VITE_FIREBASE_AUTH_DOMAIN="tu-dominio.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="tu-project-id"
VITE_FIREBASE_STORAGE_BUCKET="tu-bucket.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="tu-sender-id"
VITE_FIREBASE_APP_ID="tu-app-id"
VITE_FIREBASE_MEASUREMENT_ID="tu-measurement-id"
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🛡️ Reglas de Firestore Sugeridas
Para que todo el sistema de comunidades y perfiles funcione correctamente sin arrojar errores de permisos (`Missing or insufficient permissions`), asegúrate de tener reglas similares a estas en tu consola de Firebase Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para perfiles de usuario
    match /profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reglas para Check-ins
    match /checkins/{checkinId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Reglas para Grupos / Comunidades
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
  }
}
```

---
*Desarrollado con ❤️ para forjar mejores versiones de nosotros mismos.*
