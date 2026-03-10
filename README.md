# Quotation Configuration System

Sistema completo de **Configuración de Cotización** con backend GraphQL (NestJS) y frontend administrativo (Next.js). Permite definir y gestionar márgenes de ganancia por planta, tipo de cliente y rango de volumen, con una interfaz moderna y responsive.

---

## 📦 Ubicación de Entregables (Backend)

Para facilitar la revisión, aquí están las ubicaciones exactas de cada entregable solicitado:

### 1️⃣ Modelo de DB en Prisma (`schema.prisma`)

**Ubicación:** [`prisma/schema.prisma`](./prisma/schema.prisma)

**Qué encontrarás:**
- Modelos: `Plant`, `ClientType`, `Client`, `MarginConfig`
- Enum: `VolumeRange` (8 rangos de volumen)
- Relaciones y constraints (unique, cascadas, nullable)
- Documentación inline de cada modelo

**Ver también:**
- Migraciones SQL: [`prisma/migrations/`](./prisma/migrations/)
- Seed data: [`prisma/seed.ts`](./prisma/seed.ts)

---

### 2️⃣ Schema GraphQL + Resolvers

**Este proyecto usa GraphQL Code First**, el schema se genera automáticamente desde decorators TypeScript.

**Ubicaciones de los Resolvers:**

| Módulo | Resolver | Entities | DTOs |
|--------|----------|----------|------|
| **Plants** | [`src/modules/plants/plants.resolver.ts`](./src/modules/plants/plants.resolver.ts) | [`entities/plant.entity.ts`](./src/modules/plants/entities/plant.entity.ts) | [`dto/`](./src/modules/plants/dto/) |
| **Client Types** | [`src/modules/client-types/client-types.resolver.ts`](./src/modules/client-types/client-types.resolver.ts) | [`entities/client-type.entity.ts`](./src/modules/client-types/entities/client-type.entity.ts) | [`dto/`](./src/modules/client-types/dto/) |
| **Clients** | [`src/modules/clients/clients.resolver.ts`](./src/modules/clients/clients.resolver.ts) | [`entities/client.entity.ts`](./src/modules/clients/entities/client.entity.ts) | [`dto/`](./src/modules/clients/dto/) |
| **Margin Configs** | [`src/modules/margin-configs/margin-configs.resolver.ts`](./src/modules/margin-configs/margin-configs.resolver.ts) | [`entities/margin-config.entity.ts`](./src/modules/margin-configs/entities/margin-config.entity.ts) | [`dto/`](./src/modules/margin-configs/dto/) |

**Schema GraphQL generado:**
- Después de `pnpm build`, se puede visualizar en Apollo Playground: `http://localhost:4000/api-v1/graphql`
- Introspección disponible en el playground para ver todos los types, queries y mutations

**Queries principales:**
```graphql
plants(pagination: PaginationArgs)
clientTypes(pagination: PaginationArgs)
clients(pagination: PaginationArgs)
marginsByPlant(plantId: ID!)
```

**Mutations principales:**
```graphql
createPlant(input: CreatePlantInput!)
createClient(input: CreateClientInput!)
updateClient(input: UpdateClientInput!)
savePlantConfig(input: SavePlantConfigInput!)  # ← Guarda todos los márgenes de una planta
```

---

### 3️⃣ Instrucciones para Correr el Proyecto (Backend)

**README completo:** [`README.md`](./README.md) (este archivo)

**Quick Start:**

```bash
# 1. Levantar PostgreSQL con Docker
docker compose up -d db

# 2. Instalar dependencias
pnpm install

# 3. Crear tablas en la base de datos
npx prisma migrate dev

# 4. Cargar datos de prueba
npx prisma db seed

# 5. Iniciar el servidor
pnpm start:dev

# 6. Abrir Apollo Playground
# http://localhost:4000/api-v1/graphql
```

