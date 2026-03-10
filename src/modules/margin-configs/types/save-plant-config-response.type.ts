import { Field, Int, ObjectType } from '@nestjs/graphql'

import { PayloadBase } from '@common/responses'

@ObjectType({ description: 'Save plant config response' })
export class SavePlantConfigResponse extends PayloadBase {
  @Field(() => Int, { description: 'Number of margin entries saved' })
  data: number
}
