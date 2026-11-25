# CYL · Closet Your Life

Prototipo de armario digital para Expo y React Native, adaptable a móvil y escritorio.

## Ver la aplicación

Desde `pruebas-expo`:

```sh
npm install
npm run web
```

Para abrirla en un dispositivo compatible con el SDK 58 del proyecto: `npm start` y escanear el QR con Expo Go, o usar un development build.

## Qué puedes probar

- **Mi armario:** ocho prendas propias con fotografías locales, búsqueda por nombre, marca o color, categorías, temporadas, favoritos, ordenación y vista compacta. El buscador ignora tildes.
- **Ficha de prenda:** consultar detalles, marcar favoritos, registrar usos y activar o desactivar la disponibilidad para amigos.
- **Añadir prenda:** elegir entre ocho fotos de ejemplo, rellenar nombre, marca, categoría, color y temporada, y compartirla.
- **Mis conjuntos:** tres conjuntos iniciales; crear combinaciones de dos o tres prendas, filtrar por ocasión, marcar favoritos y eliminar conjuntos.
- **Armarios amigos:** tres perfiles ficticios, sus prendas compartidas y simulación de solicitudes de préstamo. Las solicitudes aparecen en «Mis préstamos» y notificaciones.
- **Mi perfil:** editar nombre, ciudad y biografía; estadísticas calculadas a partir de las prendas y los conjuntos; preferencias de demostración.
- **Invitaciones:** validación de correo y confirmación simulada, sin enviar mensajes.

Los datos se mantienen en memoria durante la sesión. Recargar la aplicación restablece los datos iniciales. No hay backend, cuentas reales, envío de correos, notificaciones del sistema ni préstamos reales. Las fotos están incluidas en `assets/wardrobe/` y proceden de Unsplash. Los iconos están incluidos como PNG para funcionar también en plataformas nativas sin dependencias adicionales.

## Estructura

Las rutas están en `src/app/`. La interfaz, los datos ficticios, los formularios y el estado compartido están en `src/wardrobe/`. La navegación utiliza Expo Router.

```sh
npm run lint
npx tsc --noEmit
```

## Volver al estado anterior

La copia anterior a esta demo está fuera del proyecto, en `TFG/.codex-backups/cyl-wardrobe-before/`. Incluye los archivos originales y su manifiesto SHA-256, una lista de los cambios de la demo y un restaurador con comprobación de conflictos.

Puedes pedir a Codex **«perfecto, vuelve atrás»**. Se restaurarán los archivos originales y se retirarán únicamente los archivos añadidos por esta demo. La copia incluye tus archivos aunque todavía no estuvieran confirmados en Git. Los archivos originales de dependencias también están guardados; las carpetas generadas `node_modules` y `.expo` no forman parte del respaldo del código.
