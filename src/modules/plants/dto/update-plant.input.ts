import { InputType, Field, Int } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsInt } from 'class-validator'

@InputType()
export class UpdatePlantInput {
  @Field(() => Int)
  @IsInt()
  id: number

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string
}
