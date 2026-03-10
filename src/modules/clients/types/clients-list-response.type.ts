import { Field, ObjectType } from '@nestjs/graphql'

import { PayloadBase } from '@common/responses'
import { Client } from '../entities'

@ObjectType({ description: 'List of clients response' })
export class ClientsListResponse extends PayloadBase {
  @Field(() => [Client], { description: 'List of clients' })
  data: Client[]
}
