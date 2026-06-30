import React from 'react';

import { AspectRatio, Chip, ChipGroup, FlexBox, Heading, Icon, Text, Thumbnail, Tooltip } from '@lumx/react';
import { mdiAccountCircle, mdiCalendarBlankOutline, mdiShieldAccount, mdiTagOutline } from '@lumx/icons';

import { Character, ReactionSummary } from '../../types';
import styles from './CharacterCard.module.scss';

interface CharacterCardProps {
  character: Character;
  reactions: ReactionSummary[];
}


export const CharacterCard: React.FC<CharacterCardProps> = ({ character, reactions }) => {
  const { name, species, birthYear, description, imageUrl, affiliations } = character;

  return (
    <article className={styles.card}>
      {imageUrl ? (
        <Thumbnail
          className={styles.thumbnail}
          image={imageUrl}
          alt={name}
          aspectRatio={AspectRatio.square}
          fallback={mdiAccountCircle}
        />
      ) : (
        <div className={`${styles.thumbnail} ${styles.thumbnailFallback}`}>
          <Icon icon={mdiAccountCircle} size="xl" alt={name} />
        </div>
      )}

      <FlexBox orientation="vertical" className={styles.body} gap="regular">
        <FlexBox orientation="horizontal" hAlign="center" gap="regular" wrap>
          <Heading as="h3" typography="title">
            {name}
          </Heading>

          {species && (
            <Chip before={<Icon icon={mdiTagOutline} size="xs" />} size="s">
              {species}
            </Chip>
          )}

          {birthYear && (
            <Chip before={<Icon icon={mdiCalendarBlankOutline} size="xs" />} size="s">
              {birthYear}
            </Chip>
          )}
        </FlexBox>

        <Text as="p" className={styles.description}>
          {description ?? 'No description available.'}
        </Text>

        {affiliations.length > 0 && (
          <FlexBox orientation="horizontal" hAlign="center" gap="tiny" wrap>
            <Icon icon={mdiShieldAccount} size="xs" className={styles.affiliationsIcon} />
            <ChipGroup>
              {affiliations.map((affiliation) => (
                <Chip key={affiliation} size="s" color="grey">
                  {affiliation}
                </Chip>
              ))}
            </ChipGroup>
          </FlexBox>
        )}

        {reactions.length > 0 && (
          <FlexBox orientation="horizontal" gap="tiny" wrap className={styles.reactions} aria-label="Reactions">
            {reactions.map(({ content, count }) => (
              <Tooltip key={content} label={`${count} reaction${count > 1 ? 's' : ''}`}>
                <span className={styles.reaction}>
                  {content} {count}
                </span>
              </Tooltip>
            ))}
          </FlexBox>
        )}
      </FlexBox>
    </article>
  );
};
