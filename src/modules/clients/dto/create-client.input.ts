import { InputType, Field, Int, Float } from '@nestjs/graphql'
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator'

import { pricingStrategy, pricingStrategyValues } from '../../../common/enums'

@InputType()
export class CreateClientInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string

  @Field(() => Int)
  @IsInt()
  clientTypeId: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  basePrice?: number

  @Field(() => pricingStrategy, { nullable: true })
  @IsOptional()
  @IsIn(pricingStrategyValues)
  pricingStrategy?: string
}
