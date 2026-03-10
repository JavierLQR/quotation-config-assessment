import { type VolumeRangeType } from '@app/common/enums'

export interface UpsertMarginData {
  plantId: number
  clientTypeId?: number
  clientId?: number
  volumeRange: VolumeRangeType
  margin: number
}

export interface UpsertMarginEntryData {
  clientTypeId?: number
  clientId?: number
  volumeRange: VolumeRangeType
  margin: number
}
