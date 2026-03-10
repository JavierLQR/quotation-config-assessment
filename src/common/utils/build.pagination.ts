/**
 * @description Pagination meta interface
 * @property {number} totalCount
 * @property {number} pageCount
 * @property {number} currentPage
 * @property {boolean} isFirstPage
 * @property {boolean} isLastPage
 * @property {number | null} previousPage
 * @property {number | null} nextPage
 */
export interface PaginationMeta {
  totalCount: number
  pageCount: number
  currentPage: number
  isFirstPage: boolean
  isLastPage: boolean
  previousPage: number | null
  nextPage: number | null
}

/**
 * @description Props for pagination meta
 * @property {number} totalCount
 * @property {number} currentPage
 * @property {number} perPage
 */
interface PropsPaginationMeta {
  totalCount: number
  currentPage: number
  perPage: number
}

/**
 * @description Build pagination meta
 * @param {PropsPaginationMeta} props
 * @returns {PaginationMeta}
 * @description Builds the pagination meta object based on the total count, current page, and per page values.
 * @example
 * const paginationMeta = buildPaginationMeta({
 *   totalCount: 100,
 *   currentPage: 1,
 *   perPage: 10,
 * })
 * @returns {PaginationMeta}
 * @example
 * {
 *   totalCount: 100,
 *   pageCount: 10,
 *   currentPage: 1,
 *   isFirstPage: true,
 *   isLastPage: false,
 *   previousPage: null,
 *   nextPage: 2,
 * }
 */
const buildPaginationMeta = ({
  totalCount,
  currentPage,
  perPage,
}: PropsPaginationMeta): PaginationMeta => {
  const safePer = perPage > 0 ? perPage : 1
  const pageCount = totalCount > 0 ? Math.ceil(totalCount / safePer) : 0

  return {
    totalCount,
    pageCount,
    currentPage,
    isFirstPage: currentPage === 1,
    isLastPage: totalCount === 0 || currentPage >= pageCount,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < pageCount ? currentPage + 1 : null,
  }
}

export default buildPaginationMeta
