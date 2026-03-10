import { Field, ObjectType } from '@nestjs/graphql'

import { PayloadBase } from '@common/responses'
import { ClientType } from '../entities'

@ObjectType({ description: 'Single client type response' })
export class ClientTypeResponse extends PayloadBase {
  @Field(() => ClientType, { nullable: true, description: 'Client type data' })
  data?: ClientType
}
