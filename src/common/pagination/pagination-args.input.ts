import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsPositive, Max, Min } from 'class-validator'

@InputType()
export class PaginationArgs {
  @Field(() => Int, {
    defaultValue: 1,
    description: 'Page number (starts at 1)',
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  page: number = 1

  @Field(() => Int, {
    defaultValue: 10,
    description: 'Number of items per page',
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  perPage: number = 10
}
