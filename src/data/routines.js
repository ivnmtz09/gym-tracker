export const PROGRAM_TYPES = {
  ppl: "Push / Pull / Legs",
  torso_pierna: "Torso / Pierna",
  weider: "Rutina Weider",
  full_body: "Cuerpo Completo",
  powerlifting: "Powerlifting",
  halterofilia: "Halterofilia",
  strongman: "Strongman",
  crossfit: "CrossFit",
  funcional: "Entrenamiento Funcional",
  calistenia: "Calistenia",
  hiit: "HIIT",
  tabata: "Método Tabata"
};

export const ROUTINES = {
  ppl: {
    1: { name: "Push", desc: "Pecho, Hombro, Tríceps", type: "strength" },
    2: { name: "Pull", desc: "Espalda, Bíceps", type: "strength" },
    3: { name: "Legs", desc: "Piernas, Abdomen", type: "strength" },
    4: { name: "Push", desc: "Pecho, Hombro, Tríceps", type: "strength" },
    5: { name: "Pull", desc: "Espalda, Bíceps", type: "strength" },
    6: { name: "Legs", desc: "Piernas, Abdomen", type: "strength" },
    0: { name: "Descanso", desc: "Recuperación Muscular", type: "rest" }
  },
  crossfit: {
    1: { name: "WOD Lunes", desc: "Metcon + Fuerza", type: "cardio" },
    2: { name: "WOD Martes", desc: "Gimnasia + Cardio", type: "cardio" },
    3: { name: "WOD Miércoles", desc: "Halterofilia", type: "strength" },
    4: { name: "Descanso Activo", desc: "Movilidad", type: "rest" },
    5: { name: "WOD Viernes", desc: "Hero WOD", type: "cardio" },
    6: { name: "Team WOD", desc: "Trabajo en Equipo", type: "cardio" },
    0: { name: "Descanso", desc: "Recuperación Total", type: "rest" }
  },
  powerlifting: {
    1: { name: "Sentadilla", desc: "Fuerza Máxima Piernas", type: "strength" },
    2: { name: "Press Banca", desc: "Fuerza Máxima Empuje", type: "strength" },
    3: { name: "Descanso", desc: "Recuperación", type: "rest" },
    4: { name: "Peso Muerto", desc: "Fuerza Máxima Tirón", type: "strength" },
    5: { name: "Accesorios", desc: "Hipertrofia auxiliar", type: "strength" },
    6: { name: "Descanso Activo", desc: "Movilidad", type: "rest" },
    0: { name: "Descanso", desc: "Recuperación", type: "rest" }
  },
  default: {
    1: { name: "Entrenamiento", desc: "Día 1", type: "general" },
    2: { name: "Entrenamiento", desc: "Día 2", type: "general" },
    3: { name: "Entrenamiento", desc: "Día 3", type: "general" },
    4: { name: "Entrenamiento", desc: "Día 4", type: "general" },
    5: { name: "Entrenamiento", desc: "Día 5", type: "general" },
    6: { name: "Entrenamiento", desc: "Día 6", type: "general" },
    0: { name: "Descanso", desc: "Día Libre", type: "rest" }
  }
};
