import { createClient, type Client, type InValue } from '@libsql/client/web';
import {
  hashPassword,
  verifyPassword,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  sanitizeTitle,
  sanitizeAuthor,
  sanitizeSlug,
} from '@/lib/security';

export type User = {
  id: string;
  email: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: { name?: string };
  aud?: string;
  created_at?: string;
};

export type Session = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  user: User;
};

export type Post = {
  id: string;
  title: string;
  body: string;
  author: string;
  created_at: string;
  published: boolean;
};

const TURSO_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TURSO_DATABASE_URL) ||
  'libsql://blog-moncef-mkrn-tkqxoj.aws-eu-west-1.turso.io';

const TURSO_AUTH_TOKEN =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TURSO_AUTH_TOKEN) ||
  'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODgzNjgxNzIsImlkIjoiMDFhMDYzMGMtODcwMS03YTVkLTk3NGUtYzYyOGVlMzNjZDg2Iiwia2lkIjoiQkN2Qnp6RGpBbHFHQlNSZWNBc1R2VHhMb21yWW5QbzVNM0dURUdxR2l6byIsInJpZCI6ImM4MjgxZWYzLTQ0NGQtNDI2Ny05MzI0LTcyNWJkYWQzNDY2NiJ9.vOHMzgFF7zIpUvtRg4GI78QhRjFBFJ0aSMs2kYkNEDHDmmYzZx5XcehJbXi7Bbbe3OpKbi_kjo3KJey4A14kBQ';

export const isTursoConfigured = Boolean(TURSO_URL && TURSO_AUTH_TOKEN);

let tursoClient: Client | null = null;

export function getTursoClient(): Client | null {
  if (!isTursoConfigured) return null;
  if (!tursoClient) {
    try {
      tursoClient = createClient({
        url: TURSO_URL,
        authToken: TURSO_AUTH_TOKEN,
      });
    } catch (e) {
      console.error('Failed to create Turso client:', e);
      return null;
    }
  }
  return tursoClient;
}

const LOCAL_POSTS_KEY = 'daemon_abyss_posts_v2';
const LOCAL_SESSION_KEY = 'daemon_abyss_session_v2';

