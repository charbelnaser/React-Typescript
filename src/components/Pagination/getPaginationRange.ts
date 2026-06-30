export type PaginationItem = number | 'ellipsis';

export function getPaginationRange(currentPage: number, totalPages: number, siblingCount = 1): PaginationItem[] {
  const totalVisiblePages = siblingCount * 2 + 5;

  if (totalVisiblePages >= totalPages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const pages: PaginationItem[] = [1];

  if (showLeftEllipsis) {
    pages.push('ellipsis');
  } else {
    for (let page = 2; page < leftSibling; page += 1) {
      pages.push(page);
    }
  }

  for (let page = leftSibling; page <= rightSibling; page += 1) {
    if (page !== 1 && page !== totalPages) {
      pages.push(page);
    }
  }

  if (showRightEllipsis) {
    pages.push('ellipsis');
  } else {
    for (let page = rightSibling + 1; page < totalPages; page += 1) {
      pages.push(page);
    }
  }

  pages.push(totalPages);

  return pages;
}
