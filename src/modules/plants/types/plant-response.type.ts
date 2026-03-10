import { Field, ObjectType } from '@nestjs/graphql'

import { PayloadBase } from '@common/responses'
import { Plant } from '../entities'

@ObjectType({ description: 'Single plant response' })
export class PlantResponse extends PayloadBase {
  @Field(() => Plant, { nullable: true, description: 'Plant data' })
  data?: Plant
}
