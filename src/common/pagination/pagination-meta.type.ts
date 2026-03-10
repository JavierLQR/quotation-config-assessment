import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'Metadata for paginated responses' })
export class PaginationMetaType {
  @Field(() => Int, { description: 'Total number of records' })
  totalCount: number

  @Field(() => Int, { description: 'Total number of pages' })
  pageCount: number

  @Field(() => Int, { description: 'Current page number' })
  currentPage: number

  @Field({ description: 'Whether this is the first page' })
  isFirstPage: boolean

  @Field({ description: 'Whether this is the last page' })
  isLastPage: boolean

  @Field(() => Int, { nullable: true, description: 'Previous page number' })
  previousPage: number | null

  @Field(() => Int, { nullable: true, description: 'Next page number' })
  nextPage: number | null
}
