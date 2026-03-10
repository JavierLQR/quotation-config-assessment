import { registerEnumType } from '@nestjs/graphql'

/**
 * Pricing strategy enum
 */
export const pricingStrategy = {
  POR_ESTRUCTURA: 'POR_ESTRUCTURA',
  NO_VINCULAR: 'NO_VINCULAR',
} as const

/**
 * Type of the pricing strategy
 */
export type PricingStrategyType =
  (typeof pricingStrategy)[keyof typeof pricingStrategy]

/**
 * Returns the values of the pricing strategy enum
 */
export const pricingStrategyValues: PricingStrategyType[] =
  Object.values(pricingStrategy)

/**
 * Registers the pricing strategy enum with NestJS GraphQL
 */
registerEnumType(pricingStrategy, {
  name: 'PricingStrategy',
  description: 'Pricing strategy for client types and clients',
  valuesMap: {
    POR_ESTRUCTURA: { description: 'Price linked by structure' },
    NO_VINCULAR: { description: 'Price not linked' },
  },
})
