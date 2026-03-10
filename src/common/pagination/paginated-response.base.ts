import { Field, ObjectType } from '@nestjs/graphql'

import { PayloadBase } from '@common/responses/payload.base'
import { PaginationMetaType } from './pagination-meta.type'

@ObjectType({ isAbstract: true })
export abstract class PaginatedResponseBase extends PayloadBase {
  @Field(() => PaginationMetaType, { description: 'Pagination metadata' })
  metadataPagination: PaginationMetaType
}
