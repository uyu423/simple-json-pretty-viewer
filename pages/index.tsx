import Footer from './components/Footer';
import dynamic from 'next/dynamic';
const JsonPrettyViewer = dynamic(
  () => import('./components/JsonPrettyViewer'),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">
        Simple Json Pretty Viewer{' '}
        <small>
          by{' '}
          <a
            href="https://yowu.dev"
            className="text-blue-600 hover:text-blue-800"
          >
            Yowu
          </a>
        </small>
      </h1>
      <JsonPrettyViewer />
      {/* <Footer /> */}
    </div>
  );
}
