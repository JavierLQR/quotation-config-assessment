import { Field, ObjectType } from '@nestjs/graphql'

import { PayloadBase } from '@common/responses'
import { Client } from '../entities'

@ObjectType({ description: 'Single client response' })
export class ClientResponse extends PayloadBase {
  @Field(() => Client, { nullable: true, description: 'Client data' })
  data?: Client
}
