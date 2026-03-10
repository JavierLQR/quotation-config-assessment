import { InputType, Field, Int, Float } from '@nestjs/graphql'
import {
  IsInt,
  IsNumber,
  IsIn,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

import {
  type VolumeRangeType,
  volumeRangeValues,
  volumeRange,
} from '@app/common/enums'

@InputType()
export class MarginEntry {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  clientTypeId?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  clientId?: number

  @Field(() => volumeRange)
  @IsIn(volumeRangeValues)
  volumeRange: VolumeRangeType

  @Field(() => Float)
  @IsNumber()
  margin: number
}

@InputType()
export class SavePlantConfigInput {
  @Field(() => Int)
  @IsInt()
  plantId: number

  @Field(() => [MarginEntry])
  @ValidateNested({ each: true })
  @Type(() => MarginEntry)
  margins: MarginEntry[]
}
