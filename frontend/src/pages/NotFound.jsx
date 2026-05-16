import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <p className="text-6xl font-bold text-brand-600">404</p>
        <p className="mt-2 text-ink-700">Page not found.</p>
        <Link to="/" className="btn-primary mt-4 inline-flex">Go home</Link>
      </div>
    </div>
  );
}
