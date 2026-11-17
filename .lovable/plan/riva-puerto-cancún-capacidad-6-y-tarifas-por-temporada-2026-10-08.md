# Riva (Puerto Cancún): capacidad 6 y tarifas por temporada

Propiedad: "Perfect location 4 bed Apartment Puerto Cancun, Riva" (hoy: 7 huéspedes, $3,500 MXN/noche, sin temporadas).

## 1. Capacidad
- Cambiar `max_guests` de 7 a 6. El selector de huéspedes, el aviso "Maximum X guests" y el texto "X huéspedes" de la ficha ya leen este campo, así que quedan en 6 automáticamente.
- La descripción no menciona "7 guests/huéspedes", así que no hace falta editar ningún texto.

## 2. Tarifas
- Cambiar el precio base `price_per_night` de 3,500 a **5,000** (se aplica en cualquier fecha fuera de los rangos de abajo, incluido del 1 de febrero en adelante).
- Agregar estas temporadas para nov 2026 – ene 2027 (el sistema ya usa la tarifa de temporada como precio exacto por noche):

| Temporada | Fechas (noches) | MXN/noche |
|---|---|---|
| Noviembre | 01 nov – 30 nov 2026 | 5,000 |
| Inicio de diciembre | 01 dic – 14 dic 2026 | 7,500 |
| Pre-Navidad | 15 dic – 23 dic 2026 | 9,000 |
| Navidad y Año Nuevo | 24 dic 2026 – 02 ene 2027 | 14,000 |
| Inicio de enero | 03 ene – 09 ene 2027 | 9,000 |
| Mediados de enero | 10 ene – 16 ene 2027 | 7,500 |
| Finales de enero | 17 ene – 31 ene 2027 | 6,000 |

Nota: los rangos son de fechas concretas. Para repetirlos en 2027-28 habrá que cargarlos de nuevo (o puedo agregarlos ahora si quieres).

## 3. Cálculo noche por noche
El calendario ya cobra cada noche con su tarifa y muestra el desglose por temporada. Corrijo un detalle: hoy las fechas de temporada se leen en hora UTC, y en Cancún eso las adelanta un día (la temporada empezaría el día anterior). Se compararán como fechas simples, sin hora. Esto también arregla las demás propiedades que tienen temporadas.

## 4. Sin cambios
Nombre, fotos, descripción, amenidades, ubicación y el resto de los datos se quedan igual.

## Verificación
Estancia del 22 al 26 dic (4 noches): 22 y 23 dic a 9,000 + 24 y 25 dic a 14,000 = **$46,000 MXN**. Lo compruebo en la ficha y en el resumen de la reserva.

## Detalles técnicos
- Datos: UPDATE en properties (max_guests=6, price_per_night=5000) e INSERT de 7 filas en seasonal_pricing (price_modifier = precio absoluto, min_nights null).
- Código: en `src/components/BookingCalendar.tsx`, `getSeasonForDate` compara `season.start_date`/`end_date` como strings `yyyy-MM-dd` en vez de `format(new Date(...))`.
