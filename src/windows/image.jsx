import React from 'react';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls';
import useWindowStore from '#store/window.js';

const ImageFile = () => {
  const { windows } = useWindowStore();
  const data = windows.imgfile?.data;

  if (!data) return null;

  const src = data.imageUrl || data.image || '';

  return (
    <>
      <div id="window-header">
        <WindowControls target="imgfile" />
        <h2>{data.name}</h2>
      </div>

      <div className="preview">
        {src ? <img src={src} alt={data.name} /> : null}
      </div>
    </>
  );
};

const ImageWindow = WindowWrapper(ImageFile, 'imgfile');

export default ImageWindow;
