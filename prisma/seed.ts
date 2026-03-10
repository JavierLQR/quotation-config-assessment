import { PrismaClient, VolumeRange } from '@prisma/client'

const prisma = new PrismaClient()

const VOLUME_RANGES = Object.values(VolumeRange)

async function main() {
  console.log('🌱 Seeding database...')

  // ── Plants ────────────────────────────────────────────────────────────────

  const plants = await Promise.all(
    ['Planta Monterrey', 'Planta Guadalajara', 'Planta CDMX'].map((name) =>
      prisma.plant.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  )

  console.log(`  ✓ ${plants.length} plants`)

  // ── Client Types ──────────────────────────────────────────────────────────

  const clientTypeData = [
    { name: 'Industrial', basePrice: 25.5, pricingStrategy: 'POR_ESTRUCTURA' },
    { name: 'Comercial', basePrice: 30.0, pricingStrategy: 'POR_ESTRUCTURA' },
    { name: 'Gobierno', basePrice: 22.0, pricingStrategy: 'NO_VINCULAR' },
    {
      name: 'Distribuidor',
      basePrice: 20.0,
      pricingStrategy: 'POR_ESTRUCTURA',
    },
  ]

  const clientTypes = await Promise.all(
    clientTypeData.map((ct) =>
      prisma.clientType.upsert({
        where: { name: ct.name },
        update: {},
        create: ct,
      }),
    ),
  )

  console.log(`  ✓ ${clientTypes.length} client types`)

  // ── Clients ───────────────────────────────────────────────────────────────
  //
  // Los clientes con clientTypeName: null quedan "sin tipo de cliente".
  // En la pantalla de márgenes aparecen en la sección "Sin tipo de cliente"
  // al final de la tabla. Esto también ocurre si se elimina el tipo de un
  // cliente existente vía la API (el campo clientTypeId se pone en null
  // automáticamente gracias a onDelete: SetNull en el schema).

  const clientsData: {
    name: string
    clientTypeName: string | null
    basePrice?: number
    pricingStrategy?: string
  }[] = [
    {
      name: 'Aceros del Norte S.A.',
      clientTypeName: 'Industrial',
      basePrice: 26.0,
      pricingStrategy: 'POR_ESTRUCTURA',
    },
    {
      name: 'Metalúrgica Regia',
      clientTypeName: 'Industrial',
      basePrice: 27.5,
    },
    {
      name: 'Cementos del Pacífico',
      clientTypeName: 'Industrial',
      basePrice: 24.0,
      pricingStrategy: 'NO_VINCULAR',
    },
    {
      name: 'Supermercados La Economía',
      clientTypeName: 'Comercial',
      basePrice: 32.0,
    },
    {
      name: 'Cadena Comercial Oriente',
      clientTypeName: 'Comercial',
      basePrice: 31.0,
      pricingStrategy: 'POR_ESTRUCTURA',
    },
    { name: 'Tiendas MegaMax', clientTypeName: 'Comercial' },
    {
      name: 'Gobierno Federal - IMSS',
      clientTypeName: 'Gobierno',
      basePrice: 21.0,
      pricingStrategy: 'NO_VINCULAR',
    },
    { name: 'Gobierno Estatal NL', clientTypeName: 'Gobierno' },
    {
      name: 'Distribuidora del Valle',
      clientTypeName: 'Distribuidor',
      basePrice: 19.5,
      pricingStrategy: 'POR_ESTRUCTURA',
    },
    {
      name: 'LogiExpress México',
      clientTypeName: 'Distribuidor',
      basePrice: 18.0,
    },
    { name: 'Red Distribución Centro', clientTypeName: 'Distribuidor' },
    {
      name: 'Químicos Industriales S.A.',
      clientTypeName: 'Industrial',
      basePrice: 28.0,
    },
    // ── Sin tipo de cliente ───────────────────────────────────────────────
    // Clientes importados / pendientes de clasificar. Se muestran en la
    // sección "Sin tipo de cliente" del frontend.
    {
      name: 'Importadora Pacífico',
      clientTypeName: null,
      basePrice: 23.0,
    },
    {
      name: 'Constructora Norteña S.A.',
      clientTypeName: null,
      basePrice: 29.5,
    },
    {
      name: 'Transportes Veloz',
      clientTypeName: null,
    },
  ]

  const clientTypeMap = Object.fromEntries(
    clientTypes.map((ct) => [ct.name, ct.id]),
  )

  await prisma.client.deleteMany()

  const clients = await Promise.all(
    clientsData.map((c) =>
      prisma.client.create({
        data: {
          name: c.name,
          clientTypeId:
            c.clientTypeName !== null
              ? (clientTypeMap[c.clientTypeName] ?? null)
              : null,
          basePrice: c.basePrice ?? null,
          pricingStrategy: c.pricingStrategy ?? null,
        },
      }),
    ),
  )

  console.log(`  ✓ ${clients.length} clients`)

  // ── Margin Configs ────────────────────────────────────────────────────────

  const marginEntries: {
    plantId: number
    clientTypeId?: number
    clientId?: number
    volumeRange: VolumeRange
    margin: number
  }[] = []

  const marginsPerClientType: Record<string, Record<string, number>> = {
    Industrial: {
      KG_300: 12,
      KG_500: 11,
      T_1: 10,
      T_3: 9,
      T_5: 8,
      T_10: 7,
      T_20: 6.5,
      T_30: 6,
    },
    Comercial: {
      KG_300: 15,
      KG_500: 14,
      T_1: 13,
      T_3: 12,
      T_5: 10,
      T_10: 9,
      T_20: 8,
      T_30: 7,
    },
    Gobierno: {
      KG_300: 8,
      KG_500: 7,
      T_1: 6,
      T_3: 5,
      T_5: 4.5,
      T_10: 4,
      T_20: 3.5,
      T_30: 3,
    },
    Distribuidor: {
      KG_300: 10,
      KG_500: 9,
      T_1: 8,
      T_3: 7,
      T_5: 6,
      T_10: 5,
      T_20: 4,
      T_30: 3.5,
    },
  }

  for (const plant of plants) {
    for (const ct of clientTypes) {
      const typeMargins = marginsPerClientType[ct.name]
      if (!typeMargins) continue

      for (const vr of VOLUME_RANGES) {
        marginEntries.push({
          plantId: plant.id,
          clientTypeId: ct.id,
          volumeRange: vr,
          margin: typeMargins[vr] ?? 10,
        })
      }
    }
  }

  const clientOverrides: Record<string, Record<string, number>> = {
    'Aceros del Norte S.A.': {
      KG_300: 14,
      KG_500: 13,
      T_1: 11,
      T_3: 10,
      T_5: 9,
      T_10: 8,
      T_20: 7,
      T_30: 6.5,
    },
    'Cementos del Pacífico': {
      KG_300: 9,
      KG_500: 8,
      T_1: 6,
      T_3: 5,
      T_5: 4,
      T_10: 3,
      T_20: 2.5,
      T_30: 2,
    },
    'Gobierno Federal - IMSS': {
      KG_300: 7,
      KG_500: 6,
      T_1: 5,
      T_3: 4,
      T_5: 3.5,
      T_10: 3,
      T_20: 2,
      T_30: 1.5,
    },
    'Distribuidora del Valle': {
      KG_300: 11,
      KG_500: 10,
      T_1: 9,
      T_3: 8,
      T_5: 7,
      T_10: 5,
      T_20: 4.5,
      T_30: 4,
    },
    'Supermercados La Economía': {
      KG_300: 18,
      KG_500: 16,
      T_1: 14,
      T_3: 12,
      T_5: 11,
      T_10: 10,
      T_20: 9,
      T_30: 8,
    },
  }

  const clientNameMap = Object.fromEntries(clients.map((c) => [c.name, c]))

  for (const [clientName, volumeMargins] of Object.entries(clientOverrides)) {
    const client = clientNameMap[clientName]
    if (!client) continue

    for (const plant of plants) {
      for (const vr of VOLUME_RANGES) {
        marginEntries.push({
          plantId: plant.id,
          clientId: client.id,
          volumeRange: vr,
          margin: volumeMargins[vr] ?? 10,
        })
      }
    }
  }

  await prisma.marginConfig.deleteMany()

  let created = 0
  for (const entry of marginEntries) {
    await prisma.marginConfig.create({ data: entry })
    created++
  }

  console.log(`  ✓ ${created} margin configs`)
  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