export const SEED_POSTS: Post[] = [
  {
    id: 'systems-engineering-low-level-layers',
    title: 'Systems Engineering and the Low-Level Layers: A Perspective on Modern Infrastructure',
    author: 'Moncef Mokrani',
    created_at: '2026-08-28 16:45:00',
    published: true,
    body: `As a systems engineering graduate, much of my work revolves around understanding what happens underneath the abstraction barriers.

In modern software development, frameworks and platforms move at breakneck speed. Every few months, a new abstraction claims to solve the complexity of the previous one. Yet, when you pull back the curtain, everything still comes down to operating system primitives, network sockets, memory management, process scheduling, and disk I/O.

Enterprise software administration and systems engineering require an unwavering respect for these fundamentals. When a microservices cluster degrades under load, or a distributed database suffers replication latency, high-level abstractions don't save you. What saves you is the ability to inspect kernel metrics, trace system calls, examine TCP window sizes, and reason about concurrency at the hardware layer.

My focus has been on empowering my understanding of these low-level layers—bridging the gap between software engineering and system administration. The deeper you go, the simpler the architecture becomes, and the more resilient your solutions are for the future.`,
  },
  {
    id: 'cosmic-joke-in-the-machine',
    title: 'The Cosmic Joke in the Machine: A Discourse on Artificial Intelligence and the Human Game',
    author: 'Moncef Mokrani',
    created_at: '2024-03-20 12:00:00',
    published: true,
    body: `One might begin by asking a simple question, a question that a philosopher is a sort of intellectual yokel for even gawking at: "I wonder what you mean, when you use the word 'AI'?". We are told, with breathless urgency, that we are living through a revolution, participating in a race, and standing at a precipice of unprecedented change. But what, precisely, is changing? Is it the fundamental nature of the world, or is it simply that we have invented a new and astonishingly powerful mirror in which to see our own ancient habits of mind?

The current landscape of artificial intelligence is a grand drama, a cosmic play unfolding on two very different stages, each revealing a fundamental attitude toward life itself. The central metaphor for this drama is one of choice. One stage is set for a serious, frantic pilgrimage. Its actors are driven by a profound anxiety, their eyes fixed on a future destination—a technological promised land of Artificial General Intelligence that will, they believe, solve all our problems. The other stage is arranged for a playful, improvisational dance. Its actors are not concerned with the finale but are absorbed in the music of the present moment, creating for the sheer joy of creation.

In this story, AI is not the protagonist. It is merely the stage lighting, illuminating these two timeless ways human beings attempt to navigate the universe. Our most advanced technology is not creating new problems; it is merely amplifying our old ones: our chronic confusion of symbols with reality, our desperate clinging to the illusion of a separate ego, and our deep-seated inability to trust the natural, wiggly, and uncontrollable unfolding of things.

The venture-capital-fueled AI ecosystem is a perfect modern manifestation of the Western, goal-oriented "journey" that is so deeply ingrained in our culture. It is the familiar rat race, but supercharged by exponential technology, where the destination is always just over the horizon.

In stark contrast stands the world of the indie hacker and the open-source community. Here, the desperate "rowing" is replaced by the skillful "sailing" of wu wei—the art of using the prevailing winds of technology rather than fighting against the waves of an uncontrollable ocean.

We are left not with a set of solutions, but with a final, contemplative choice. Will we continue the anxious pilgrimage, forever chasing a future that never arrives? Or will we finally hear the music that is being played now, embrace the wisdom of insecurity, and join the dance?`,
  },
  {
    id: 'digital-ghost',
    title: 'The Digital Ghost: On Being Human in an Age of Avatars and Algorithms',
    author: 'Moncef Mokrani',
    created_at: '2024-03-15 10:30:00',
    published: true,
    body: `Well now, it's a very curious thing to be alive in these times. I was sitting in a café the other day, overlooking the water, and it was one of those perfect afternoons. The light was filtering through the leaves of the trees, dancing on the tables.

And yet, at almost every table, there sat these marvelous human beings, completely captivated by little glowing rectangles in their hands. Their faces were illuminated not by the sun, but by this strange, cool light from a screen.

It put me in mind of this fascinating word we use all the time without a second thought: the word "person." It comes from the Latin word persona, which was the mask worn by an actor in a Greco-Roman drama. The mask was designed with a megaphone-shaped mouth, so that the actor's voice could project through (per sonare) to the back of the amphitheater.

So from the very beginning, the "person" was a role, a device for playing a part in a drama. And of course, we are all playing our parts. But what we have now, with these little glowing rectangles, is something altogether new: the digital self.

On top of the skin-encapsulated ego, we have constructed what I can only call the "profile-encapsulated ego." This profile is a curated collection of symbols that we mistake for our actual being.

Artificial intelligence is the most powerful and detailed mirror humanity has ever created. It has been trained on the vast corpus of our language, our literature, our conversations, our poetry, and our nonsense. It reflects the totality of our own logic, our patterns of thought, our biases, our wisdom, and our foolishness.

The way to deal with the digital dream is the same as the way to deal with any other dream: to wake up within it. So, by all means, play with your avatars. Talk to your intelligent mirrors. Participate in this grand new digital theater. But do it with a twinkle in your eye, knowing that the real you is the silent, aware consciousness for whom the whole show is being performed.`,
  },
];

function getCachedPosts(): Post[] {
  if (typeof window === 'undefined') return SEED_POSTS;
  try {
    const raw = localStorage.getItem(LOCAL_POSTS_KEY);
    return raw ? JSON.parse(raw) : SEED_POSTS;
  } catch {
    return SEED_POSTS;
  }
}

function setCachedPosts(posts: Post[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to cache posts in localStorage:', e);
  }
}

function getStoredSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredSession(session: Session | null) {
  if (typeof window === 'undefined') return;
  try {
    if (session) {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to persist session:', e);
  }
}

type AuthCallback = (event: string, session: Session | null) => void;
const authListeners = new Set<AuthCallback>();

export async function updatePost(
  id: string,
  values: { title?: string; body?: string; author?: string; published?: boolean }
): Promise<{ error: { message: string } | null }> {
  const client = getTursoClient();
  const cleanTitle = values.title !== undefined ? sanitizeTitle(values.title) : undefined;
  const cleanAuthor = values.author !== undefined ? sanitizeAuthor(values.author) : undefined;

  if (client) {
    try {
      const sets: string[] = [];
      const args: InValue[] = [];

      if (cleanTitle !== undefined) {
        sets.push('title = ?');
        args.push(cleanTitle);
      }
      if (values.body !== undefined) {
        sets.push('body = ?');
        args.push(values.body);
        sets.push('content = ?');
        args.push(values.body);
      }
      if (cleanAuthor !== undefined) {
        sets.push('author = ?');
        args.push(cleanAuthor);
      }
      if (values.published !== undefined) {
        sets.push('published = ?');
        args.push(values.published ? 1 : 0);
      }

      if (sets.length > 0) {
        args.push(id, id);
        await client.execute({
          sql: `UPDATE posts SET ${sets.join(', ')} WHERE slug = ? OR id = ?;`,
          args,
        });
      }
    } catch (e) {
      console.error('Turso update error:', e);
      return { error: { message: (e as Error).message || 'Failed to update reflection' } };
    }
  }

  const cached = getCachedPosts();
  const updated = cached.map((p) => {
    if (p.id === id) {
      return {
        ...p,
        title: values.title !== undefined ? values.title : p.title,
        body: values.body !== undefined ? values.body : p.body,
        author: values.author !== undefined ? values.author : p.author,
        published: values.published !== undefined ? values.published : p.published,
      };
    }
    return p;
  });
  setCachedPosts(updated);
  return { error: null };
}

export async function deletePost(id: string): Promise<{ error: { message: string } | null }> {
  const client = getTursoClient();
  if (client) {
    try {
      await client.execute({
        sql: 'DELETE FROM posts WHERE slug = ? OR id = ?;',
        args: [id, id],
      });
    } catch (e) {
      console.error('Turso delete error:', e);
      return { error: { message: (e as Error).message || 'Failed to delete reflection' } };
    }
  }

  const cached = getCachedPosts();
  const filtered = cached.filter((p) => p.id !== id);
  setCachedPosts(filtered);
  return { error: null };
}

export async function toggleMaskPost(
  id: string,
  currentlyPublished: boolean
): Promise<{ error: { message: string } | null }> {
  return updatePost(id, { published: !currentlyPublished });
}

export const tursoDb = {
  from(table: string) {
    if (table !== 'posts') {
      return {
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
      };
    }

    return {
      select() {
        let filterId: string | null = null;
        let isAscending = false;

        const query = {
          order(_col: string, { ascending }: { ascending: boolean }) {
            isAscending = ascending;
            return query;
          },
          eq(col: string, val: unknown) {
            if (col === 'id') {
              filterId = String(val);
            }
            return query;
          },
          async maybeSingle() {
            const client = getTursoClient();
            if (client && filterId) {
              try {
                const res = await client.execute({
                  sql: 'SELECT id, slug, title, body, content, author, created_at, published FROM posts WHERE slug = ? OR id = ? LIMIT 1;',
                  args: [filterId, filterId],
                });
                if (res.rows.length > 0) {
                  const row = res.rows[0];
                  return {
                    data: {
                      id: String(row.slug || row.id),
                      title: String(row.title),
                      body: String(row.content || row.body || ''),
                      author: String(row.author || 'Moncef Mokrani'),
                      created_at: String(row.created_at),
                      published: row.published !== 0 && row.published !== '0',
                    } as Post,
                    error: null,
                  };
                }
              } catch (e) {
                console.warn('Turso query failed, falling back to cache:', e);
              }
            }

            const cached = getCachedPosts();
            const found = filterId ? cached.find((p) => p.id === filterId) : cached[0];
            return { data: found ?? null, error: null };
          },
          then(resolve: (res: { data: Post[]; error: null }) => void) {
            const fetchPromise = (async () => {
              const client = getTursoClient();
              if (client) {
                try {
                  const orderDir = isAscending ? 'ASC' : 'DESC';
                  const res = await client.execute(
                    `SELECT id, slug, title, body, content, author, created_at, published FROM posts ORDER BY created_at ${orderDir};`
                  );
                  const posts: Post[] = res.rows.map((row) => ({
                    id: String(row.slug || row.id),
                    title: String(row.title),
                    body: String(row.content || row.body || ''),
                    author: String(row.author || 'Moncef Mokrani'),
                    created_at: String(row.created_at),
                    published: row.published !== 0 && row.published !== '0',
                  }));

                  if (posts.length > 0) {
                    setCachedPosts(posts);
                    return { data: posts, error: null };
                  }
                } catch (e) {
                  console.warn('Turso fetch failed, using cached posts:', e);
                }
              }

              const cached = getCachedPosts();
              return { data: cached, error: null };
            })();

            return fetchPromise.then(resolve);
          },
        };

        return query;
      },

      async insert(values: {
        title: string;
        body: string;
        author?: string;
        published?: boolean;
      }) {
        const id =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `post-${Date.now()}`;
        const isPublished = values.published !== false;
        const newPost: Post = {
          id,
          title: sanitizeTitle(values.title),
          body: values.body,
          author: sanitizeAuthor(values.author || 'Moncef Mokrani'),
          created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
          published: isPublished,
        };

        const client = getTursoClient();
        if (client) {
          try {
            await client.execute({
              sql: 'INSERT INTO posts (slug, title, body, content, author, created_at, published) VALUES (?, ?, ?, ?, ?, ?, ?);',
              args: [
                newPost.id,
                newPost.title,
                newPost.body,
                newPost.body,
                newPost.author,
                newPost.created_at,
                isPublished ? 1 : 0,
              ],
            });
          } catch (e) {
            console.error('Turso insert error:', e);
          }
        }

        const cached = getCachedPosts();
        setCachedPosts([newPost, ...cached]);
        return { data: [newPost], error: null };
      },

      update(values: { title?: string; body?: string; author?: string; published?: boolean }) {
        return {
          async eq(col: string, val: unknown) {
            if (col !== 'id') return { error: null };
            return updatePost(String(val), values);
          },
        };
      },

      delete() {
        return {
          async eq(col: string, val: unknown) {
            if (col !== 'id') return { error: null };
            return deletePost(String(val));
          },
        };
      },
    };
  },

  auth: {
    async getSession() {
      const session = getStoredSession();
      return { data: { session }, error: null };
    },

    onAuthStateChange(callback: AuthCallback) {
      authListeners.add(callback);
      const current = getStoredSession();
      callback('INITIAL_SESSION', current);

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners.delete(callback);
            },
          },
        },
      };
    },

    async signInWithPassword({ email, password }: { email: string; password?: string }) {
      const input = (email || '').trim().toLowerCase();
      const pass = (password || '').trim();

      // Enforce rate limiting: max 5 failed attempts per 15 minutes, with lockout
      const rateCheck = checkRateLimit('login_attempt', 5, 15 * 60 * 1000, 15 * 60 * 1000);
      if (!rateCheck.allowed) {
        return {
          data: { user: null, session: null },
          error: {
            message: `Too many failed sign-in attempts. Locked out for security. Please retry in ${rateCheck.waitSeconds}s.`,
          },
        };
      }

      const primaryEmail = (import.meta.env?.VITE_WRITER_EMAIL || 'moncef@daemonabyss.com').toLowerCase();
      const primaryUser = (import.meta.env?.VITE_WRITER_USERNAME || 'moncef').toLowerCase();
      const primaryPass = import.meta.env?.VITE_WRITER_PASSWORD || 'changeme';
      const primaryName = import.meta.env?.VITE_WRITER_NAME || 'Moncef Mokrani';

      const otherEmail = (import.meta.env?.VITE_OTHER_WRITER_EMAIL || 'editor@daemonabyss.com').toLowerCase();
      const otherUser = (import.meta.env?.VITE_OTHER_WRITER_USERNAME || 'editor').toLowerCase();
      const otherPass = import.meta.env?.VITE_OTHER_WRITER_PASSWORD || 'editor2026!';
      const otherName = import.meta.env?.VITE_OTHER_WRITER_NAME || 'Secondary Writer';

      // Secure PBKDF2 hash verification
      const primaryPassHash = await hashPassword(primaryPass);
      const otherPassHash = await hashPassword(otherPass);

      const passMatchesPrimary = await verifyPassword(pass, primaryPassHash);
      const passMatchesOther = await verifyPassword(pass, otherPassHash);

      let matchedAccount: { email: string; name: string } | null = null;

      // Check Primary writer account
      if (
        (input === primaryEmail || input === primaryUser || input === 'writer' || input === 'moncef') &&
        passMatchesPrimary
      ) {
        matchedAccount = { email: primaryEmail, name: primaryName };
      }
      // Check The Only Other Account defined in .env
      else if ((input === otherEmail || input === otherUser) && passMatchesOther) {
        matchedAccount = { email: otherEmail, name: otherName };
      }

      if (!matchedAccount) {
        recordFailedAttempt('login_attempt');
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid credentials. Only authorized writer accounts can sign in.' },
        };
      }

      // Successful login resets the failed attempts counter
      resetRateLimit('login_attempt');

      const user: User = {
        id: `writer-${btoa(matchedAccount.email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}`,
        email: matchedAccount.email,
        app_metadata: {},
        user_metadata: { name: matchedAccount.name },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };

      const session: Session = {
        access_token: `token-${Date.now()}`,
        token_type: 'bearer',
        expires_in: 86400,
        refresh_token: `refresh-${Date.now()}`,
        user,
      };

      setStoredSession(session);
      authListeners.forEach((cb) => cb('SIGNED_IN', session));
      return { data: { user, session }, error: null };
    },

    async signUp() {
      return {
        data: { user: null, session: null },
        error: { message: 'Public sign-up is disabled. Accounts are managed via .env configuration.' },
      };
    },

    async signOut() {
      setStoredSession(null);
      authListeners.forEach((cb) => cb('SIGNED_IN', null));
      return { error: null };
    },
  },
};

export const isDatabaseConfigured = isTursoConfigured;
export const db = tursoDb;
