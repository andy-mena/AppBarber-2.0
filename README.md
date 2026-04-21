# **🛠️ Convenciones y Buenas Prácticas para Git**

Este documento establece las convenciones a seguir en el manejo de Git dentro de este proyecto. Siguiendo estas reglas, aseguramos un flujo de trabajo organizado y colaborativo.

## **📌 Ramas en Git**

Usamos una nomenclatura clara para identificar el tipo de trabajo que se está realizando.

## **Ramas principales**

**main** → Código estable listo para producción.
**develop** → Integración de cambios antes de pasar a main.

## **Ramas de desarrollo (Prefijo + Descripción corta)**

1. feature/nueva-funcionalidad → Para nuevas características.
2. fix/corrección-de-bug → Para correcciones de errores.
3. hotfix/corrección-urgente → Para parches urgentes en producción.
4. chore/mantenimiento → Para tareas de mantenimiento.
5. refactor/mejora-de-código → Para refactorización sin cambios funcionales.
6. docs/documentación → Para cambios en la documentación.
7. test/pruebas → Para actualizaciones en pruebas.

### **📌 Mensajes de Commit**

Los commits deben seguir una estructura clara para facilitar el historial de cambios.
Usaremos la siguiente estructura para este proyecto.

### **Formato del mensaje**
tipo(scope): descripción breve

tipo → Indica el propósito del cambio (ver lista abajo).
scope (opcional) → Área afectada (ej: api, ui, auth).
descripción → Explicación breve en presente.

### **Tipos de commits permitidos**

- feat → Nueva funcionalidad.
- fix → Corrección de errores.
- docs → Cambios en documentación.
- style → Cambios de formato.
- refactor → Reestructuración sin cambiar funcionalidad.
- perf → Mejoras de rendimiento.

Iniciar aplicación frontend ---> npm run dev
Iniciar aplicación backend ---> npm run dev:api (Para solucionar cors y tester apis en postman)

# **Levantar el proyecto en docker
1. Clonar el repositorio
2. Ejecutar docker-compose up --build
3. Done
