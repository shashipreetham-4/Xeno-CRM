import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:5173/dashboard',
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
      alert('Something went wrong, try again!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] px-4">
      <button
        onClick={handleLogin}
        className="flex items-center gap-3 px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-black rounded-lg shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-[var(--accent)]"
        aria-label="Sign in with Google"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 533.5 544.3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <path
            d="M533.5 278.4c0-18.3-1.6-36-4.6-53.1H272v100.6h146.9c-6.3 33.8-25.3 62.4-54.2 81.5v67.6h87.7c51.2-47.2 80.1-116.6 80.1-196.6z"
            fill="#4285F4"
          />
          <path
            d="M272 544.3c73.4 0 135-24.3 180-66.2l-87.7-67.6c-24.3 16.3-55.3 25.8-92.3 25.8-70.9 0-131-47.9-152.3-112.2H29v70.6c44.9 88.6 137.2 149.4 243 149.4z"
            fill="#34A853"
          />
          <path
            d="M119.7 324.3c-9.4-28.3-9.4-58.9 0-87.2v-70.6H29c-38.5 75.5-38.5 165.7 0 241.2l90.7-83.4z"
            fill="#FBBC05"
          />
          <path
            d="M272 107.7c39.8-.6 77.9 14.1 106.8 40.9l80.1-80.1C405.6 24.3 344 0 272 0 166.3 0 74 60.8 29 149.4l90.7 70.6c21.2-64.3 81.3-112.3 152.3-112.3z"
            fill="#EA4335"
          />
        </svg>
        <span className="font-semibold text-lg tracking-wide">Sign in with Google</span>
      </button>
    </div>
  );
}
