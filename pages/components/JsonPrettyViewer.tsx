import React, { useEffect, useState } from 'react';

import { ThemeKeys } from 'react-json-view';
import dynamic from 'next/dynamic';

type OnChangeHandler = (obj: { updated_src: any }) => void;

interface IJsonProps {
  src: Record<string, any>;
  name?: boolean;
  theme?: ThemeKeys;
  displayDataTypes?: boolean;
  displayObjectSize?: boolean;
  collapsed?: boolean;
  collapseStringsAfterLength?: number;
  onEdit?: OnChangeHandler;
  onAdd?: OnChangeHandler;
  onDelete?: OnChangeHandler;
  onSelect?: OnChangeHandler;
  iconStyle?: 'circle' | 'square';
  indentWidth?: number;
  enableClipboard?: boolean;
}

const ReactJson = dynamic<IJsonProps>(() => import('react-json-view'), {
  ssr: false,
});

const defaultJsonString = `{"name":"Yowu Yu","age":null,"email":"yowu.yu@example.com","jobTitle":"Backend Developer","address":{"street":"178-4 Jungja-dong","city":"Bundang-gu, Seongnam-si","state":"Gyeonggi-do","contry":"Republic of Korea","zip":"13561"},"phoneNumbers":[{"type":"home","number":"555-1234"},{"type":"work","number":"555-5678"}],"active":true,"registered":false,"hobbies":["sleeping","breathing","messing around"],"favoriteFoods":{"breakfast":[],"lunch":["ramen"],"dinner":["steak", "bulgogi"]}}`;

const localStorageKey = 'jsonString';

function JsonPrettyViewer() {
  const [jsonString, setJsonString] = useState<string>(
    typeof window !== 'undefined' && localStorage.getItem(localStorageKey)
      ? localStorage.getItem(localStorageKey)!
      : defaultJsonString
  );
  const [prettifiedJson, setPrettifiedJson] = useState<object | null>(() => {
    try {
      return JSON.parse(defaultJsonString);
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false); // 복사 완료 메시지 상태
  const [detail, setDetail] = useState(false); // json output을 textarea로 표시할지

  function handleJsonStringChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const jsonString = event.target.value;
    setJsonString(jsonString);

    try {
      const json = JSON.parse(jsonString);
      setPrettifiedJson(json);
      setError(null);
      typeof window !== 'undefined' &&
        localStorage.setItem(localStorageKey, jsonString);
    } catch (error) {
      const errorMessage =
        error instanceof SyntaxError ? error.message : 'Invalid JSON';
      setPrettifiedJson(null);
      setError(errorMessage);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jsonString = localStorage.getItem(localStorageKey);
      if (jsonString) {
        setJsonString(jsonString);
        try {
          const json = JSON.parse(jsonString);
          setPrettifiedJson(json);
          setError(null);
        } catch (error) {
          const errorMessage =
            error instanceof SyntaxError ? error.message : 'Invalid JSON';
          setPrettifiedJson(null);
          setError(errorMessage);
        }
      }
    }
  }, []);

  function handleCopyClick() {
    if (prettifiedJson) {
      const jsonString = JSON.stringify(prettifiedJson, null, 2);
      navigator.clipboard.writeText(jsonString);
      setCopied(true); // 복사 완료 메시지 표시

      // 1초 후에 복사 완료 메시지 숨김
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }

  function handleDetailToggle() {
    setDetail(!detail);
  }
  return (
    <div className="flex flow-grow">
      <div className="flex-1 p-2">
        <textarea
          className="w-full h-full p-2 border border-gray-300 rounded resize-none"
          value={jsonString}
          onChange={handleJsonStringChange}
          style={{ height: '80vh' }}
        />
      </div>
      <div className="flex-1 p-2 overflow-auto max-w-2xl relative">
        <div className="flex justify-end flex-wrap gap-2">
          <button
            className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            onClick={handleDetailToggle}
            style={{ zIndex: 1 }}
          >
            Detail Toggle: <strong>{detail ? 'ON' : 'OFF'}</strong>
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            onClick={handleCopyClick}
            style={{ zIndex: 1 }}
          >
            Copy
          </button>
          {copied && (
            <div className="bg-gray-800 bg-opacity-75 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded shadow">
              Copied!
            </div>
          )}
        </div>
        {prettifiedJson && (
          <ReactJson
            src={prettifiedJson}
            theme="rjv-default"
            displayDataTypes={detail}
            name={detail}
            enableClipboard={detail}
            displayObjectSize={detail}
            collapsed={false}
          />
        )}
        {!prettifiedJson && <div className="text-red-500">{error}</div>}
      </div>
    </div>
  );
}

export default JsonPrettyViewer;
