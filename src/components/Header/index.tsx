import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { FlexBox, Thumbnail, TextField, Theme } from '@lumx/react';
import { mdiMagnify } from '@lumx/icons';

import styles from './Header.module.scss';
import logo from '../../assets/logo.png';

export const Header: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setSearchValue(searchParams.get('q') ?? '');
  }, [searchParams]);

  const submitSearch = (value: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      const trimmedValue = value.trim();

      if (trimmedValue) {
        next.set('q', trimmedValue);
      } else {
        next.delete('q');
      }
      next.delete('page');

      return next;
    });
  };

  return (
    <header className={styles.header}>
      <FlexBox className={styles.logo} orientation="horizontal" vAlign="space-between" hAlign="center">
        <Thumbnail
          image={logo}
          className={styles.logo}
          alt="My Static App Logo"
        />

        <TextField
          theme={Theme.light}
          icon={mdiMagnify}
          label="Search"
          placeholder="Search a character by name"
          value={searchValue}
          onChange={(value) => setSearchValue(value)}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
              submitSearch(searchValue);
            }
          }}
          clearButtonProps={{ label: 'Clear search' }}
          onClear={() => {
            setSearchValue('');
            submitSearch('');
          }}
        />
      </FlexBox>
    </header>
  );
};
