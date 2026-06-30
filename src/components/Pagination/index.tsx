import React from 'react';

import { Button, Emphasis, Icon, IconButton } from '@lumx/react';
import { mdiChevronLeft, mdiChevronRight, mdiDotsHorizontal } from '@lumx/icons';

import { getPaginationRange } from './getPaginationRange';
import styles from './Pagination.module.scss';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPaginationRange(page, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <IconButton
        icon={mdiChevronLeft}
        label="Previous page"
        isDisabled={page === 1}
        onClick={() => onChange(page - 1)}
      />

      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
            <Icon icon={mdiDotsHorizontal} size="xs" />
          </span>
        ) : (
          <Button
            key={item}
            className={styles.page}
            emphasis={item === page ? Emphasis.medium : Emphasis.low}
            isSelected={item === page}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
          >
            {item}
          </Button>
        ),
      )}

      <IconButton
        icon={mdiChevronRight}
        label="Next page"
        isDisabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      />
    </nav>
  );
};
