import { type VolumeRangeType } from '@app/common/enums'

export interface UpsertMarginData {
  plantId: number
  clientTypeId?: number | null
  clientId?: number | null
  volumeRange: VolumeRangeType
  margin: number
}

export interface UpsertMarginEntryData {
  clientTypeId?: number | null
  clientId?: number | null
  volumeRange: VolumeRangeType
  margin: number
}
