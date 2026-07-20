import { Link } from 'react-router';

export default function NotFoundPage() {
  return <main className="not-found"><h1>Page not found</h1><Link className="primary-button" to="/">Go home</Link></main>;
}