**Secciones importantes del README:**
- [Variables de entorno](#variables-de-entorno)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Docker](#docker)
- [Tests](#tests) - 62 tests unitarios
- [CI/CD](#cicd) - GitHub Actions configurado

---

### 4️⃣ Componentes React → Ver Frontend

**El frontend está en un repositorio separado:** `quotation-config-assessment-frontend`

Ver: [Frontend README](https://github.com/JavierLQR/quotation-config-assessment-frontend#-ubicación-de-entregables-frontend) para la ubicación de los componentes React.

---

## 📋 Tabla de contenidos

- [Ubicación de Entregables](#-ubicación-de-entregables)
- [Descripción general](#descripción-general)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Modelo de base de datos](#modelo-de-base-de-datos)
- [API GraphQL](#api-graphql)
- [Frontend](#frontend)
- [Requisitos previos](#requisitos-previos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Docker](#docker)
- [Tests](#tests)
- [CI/CD](#cicd)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Git Workflow y Branching Strategy](#git-workflow-y-branching-strategy)
- [Características destacadas](#características-destacadas)

---

## Descripción general

El sistema permite:

- 🏭 Gestionar **plantas** (sedes) donde se realizan operaciones
- 👥 Definir **tipos de cliente** con precio base y estrategia de precios
- 📋 Registrar **clientes** individuales vinculados a un tipo (o sin tipo)
- 💰 Configurar **márgenes de ganancia** por planta, rango de volumen y opcionalmente por tipo de cliente o cliente específico
- 📊 Cada configuración de margen soporta 8 rangos de volumen: `300 kg`, `500 kg`, `1T`, `3T`, `5T`, `10T`, `20T`, `30T`
- ⚠️ Alertas visuales para márgenes críticos (≤ 5%)
- 🔄 Caché inteligente para cambios de planta
- 📱 Interfaz responsive (mobile, tablet, desktop)

---

## Stack tecnológico

### Backend

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

### Frontend

| Capa | Tecnología |
|------|-----------|
| Framework | [Next.js v15](https://nextjs.org/) (App Router) |
| Lenguaje | TypeScript 5 (strict mode) |
| GraphQL Client | [Apollo Client v4](https://www.apollographql.com/docs/react/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Components | [Shadcn/ui](https://ui.shadcn.com/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Validación | Zod |
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

## Frontend

### Descripción

Interfaz administrativa moderna y responsive construida con Next.js 15 y Apollo Client. Permite gestionar la configuración de márgenes de forma visual e intuitiva.

### Características principales

- **📊 Tabla editable agrupada por tipo de cliente**
  - Filas expandibles/colapsables
  - Edición inline de márgenes con validación en tiempo real
  - Alertas visuales para márgenes críticos (≤ 5%)
  
- **🔄 Gestión de clientes**
  - Crear nuevos clientes con asignación de tipo
  - Editar clientes existentes (nombre, tipo, precio base, vinculación)
  - Soporte para clientes "Sin tipo de cliente"
  - Modales modernos con validación Zod

- **💾 Sistema de guardado inteligente**
  - Botón sticky siempre visible
  - Badge "Sin guardar" cuando hay cambios pendientes
  - Toasts informativos (éxito/error)
  - Solo envía cambios modificados (optimización)
  - Sin skeleton al actualizar (UX fluida)

- **🚀 Optimizaciones de performance**
  - Cache-first de Apollo Client
  - Refetch automático solo después de guardar
  - Cambio de planta instantáneo (usa caché)
  - Estado derivado con `useMemo`
  - Hooks modulares y reutilizables

- **📱 Diseño responsive**
  - Mobile-first
  - Sticky columns para scroll horizontal
  - Header fijo con botón de guardar
  - Adaptable a tablet y desktop

### Variables de entorno (Frontend)

```bash
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/api-v1/graphql
```

### Ejecutar el frontend

```bash
# Desde la carpeta del frontend
cd laik-tech-frontend

# Instalar dependencias
pnpm install

# Iniciar en modo desarrollo
pnpm dev
```

El frontend estará disponible en: **http://localhost:3000**

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

---

## Características destacadas

### Backend

✅ **Repository Pattern** — Desacoplamiento total entre lógica de negocio y base de datos  
✅ **Prisma ORM** — Type-safe database access con migraciones automáticas  
✅ **GraphQL Code First** — Schema generado desde TypeScript decorators  
✅ **Validación robusta** — DTOs con class-validator para todos los inputs  
✅ **Tests unitarios** — 62 tests con 100% de éxito (service + resolver)  
✅ **CI/CD completo** — Lint, Build, Test y Docker build automatizados  
✅ **Multi-stage Docker** — Imagen optimizada para producción  
✅ **Seeding inteligente** — Datos de prueba realistas para desarrollo  

### Frontend

✅ **Next.js 15 App Router** — Server Components + Client Components estratégicos  
✅ **Apollo Client v4** — Cache inteligente con fetchPolicy: 'cache-first'  
✅ **Arquitectura modular** — Separación por features (modules/) y shared/  
✅ **Hooks personalizados** — Lógica reutilizable y testeable  
✅ **TypeScript estricto** — Tipos end-to-end desde GraphQL hasta UI  
✅ **Shadcn/ui** — Componentes accesibles y customizables  
✅ **Optimistic UI** — Guardado sin skeleton, UX fluida  
✅ **Responsive design** — Mobile-first, sticky elements, scroll horizontal

### Arquitectura

✅ **Monorepo conceptual** — Backend y Frontend separados pero cohesionados  
✅ **Type-safety end-to-end** — GraphQL schema → TypeScript types → UI  
✅ **Clientless DB models** — Soporte para clientes sin tipo asignado  
✅ **Upsert transactions** — Manejo correcto de unique constraints con nullables  
✅ **Error handling** — Toasts informativos y logs de debugging  

---

## Git Workflow y Branching Strategy

### Convención de Branching

Este proyecto sigue **Git Flow** simplificado con las siguientes convenciones:

#### Branches principales:

- **`main`** — Código en producción (solo merges desde `staging` después de QA)
- **`staging`** — Pre-producción para QA y testing final
- **`develop`** — Integración continua de features (branch de desarrollo activo)

#### Estrategia de promoción:

```
┌─────────────┐
│   develop   │  ← PRs desde feature/* (desarrollo activo)
└──────┬──────┘
       │ merge (cuando se completa sprint/milestone)
       ↓
┌─────────────┐
│   staging   │  ← Testing y QA
└──────┬──────┘
       │ merge (solo después de QA OK)
       ↓
┌─────────────┐
│    main     │  ← Producción (código estable)
└─────────────┘
```

**Reglas importantes:**

- ✅ Features se crean desde `develop`: `git checkout -b feature/xxx develop`
- ✅ PRs de features van hacia `develop`, **nunca directo a main o staging**
- ✅ `develop` → `staging`: Merge cuando se completa un sprint o milestone
- ✅ `staging` → `main`: Merge **solo después** de QA aprobado
- ❌ NUNCA hacer merge directo de feature → main
- ❌ NUNCA hacer commits directos en `main`, `staging` o `develop`
- ❌ NUNCA hacer `git push --force` en branches principales

#### Branches de trabajo:

```
feature/<nombre-descriptivo>    # Nuevas funcionalidades
fix/<nombre-del-bug>            # Corrección de bugs
refactor/<area>                 # Refactorización sin cambios funcionales
chore/<tarea>                   # Mantenimiento (deps, config, etc.)
```

#### Ejemplos reales de este proyecto:

```bash
feature/margins-config          # Módulo de configuración de márgenes
feature/client-management       # CRUD de clientes
feature/plant-selector          # Selector de plantas en UI
fix/nullable-client-type        # Soporte para clientes sin tipo
refactor/repository-pattern     # Implementación del Repository Pattern
chore/ci-cd-setup              # Configuración de GitHub Actions
```

---

### Mantener Branch Actualizado con Develop

#### Estrategia recomendada: **Rebase con develop**

Las features se desarrollan desde `develop` y se mantienen actualizadas con él:

```bash
# 1. Estando en tu feature branch
git checkout feature/margins-config

# 2. Traer últimos cambios de develop (no main)
git fetch origin develop

# 3. Rebase interactivo (permite limpiar commits)
git rebase origin/develop

# 4. Si hay conflictos, resolverlos y continuar
git add .
git rebase --continue

# 5. Forzar push (solo en branches personales, NUNCA en main/staging/develop)
git push --force-with-lease origin feature/margins-config
```

#### Cuándo usar **Merge** en lugar de Rebase:

```bash
# Si la feature ya fue compartida con otros desarrolladores
git checkout feature/margins-config
git merge origin/develop

# Resolver conflictos si los hay
git add .
git commit -m "Merge develop into feature/margins-config"
git push origin feature/margins-config
```

#### Workflow completo con develop → staging → main:

```bash
# ──────────────────────────────────────────────────────────
# Día 1: Crear feature branch desde develop
# ──────────────────────────────────────────────────────────
git checkout develop
git pull origin develop
git checkout -b feature/margins-config

# ... trabajar, commits ...
git add .
git commit -m "feat: add MarginConfig entity and repository"
git push origin feature/margins-config

# ──────────────────────────────────────────────────────────
# Día 2: Actualizar con cambios de develop
# ──────────────────────────────────────────────────────────
git fetch origin develop
git rebase origin/develop
# Resolver conflictos si los hay
git push --force-with-lease origin feature/margins-config

# ──────────────────────────────────────────────────────────
# Día 3: Feature completa - PR hacia develop
# ──────────────────────────────────────────────────────────
git fetch origin develop
git rebase origin/develop
git push --force-with-lease origin feature/margins-config
# Crear Pull Request: feature/margins-config → develop

# ──────────────────────────────────────────────────────────
# Después del merge a develop: Deploy a staging
# ──────────────────────────────────────────────────────────
git checkout staging
git pull origin staging
git merge develop  # Merge develop → staging
git push origin staging
# CI/CD despliega automáticamente a entorno de staging

# ──────────────────────────────────────────────────────────
# Después de QA en staging: Deploy a producción
# ──────────────────────────────────────────────────────────
git checkout main
git pull origin main
git merge staging  # Merge staging → main (solo después de QA)
git tag -a v1.2.0 -m "Release v1.2.0: Margin configuration module"
git push origin main --tags
# CI/CD despliega automáticamente a producción
```

#### Flujo de promoción entre environments:

```
feature/* ──PR──> develop ──merge──> staging ──QA OK──> main
    ↑                                    ↑               ↑
  (rebase)                           (testing)     (production)
```
git commit -m "feat: add MarginConfig entity and repository"

# Día 2: Actualizar con cambios de main
git fetch origin main
git rebase origin/main
# Resolver conflictos si los hay
git push --force-with-lease origin feature/margins-config

# Día 3: Más trabajo
git add .
git commit -m "feat: add GraphQL resolvers for margins"
git push origin feature/margins-config

# Día 4: PR ready - último sync
git fetch origin main
git rebase origin/main
git push --force-with-lease origin feature/margins-config
# Crear Pull Request en GitHub
```

---

### Manejo de Conflictos en `schema.graphql`

#### Escenario:

Dos desarrolladores editando el mismo archivo `schema.graphql` (o en el caso de Code First, archivos `.entity.ts` o `.resolver.ts`):

- **Developer A** (tú): Agregando `MarginConfig` type
- **Developer B**: Agregando `Invoice` type

#### Pasos para resolver el conflicto:

**1. Detectar el conflicto durante rebase/merge:**

```bash
git rebase origin/main

# Output:
# Auto-merging src/modules/margin-configs/entities/margin-config.entity.ts
# CONFLICT (content): Merge conflict in schema.graphql
# error: could not apply abc1234... feat: add MarginConfig type
```

**2. Abrir el archivo con conflictos:**

```graphql
<<<<<<< HEAD (main - Developer B)
type Invoice {
  id: ID!
  number: String!
  total: Float!
  client: Client!
}

type Query {
  invoices: [Invoice!]!
  invoice(id: ID!): Invoice
=======
type MarginConfig {
  id: ID!
  plantId: ID!
  volumeRange: VolumeRange!
  margin: Float!
}

type Query {
  marginsByPlant(plantId: ID!): [MarginConfig!]!
>>>>>>> abc1234 (feature/margins-config - Developer A)
}
```

**3. Resolver el conflicto manualmente:**

Estrategias según el caso:

**Opción A: Ambos cambios son independientes (más común)**

```graphql
# Combinar ambos tipos y queries
type Invoice {
  id: ID!
  number: String!
  total: Float!
  client: Client!
}

type MarginConfig {
  id: ID!
  plantId: ID!
  volumeRange: VolumeRange!
  margin: Float!
}

type Query {
  # Queries de Developer B
  invoices: [Invoice!]!
  invoice(id: ID!): Invoice
  
  # Queries de Developer A (tuyas)
  marginsByPlant(plantId: ID!): [MarginConfig!]!
}
```

**Opción B: Cambios en la misma entidad (requiere coordinación)**

```graphql
# Antes (main):
type Client {
  id: ID!
  name: String!
}

# Developer A agregó:
type Client {
  id: ID!
  name: String!
  clientTypeId: ID!  # ← Tu cambio
}

# Developer B agregó:
type Client {
  id: ID!
  name: String!
  email: String!     # ← Cambio de otro dev
}

# Resolución: Combinar ambos campos
type Client {
  id: ID!
  name: String!
  clientTypeId: ID!  # ← Tu cambio
  email: String!     # ← Cambio de otro dev
}
```

**4. Marcar conflicto como resuelto:**

```bash
# Eliminar marcadores de conflicto (<<<<, ====, >>>>)
# Verificar que el código compila
pnpm build

# Agregar archivo resuelto
git add src/modules/margin-configs/entities/margin-config.entity.ts

# Continuar rebase
git rebase --continue

# O si era merge:
git commit -m "Merge main into feature/margins-config - resolve schema conflicts"
```

**5. Ejecutar tests y verificar:**

```bash
# Regenerar schema GraphQL si es Code First
pnpm build

# Ejecutar tests
pnpm test

# Si todo pasa, push
git push --force-with-lease origin feature/margins-config
```

---

### Prevención de Conflictos

#### 1. **Comunicación en equipo:**

```bash
# Antes de trabajar en un módulo compartido, avisar:
# "Voy a trabajar en el módulo de clients, tocaré client.entity.ts"

# Si alguien ya está trabajando ahí:
# - Coordinar para no editar los mismos campos
# - O trabajar en branches de corta duración
# - O usar pair programming para ese archivo
```

#### 2. **Modularidad (Code First):**

Este proyecto usa **GraphQL Code First** con NestJS, lo que reduce conflictos:

```typescript
// ✅ Cada módulo tiene su propio archivo de entidades
src/modules/margin-configs/entities/margin-config.entity.ts
src/modules/clients/entities/client.entity.ts
src/modules/invoices/entities/invoice.entity.ts  // ← Developer B

// ✅ Menos conflictos porque cada dev edita archivos diferentes
```

#### 3. **Pull Requests pequeños:**

```bash
# ✅ Bueno: Feature pequeña, fácil de revisar
feature/add-margin-config (5 archivos, 200 líneas)

# ❌ Malo: Feature gigante, tarda días, muchos conflictos
feature/complete-quotation-module (50 archivos, 3000 líneas)
```

#### 4. **Syncs frecuentes:**

```bash
# ✅ Rebase diario (al menos)
git fetch origin main && git rebase origin/main

# En lugar de:
# ❌ Trabajar 1 semana sin sync → conflictos masivos
```

---

### Ejemplo Real: Conflicto en Este Proyecto

**Escenario simulado:**

**Developer A (tú):** Hiciste `clientTypeId` nullable en `Client` entity

```typescript
// Tu cambio en: src/modules/clients/entities/client.entity.ts
@Field(() => Int, { nullable: true })  // ← Agregaste nullable
clientTypeId: number | null
```

**Developer B:** Agregó campo `email` en `Client` entity

```typescript
// Cambio de otro dev en el mismo archivo
@Field(() => String, { nullable: true })
email: string | null  // ← Otro dev agregó email
```

**Conflicto al hacer rebase:**

```typescript
<<<<<<< HEAD (main - Developer B)
@Field(() => Int)
clientTypeId: number

@Field(() => String, { nullable: true })
email: string | null
=======
@Field(() => Int, { nullable: true })
clientTypeId: number | null
>>>>>>> feature/nullable-client-type
```

**Resolución:**

```typescript
// Combinar ambos cambios
@Field(() => Int, { nullable: true })  // ← Tu cambio
clientTypeId: number | null

@Field(() => String, { nullable: true })  // ← Cambio de otro dev
email: string | null
```

```bash
git add src/modules/clients/entities/client.entity.ts
git rebase --continue
pnpm test  # Verificar que todo funciona
git push --force-with-lease origin feature/nullable-client-type
```

---

### Herramientas Útiles

#### VS Code para conflictos:

```bash
# VS Code detecta conflictos y muestra botones:
# - "Accept Current Change" (tu cambio)
# - "Accept Incoming Change" (cambio de main)
# - "Accept Both Changes" (combinar ambos)
# - "Compare Changes" (ver diff lado a lado)
```

#### Git commands útiles:

```bash
# Ver qué archivos tienen conflictos
git status

# Abortar rebase si algo sale mal
git rebase --abort

# Ver historial de un archivo
git log --oneline -- src/modules/clients/entities/client.entity.ts

# Ver quién editó cada línea (para coordinar)
git blame src/modules/clients/entities/client.entity.ts
```

---

### Resumen de Best Practices

✅ **Branches descriptivos:** `feature/margins-config` en lugar de `feature/new-stuff`  
✅ **Commits atómicos:** Un cambio lógico por commit  
✅ **Sync frecuente:** Rebase diario con `main`  
✅ **Comunicación:** Avisar cuando editas archivos compartidos  
✅ **PRs pequeños:** Features de 1-3 días, no semanas  
✅ **Tests antes de push:** Siempre ejecutar `pnpm test` después de resolver conflictos  
✅ **Force push seguro:** Usar `--force-with-lease` en lugar de `--force`  
✅ **Code review:** Pedir al menos 1 aprobación antes de merge a `main`

---

## Licencia

MIT

---

## Autor

Desarrollado como assessment técnico para Laik Tech
