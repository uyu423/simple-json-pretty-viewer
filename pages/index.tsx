import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
const JsonPrettyViewer = dynamic(
  () => import('./components/JsonPrettyViewer'),
  {
    ssr: false,
  }
);

export default function Home() {
  const seoConfig = {
    title: 'Simple JSON Pretty Viewer Online by Yowu',
    description:
      'Simple JSON Pretty Viewer I made because the company blocked all kinds of Json Pretty Viewer Online, so I just asked ChatGPT to make it.',
    openGraph: {
      images: [
        {
          url: '/yowu-logo.jpeg', // public 폴더에 있는 이미지 파일 경로
          width: 800,
          height: 600,
          alt: 'Simple JSON Pretty Viewer Online by Yowu',
        },
      ],
    },
  };

  return (
    <>
      <NextSeo {...seoConfig} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">
          Simple JSON Pretty Viewer Online{' '}
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
    </>
  );
}
