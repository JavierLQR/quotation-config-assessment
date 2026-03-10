import { InputType, Field, Int, Float } from '@nestjs/graphql'
import { IsInt, IsNumber, IsOptional, IsIn } from 'class-validator'

import {
  type VolumeRangeType,
  volumeRangeValues,
  volumeRange,
} from '@app/common/enums'

@InputType()
export class UpsertMarginInput {
  @Field(() => Int)
  @IsInt()
  plantId: number

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
