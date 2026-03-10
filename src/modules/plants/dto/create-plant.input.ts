import { InputType, Field } from '@nestjs/graphql'
import { IsString, IsNotEmpty } from 'class-validator'

@InputType()
export class CreatePlantInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string
}
