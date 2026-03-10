import { registerEnumType } from '@nestjs/graphql'

/**
 * Volume range enum
 */
export const volumeRange = {
  KG_300: 'KG_300',
  KG_500: 'KG_500',
  T_1: 'T_1',
  T_3: 'T_3',
  T_5: 'T_5',
  T_10: 'T_10',
  T_20: 'T_20',
  T_30: 'T_30',
} as const

/**
 * Type of the volume range
 */
export type VolumeRangeType = (typeof volumeRange)[keyof typeof volumeRange]

/**
 * Returns the values of the volume range enum
 */
export const volumeRangeValues: VolumeRangeType[] = Object.values(volumeRange)

/**
 * Registers the volume range enum with NestJS GraphQL
 */
registerEnumType(volumeRange, {
  name: 'VolumeRange',
  description: 'Volume ranges for margin configuration',
  valuesMap: {
    KG_300: { description: '300 kilograms' },
    KG_500: { description: '500 kilograms' },
    T_1: { description: '1 ton' },
    T_3: { description: '3 tons' },
    T_5: { description: '5 tons' },
    T_10: { description: '10 tons' },
    T_20: { description: '20 tons' },
    T_30: { description: '30 tons' },
  },
})
