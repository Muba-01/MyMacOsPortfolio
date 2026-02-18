import React from 'react';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls';
import useWindowStore from '#store/window.js';

const Text = () => {
  const { windows } = useWindowStore();
  const data = windows.txtfile?.data;

  if (!data) return null;

  return (
    <>
      <div id="window-header">
        <WindowControls target="txtfile" />
        <h2>{data.name}</h2>
      </div>

      <div className="text-file content">
        {data.image || data.imageUrl ? (
          <div className="mb-4">
            <img src={data.image || data.imageUrl} alt={data.name} />
          </div>
        ) : null}

        {data.subtitle ? <p className="subtitle">{data.subtitle}</p> : null}

        {Array.isArray(data.description) && (
          <div className="space-y-3">
            {data.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const TextWindow = WindowWrapper(Text, 'txtfile');

export default TextWindow;
