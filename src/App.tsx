import { useEffect, useState, useCallback } from 'react';
import { supabase, type Post } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Writing from '@/pages/Writing';
import PostView from '@/pages/PostView';
import NewPost from '@/pages/NewPost';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import Links from '@/pages/Links';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

export type Page =
  | 'home'
  | 'writing'
  | 'post'
  | 'new'
  | 'login'
  | 'about'
  | 'projects'
  | 'links';

export interface RouteState {
  page: Page;
  postId: string | null;
}

function parseHash(): RouteState {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [seg, ...rest] = hash.split('/');
  switch (seg) {
    case 'writing':
      return { page: 'writing', postId: null };
    case 'post':
      return { page: 'post', postId: rest[0] ?? null };
    case 'new':
      return { page: 'new', postId: null };
    case 'login':
      return { page: 'login', postId: null };
    case 'about':
      return { page: 'about', postId: null };
    case 'projects':
      return { page: 'projects', postId: null };
    case 'links':
      return { page: 'links', postId: null };
    case '':
    case 'home':
      return { page: 'home', postId: null };
    default:
      return { page: 'home', postId: null };
  }
}

function routeToHash(route: RouteState): string {
  switch (route.page) {
    case 'home':
      return '#/';
    case 'writing':
      return '#/writing';
    case 'post':
      return route.postId ? `#/post/${route.postId}` : '#/writing';
    case 'new':
      return '#/new';
    case 'login':
      return '#/login';
    case 'about':
      return '#/about';
    case 'projects':
      return '#/projects';
    case 'links':
      return '#/links';
  }
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(parseHash());
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  const { session, signIn, signUp, signOut } = useAuth();
  const writerEmail = session?.user?.email ?? null;

  const loadPosts = useCallback(async () => {
    setPostsLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, body, author, created_at')
      .order('created_at', { ascending: false });
    if (error) console.error('Failed to load posts:', error.message);
    setPosts(data ?? []);
    setPostsLoading(false);
  }, []);

  const loadPost = useCallback(async (id: string) => {
    setPostLoading(true);
    setActivePost(null);
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, body, author, created_at')
      .eq('id', id)
      .maybeSingle();
    if (error) console.error('Failed to load post:', error.message);
    setActivePost(data);
    setPostLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (route.page === 'post' && route.postId) {
      loadPost(route.postId);
    }
  }, [route, loadPost]);

  const navigate = useCallback((page: Page, postId?: string) => {
    const next: RouteState = { page, postId: postId ?? null };
    window.location.hash = routeToHash(next);
  }, []);

  function handleSignIn(email: string, password: string) {
    return signIn(email, password).then(({ error }) => ({
      error: error ? error.message : null,
    }));
  }

  function handleSignUp(email: string, password: string) {
    return signUp(email, password).then(({ error }) => ({
      error: error ? error.message : null,
    }));
  }

  async function handleSignOut() {
    await signOut();
    navigate('home');
  }

  // Redirect: if already logged in and hit #/login, go to new post
  useEffect(() => {
    if (route.page === 'login' && session) {
      navigate('new');
    }
  }, [route.page, session, navigate]);

  // Redirect: if not logged in and hit #/new, go to login
  useEffect(() => {
    if (route.page === 'new' && !session) {
      navigate('login');
    }
  }, [route.page, session, navigate]);

  return (
    <Layout
      currentPage={route.page}
      onNavigate={navigate}
      recentPostTitles={posts.slice(0, 8).map((p) => ({ id: p.id, title: p.title }))}
      postCount={posts.length}
      writerEmail={writerEmail}
      onSignOut={handleSignOut}
      onSignInNavigate={() => navigate('login')}
    >
      {route.page === 'home' && (
        <Home
          posts={posts}
          loading={postsLoading}
          onOpenPost={(id) => navigate('post', id)}
          onNavigate={navigate}
        />
      )}
      {route.page === 'writing' && (
        <Writing
          posts={posts}
          loading={postsLoading}
          onOpenPost={(id) => navigate('post', id)}
          onNewPost={() => navigate('new')}
        />
      )}
      {route.page === 'post' && (
        <PostView
          post={activePost}
          loading={postLoading}
          onBack={() => navigate('writing')}
        />
      )}
      {route.page === 'new' && session && (
        <NewPost
          writerEmail={writerEmail}
          onCreated={() => { loadPosts(); navigate('writing'); }}
          onCancel={() => navigate('writing')}
        />
      )}
      {route.page === 'login' && !session && (
        <Login
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onCancel={() => navigate('home')}
        />
      )}
      {route.page === 'about' && <About />}
      {route.page === 'projects' && <Projects />}
      {route.page === 'links' && <Links />}
      {route.page !== 'home' &&
        route.page !== 'writing' &&
        route.page !== 'post' &&
        route.page !== 'new' &&
        route.page !== 'login' &&
        route.page !== 'about' &&
        route.page !== 'projects' &&
        route.page !== 'links' && <NotFound onHome={() => navigate('home')} />}
    </Layout>
  );
}
