import { Reaction, ReactionSummary } from '../types';

export function groupReactionsByCharacter(reactions: Reaction[]): Map<number, ReactionSummary[]> {
  const countsByCharacter = new Map<number, Map<string, number>>();

  for (const reaction of reactions) {
    if (reaction.deleted || reaction.content === '�') {
      continue;
    }

    const counts = countsByCharacter.get(reaction.characterId) ?? new Map<string, number>();
    counts.set(reaction.content, (counts.get(reaction.content) ?? 0) + 1);
    countsByCharacter.set(reaction.characterId, counts);
  }

  const summariesByCharacter = new Map<number, ReactionSummary[]>();
  for (const [characterId, counts] of countsByCharacter) {
    summariesByCharacter.set(
      characterId,
      Array.from(counts, ([content, count]) => ({ content, count })),
    );
  }

  return summariesByCharacter;
}
