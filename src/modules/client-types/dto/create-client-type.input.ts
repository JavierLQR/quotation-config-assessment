import { InputType, Field, Float } from '@nestjs/graphql'
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator'

import { pricingStrategy, pricingStrategyValues } from '../../../common/enums'

@InputType()
export class CreateClientTypeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string

  @Field(() => Float)
  @IsNumber()
  basePrice: number

  @Field(() => pricingStrategy, { nullable: true })
  @IsOptional()
  @IsIn(pricingStrategyValues)
  pricingStrategy?: string
}
