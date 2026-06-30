import { CharactersResponse, Reaction, ReactionsResponse } from '../types';

export async function addReaction(characterId: number, content: string): Promise<Reaction> {
  const response = await fetch('/api/reactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ characterId, content }),
  });
  if (!response.ok) {
    throw new Error(`Failed to add reaction (status ${response.status})`);
  }
  return response.json();
}

interface FetchCharactersParams {
  name?: string;
  page: number;
  limit: number;
  signal?: AbortSignal;
}

export async function fetchCharacters({ name = '', page, limit, signal }: FetchCharactersParams): Promise<CharactersResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (name) {
    params.set('name', name);
  }

  const response = await fetch(`/api/characters?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch characters (status ${response.status})`);
  }

  return response.json();
}

export async function fetchReactions(signal?: AbortSignal): Promise<Reaction[]> {
  const response = await fetch('/api/reactions', { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch reactions (status ${response.status})`);
  }

  const data: ReactionsResponse = await response.json();
  return data.reactions;
}
