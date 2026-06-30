import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { FlexBox, Message, ProgressCircular } from '@lumx/react';

import { fetchCharacters, fetchReactions, addReaction } from '../../api';
import { groupReactionsByCharacter } from '../../utils/reactions';
import { Character, ReactionSummary } from '../../types';
import { CharacterCard } from '../CharacterCard';
import { Pagination } from '../Pagination';

import styles from './Content.module.scss';

const PAGE_SIZE = 4;

export const Content: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [total, setTotal] = useState(0);
  const [reactionsByCharacter, setReactionsByCharacter] = useState<Map<number, ReactionSummary[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchReactions(controller.signal)
      .then((reactions) => setReactionsByCharacter(groupReactionsByCharacter(reactions)))
      .catch((fetchError: Error) => {
        if (fetchError.name !== 'AbortError') {
          console.error('Failed to load reactions', fetchError);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchCharacters({ name: search, page, limit: PAGE_SIZE, signal: controller.signal })
      .then((response) => {
        setCharacters(response.results);
        setTotal(response.total);
      })
      .catch((fetchError: Error) => {
        if (fetchError.name !== 'AbortError') {
          setError('Something went wrong while loading characters. Please try again.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [search, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (!isLoading && !error && page > totalPages) {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        next.set('page', String(totalPages));
        return next;
      });
    }
  }, [isLoading, error, page, totalPages, setSearchParams]);

  const handlePageChange = (nextPage: number) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set('page', String(nextPage));
      return next;
    });
  };

  return (
    <section className={`${styles.content} lumx-spacing-padding-huge`}>
      {isLoading && (
        <FlexBox hAlign="center" className={styles.loader}>
          <ProgressCircular size="m" />
        </FlexBox>
      )}

      {!isLoading && error && <Message kind="error">{error}</Message>}

      {!isLoading && !error && characters.length === 0 && (
        <Message kind="info">No characters found{search ? ` for "${search}"` : ''}.</Message>
      )}

      {!isLoading && !error && characters.length > 0 && (
        <>
          <ul className={styles.list}>
            {characters.map((character) => (
              <li key={character.id}>
                <CharacterCard character={character} reactions={reactionsByCharacter.get(character.id) ?? []} />
              </li>
            ))}
          </ul>

          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </>
      )}
    </section>
  );
};
