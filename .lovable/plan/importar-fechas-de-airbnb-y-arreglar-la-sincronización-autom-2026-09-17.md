# Importar fechas de Airbnb y arreglar la sincronización automática

## 1. Qué tabla se actualiza y con qué datos

Tabla: `external_bookings` (una fila por rango bloqueado). Para B2 Distrito Corazón (`9b474524-…`) su calendario de Airbnb trae 4 rangos:

| check_in | check_out | summary |
|---|---|---|
| 2026-09-15 | 2026-09-18 | Airbnb (Not available) |
| 2026-09-21 | 2026-09-27 | Airbnb (Not available) |
| 2026-10-15 | 2026-10-20 | Airbnb (Not available) |
| (4º rango del feed) | | Airbnb (Not available) |

Campos por fila: `property_id`, `source_name` = "Airbnb", `source_url` = el enlace vinculado, `external_id` = UID del VEVENT, `check_in`, `check_out`, `summary`. No se toca `bookings` ni ninguna reserva directa.

## 2. Llave única

Sí: el `UID` de cada VEVENT se guarda en `external_id` y ya existe el índice único
`external_bookings_uid_unique (property_id, source_url, external_id)`. La escritura pasa a ser
un upsert sobre esa llave, así que re-sincronizar no duplica ni borra y recrea filas.

## 3. Por qué falló la sincronización automática

No es el dominio: la detección de plataforma usa `includes("airbnb")`, que sí cubre `airbnb.mx`.

La causa real: la tarea programada de cada 30 minutos llama a la función con la clave pública, y
la función exige clave de servicio o un usuario administrador, así que **responde 401 y termina
sin sincronizar nada**. Los registros de la función lo confirman: solo aparece "Starting iCal
sync" y nada más. Por eso las únicas propiedades con fechas son las que importé a mano.

Corrección:
- Añadir un secreto `ICAL_SYNC_SECRET` y aceptar en `ical-sync` la cabecera `x-sync-secret`
  con ese valor (además de la clave de servicio y del administrador que ya se aceptan).
- Reprogramar la tarea de 30 minutos para que envíe esa cabecera.
- Cambiar borrar-e-insertar por upsert por UID, y reconocer también `airbnb.mx`, `vrbo`,
  `homeaway` y `booking.com` explícitamente al nombrar la fuente.

## 4. Otras propiedades con el mismo problema

10 propiedades tienen calendario de Airbnb vinculado con fechas bloqueadas y 0 importadas:

B2, B3, C4, C5 Distrito Corazón · Bungalow Village 212 y 213 · Condo in Azara Tulum ·
Luxury Condo in PGA Golf Resort | Bahia Principe · Perfect Location 3 Bed Apartment ·
Playa del Carmen Golfview Condo

Tras arreglar la tarea, se ejecuta una sincronización completa para importar las fechas de
todas ellas (no solo B2) y se verifica que el calendario público las muestre tachadas.
