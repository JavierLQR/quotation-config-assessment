import { InputType, Field, Int, Float } from '@nestjs/graphql'
import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator'

import { pricingStrategy, pricingStrategyValues } from '../../../common/enums'

@InputType()
export class UpdateClientInput {
  @Field(() => Int)
  @IsInt()
  id: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  clientTypeId?: number | null

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  basePrice?: number

  @Field(() => pricingStrategy, { nullable: true })
  @IsOptional()
  @IsIn(pricingStrategyValues)
  pricingStrategy?: string
}
