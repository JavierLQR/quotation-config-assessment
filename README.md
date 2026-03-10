# Quotation Configuration API

Backend GraphQL para el módulo de **Configuración de Cotización**. Permite definir y gestionar márgenes de ganancia por planta, tipo de cliente y rango de volumen, exponiendo una API GraphQL consumible desde cualquier frontend.

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Modelo de base de datos](#modelo-de-base-de-datos)
- [API GraphQL](#api-graphql)
- [Requisitos previos](#requisitos-previos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Docker](#docker)
- [Tests](#tests)
- [CI/CD](#cicd)
- [Estructura de carpetas](#estructura-de-carpetas)

---

## Descripción general

El sistema permite:

- Gestionar **plantas** (sedes) donde se realizan operaciones
- Definir **tipos de cliente** con precio base y estrategia de precios
- Registrar **clientes** individuales vinculados a un tipo
- Configurar **márgenes de ganancia** por planta, rango de volumen y opcionalmente por tipo de cliente o cliente específico
- Cada configuración de margen soporta 8 rangos de volumen: `300 kg`, `500 kg`, `1T`, `3T`, `5T`, `10T`, `20T`, `30T`

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | [NestJS v11](https://nestjs.com/) |
| Lenguaje | TypeScript 5 |
| API | GraphQL (Code First) con Apollo Server 5 |
| ORM | [Prisma v6](https://www.prisma.io/) |
| Base de datos | PostgreSQL 16 |
| Validación | class-validator + class-transformer |
| Testing | Jest + @nestjs/testing |
| Runtime | Node.js 22 |
| Package manager | pnpm |

---

## Arquitectura del proyecto

Se sigue una arquitectura modular con **Repository Pattern**:

```
Resolver  →  Service  →  Repository (abstract)
                               ↑
                        RepositoryPrisma (implementación)
```

- El **Resolver** recibe las operaciones GraphQL y las delega al Service
- El **Service** contiene la lógica de negocio. Nunca conoce Prisma directamente
- El **Repository** define el contrato (clase abstracta). El Service solo depende de este contrato
- El **RepositoryPrisma** implementa el contrato usando Prisma Client

Este desacoplamiento permite cambiar la base de datos sin tocar el Service ni los Resolvers.

---

## Modelo de base de datos

```
Plant ──< MarginConfig >── ClientType ──< Client
                    >── Client
```

### `Plant`
Representa una planta / sede.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Identificador único |
| `name` | String (unique) | Nombre de la planta |
| `createdAt` | DateTime | Fecha de creación |
| `updatedAt` | DateTime | Fecha de actualización |

### `ClientType`
Tipo de cliente con precio base y estrategia de precios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Identificador único |
| `name` | String (unique) | Nombre del tipo (ej. "Tipo A") |
| `basePrice` | Float | Precio base en USD |
| `pricingStrategy` | String | `POR_ESTRUCTURA` o `NO_VINCULAR` |

### `Client`
Cliente individual. Puede estar vinculado a un tipo de cliente o existir sin clasificar.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Identificador único |
| `name` | String | Nombre del cliente |
| `clientTypeId` | Int? | Referencia a `ClientType` (nullable — ver nota) |
| `basePrice` | Float? | Precio base propio (sobreescribe el del tipo) |
| `pricingStrategy` | String? | Estrategia propia (sobreescribe la del tipo) |

> **Nota — "Sin tipo de cliente"**: `clientTypeId` es opcional. Un cliente sin tipo aparece en la sección **"Sin tipo de cliente"** del frontend. Esto ocurre cuando el cliente se crea sin asignar tipo, o cuando el tipo de cliente al que pertenecía se elimina (el campo se pone en `null` automáticamente gracias a `onDelete: SetNull`).

### `MarginConfig`
Configuración de margen para una combinación planta + volumen + cliente/tipo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Identificador único |
| `plantId` | Int | Planta a la que aplica |
| `clientTypeId` | Int? | Tipo de cliente (opcional) |
| `clientId` | Int? | Cliente específico (opcional) |
| `volumeRange` | Enum | Rango de volumen (ver abajo) |
| `margin` | Float | Porcentaje de margen |

### Enum `VolumeRange`

| Valor | Descripción |
|-------|-------------|
| `KG_300` | 300 kilogramos |
| `KG_500` | 500 kilogramos |
| `T_1` | 1 tonelada |
| `T_3` | 3 toneladas |
| `T_5` | 5 toneladas |
| `T_10` | 10 toneladas |
| `T_20` | 20 toneladas |
| `T_30` | 30 toneladas |

---

## API GraphQL

El playground de Apollo está disponible en:

```
http://localhost:4000/api-v1/graphql
```

Todas las respuestas siguen la estructura:

```json
{
  "data": { ... },
  "message": "Operation successful",
  "status": "success",
  "success": true
}
```

Las respuestas paginadas incluyen además:

```json
{
  "data": [ ... ],
  "message": "...",
  "status": "success",
  "success": true,
  "metadataPagination": {
    "totalCount": 100,
    "pageCount": 10,
    "currentPage": 1,
    "perPage": 10,
    "isFirstPage": true,
    "isLastPage": false,
    "previousPage": null,
    "nextPage": 2
  }
}
```

---

### Queries disponibles

#### Plants

```graphql
# Listar plantas (paginado)
query {
  plants(pagination: { page: 1, perPage: 10 }) {
    data { id name createdAt }
    message
    success
    metadataPagination { totalCount pageCount currentPage }
  }
}

# Obtener una planta por ID
query {
  plant(id: 1) {
    data { id name }
    message
    success
  }
}
```

#### Client Types

```graphql
# Listar tipos de cliente (paginado)
query {
  clientTypes(pagination: { page: 1, perPage: 10 }) {
    data { id name basePrice pricingStrategy }
    message
    success
    metadataPagination { totalCount currentPage }
  }
}

# Obtener un tipo de cliente por ID
query {
  clientType(id: 1) {
    data { id name basePrice pricingStrategy }
    message
  }
}
```

#### Clients

```graphql
# Listar clientes (paginado)
query {
  clients(pagination: { page: 1, perPage: 10 }) {
    data { id name clientTypeId basePrice }
    metadataPagination { totalCount }
  }
}

# Obtener clientes por tipo de cliente
query {
  clientsByType(clientTypeId: 1) {
    data { id name }
    message
  }
}
```

#### Margin Configs

```graphql
# Obtener márgenes de una planta (paginado)
query {
  marginsByPlant(plantId: 1, pagination: { page: 1, perPage: 50 }) {
    data { id volumeRange margin clientTypeId clientId }
    metadataPagination { totalCount }
  }
}

# Obtener márgenes por planta + tipo de cliente
query {
  marginsByPlantAndClientType(plantId: 1, clientTypeId: 2) {
    data { id volumeRange margin }
    message
  }
}

# Obtener márgenes por planta + cliente específico
query {
  marginsByPlantAndClient(plantId: 1, clientId: 3) {
    data { id volumeRange margin }
    message
  }
}
```

---

### Mutations disponibles

#### Plants

```graphql
mutation {
  createPlant(input: { name: "Planta Lima" }) {
    data { id name }
    message
  }
}

mutation {
  updatePlant(input: { id: 1, name: "Planta Arequipa" }) {
    data { id name }
    message
  }
}

mutation {
  removePlant(id: 1) {
    data { id name }
    message
  }
}
```

#### Margin Configs

```graphql
# Guardar un margen individual (upsert)
mutation {
  upsertMargin(input: {
    plantId: 1
    clientTypeId: 2
    volumeRange: KG_300
    margin: 10.5
  }) {
    data { id volumeRange margin }
    message
  }
}

# Guardar la configuración completa de una planta de una sola vez
mutation {
  savePlantConfig(input: {
    plantId: 1
    margins: [
      { clientTypeId: 1, volumeRange: KG_300, margin: 10.5 }
      { clientTypeId: 1, volumeRange: KG_500, margin: 12.0 }
      { clientTypeId: 1, volumeRange: T_1,    margin: 8.0  }
      { clientId: 5,     volumeRange: KG_300, margin: 4.5  }
    ]
  }) {
    data
    message
  }
}
```

---

## Requisitos previos

- **Node.js** >= 22 — [descargar](https://nodejs.org/)
- **pnpm** >= 9 — `npm install -g pnpm`
- **Docker** — para levantar PostgreSQL fácilmente

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://postgres:postgres@localhost:5432/laik_tech` |
| `PORT` | Puerto donde corre la API | `4000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `GRAPHQL_PLAYGROUND` | Habilita Apollo Sandbox | `true` |
| `GRAPHQL_DEBUG` | Habilita modo debug de GraphQL | `true` |
| `FRONTEND_URL` | URL del frontend para CORS | `http://localhost:3000` |

---

## Instalación y ejecución

### Primera vez (setup completo)

Sigue estos pasos en orden:

**1. Clonar e instalar dependencias**

```bash
git clone <repo-url> laik-tech
cd laik-tech
pnpm install
```

**2. Configurar variables de entorno**

```bash
cp .env.example .env
```

El archivo `.env` ya tiene los valores correctos para desarrollo local con Docker. No necesitas editarlo si usas el paso siguiente.

**3. Levantar PostgreSQL con Docker**

```bash
docker compose up -d db
```

Esto inicia PostgreSQL en `localhost:5432` en segundo plano. Verifica que está listo:

```bash
docker compose ps   # debe mostrar "healthy" en la columna STATUS
```

**4. Crear tablas en la base de datos**

```bash
npx prisma migrate dev
```

**5. Cargar datos de prueba (seed)**

```bash
npx prisma db seed
```

Esto inserta:
- **3 plantas**: Planta Monterrey, Guadalajara y CDMX
- **4 tipos de cliente**: Industrial, Comercial, Gobierno, Distribuidor
- **15 clientes**: 12 con tipo asignado + 3 sin tipo (sección "Sin tipo de cliente")
- **216 configuraciones de margen**: combinando todas las plantas, tipos y rangos de volumen, con algunos márgenes críticos (≤ 5%) para probar las alertas visuales del frontend

**6. Iniciar el servidor**

```bash
pnpm start:dev
```

La API estará disponible en: **http://localhost:4000/api-v1/graphql**

---

### Ejecución en días siguientes

Con el setup ya hecho, simplemente:

```bash
# En una terminal: levantar la DB (si no está corriendo)
docker compose up -d db

# En otra terminal: iniciar la API
pnpm start:dev
```

---

### Re-sembrar la base de datos

Si quieres restablecer los datos a su estado inicial:

```bash
npx prisma db seed
```

> El seed borra y recrea todos los clientes y márgenes, pero respeta las plantas y tipos de cliente (upsert).

Para limpiar todo desde cero (incluyendo las tablas):

```bash
docker compose down -v          # elimina el volumen de PostgreSQL
docker compose up -d db         # reinicia la DB vacía
npx prisma migrate dev          # recrea las tablas
npx prisma db seed              # carga los datos de prueba
```

---

## Docker

### Solo la base de datos (recomendado para desarrollo)

```bash
# Iniciar
docker compose up -d db

# Detener (conserva los datos)
docker compose stop db

# Detener y borrar datos
docker compose down -v
```

### Producción — Build de imagen

```bash
docker build --target production -t laik-tech-api .
```

---

## Tests

### Ejecutar todos los tests

```bash
pnpm test
```

### Con reporte de cobertura

```bash
pnpm test:cov
```

### En modo watch (desarrollo)

```bash
pnpm test:watch
```

### Qué se testea

Cada módulo tiene dos suites de tests unitarios:

| Suite | Qué verifica |
|-------|-------------|
| `*.service.spec.ts` | Lógica de negocio: casos de éxito, `NotFoundException`, `BadRequestException`, mensajes exactos, argumentos pasados al repositorio |
| `*.resolver.spec.ts` | Que el resolver delega correctamente al service con los argumentos exactos |

Los tests son **puramente unitarios**: mockean el repositorio o el service, no requieren base de datos.

**Cobertura actual: 62 tests en 8 suites — 100% passing**

---

## CI/CD

### CI — Integración continua

Se ejecuta automáticamente en cada **push a `main`** y en cada **Pull Request**:

```
1. pnpm install --frozen-lockfile
2. ESLint (validación de código)
3. nest build (compilación TypeScript)
4. jest --coverage (tests + reporte de cobertura)
```

El reporte de cobertura queda disponible como artefacto en GitHub Actions por 7 días.

### CD — Entrega continua

Se ejecuta en cada **push a `main`** y en **tags `v*.*.*`**:

```
1. Login a GitHub Container Registry (ghcr.io)
2. Build de imagen Docker (multi-stage, stage production)
3. Push con tags automáticos:
   - :main (rama)
   - :v1.2.3 (desde tag semver)
   - :sha-abc1234 (hash de commit)
```

La imagen es accesible en: `ghcr.io/<usuario>/<repositorio>`

---

## Estructura de carpetas

```
laik-tech/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint + Build + Test
│       └── cd.yml              # Docker build + push
│
├── prisma/
│   ├── schema.prisma           # Modelos y enums de base de datos
│   ├── seed.ts                 # Datos de prueba (plants, types, clients, margins)
│   ├── tsconfig.seed.json      # Config TS exclusiva para el seed
│   └── migrations/             # Historial de migraciones SQL (auto-generado)
│
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Módulo raíz
│   │
│   ├── common/                 # Código reutilizable entre módulos
│   │   ├── enums/              # VolumeRange, PricingStrategy
│   │   ├── pagination/         # PaginationArgs, PaginatedResponseBase
│   │   └── responses/          # PayloadBuilder, PayloadBase
│   │
│   ├── config/
│   │   ├── app/                # Configuración global (CORS, pipes, prefijo)
│   │   └── graphql/            # GraphQLModule.forRootAsync
│   │
│   ├── prisma/                 # PrismaService y PrismaModule
│   │
│   └── modules/
│       ├── plants/
│       │   ├── __test__/       # plants.service.spec + plants.resolver.spec
│       │   ├── dto/            # CreatePlantInput, UpdatePlantInput
│       │   ├── entities/       # Plant (@ObjectType)
│       │   ├── repositories/   # PlantsRepository + PlantsRepositoryPrisma
│       │   ├── types/          # PlantResponse, PaginatedPlantsResponse
│       │   ├── plants.module.ts
│       │   ├── plants.service.ts
│       │   └── plants.resolver.ts
│       │
│       ├── client-types/       # (misma estructura que plants)
│       ├── clients/            # (misma estructura que plants)
│       └── margin-configs/     # (misma estructura + tipos adicionales)
│
├── Dockerfile                  # Multi-stage: builder + production
├── docker-compose.yml          # API + PostgreSQL para desarrollo
├── .dockerignore
└── .env.example
```

---

## Patrones y convenciones

- **Barrel exports**: cada carpeta expone sus miembros a través de `index.ts`
- **Path aliases**: `@common/*`, `@modules/*`, `@app/*`, `@config/*` en vez de rutas relativas
- **Repository Pattern**: el service nunca importa `PrismaService` directamente
- **PayloadBuilder**: todas las respuestas GraphQL tienen la misma forma `{ data, message, status, success }`
- **Paginación reutilizable**: `PaginationArgs` (input) y `PaginatedResponseBase` (output) en `common/`
- **Enums GraphQL**: registrados con `registerEnumType` para aparecer en el schema
- **Validación automática**: `ValidationPipe` global con `whitelist: true` y `transform: true`
