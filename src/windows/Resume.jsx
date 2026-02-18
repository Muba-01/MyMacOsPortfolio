import { WindowControls } from '#components';
import WindowWrapper from '#hoc/WindowWrapper';
import { Download } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;


const Resume = () => {
  const [numPages, setNumPages] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [workerDisabled, setWorkerDisabled] = useState(false);
  const visiblePageWidth = 400;
  const [dpr, setDpr] = useState(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);

  useEffect(() => {
    const onChange = () => setDpr(window.devicePixelRatio || 1);
    window.addEventListener('resize', onChange);
    return () => window.removeEventListener('resize', onChange);
  }, []);

  return (
  <>
    <div id='window-header'>
      <WindowControls target="resume" />
      <h2>Resume.pdf</h2>

      <a href="/files/resume.pdf"
      download
      className="cursor-pointer"
      title="Download Resume"
      >
        <Download className="icon" />

      </a>

    </div>

    {
      
    }

    <div style={{ width: '420px', maxWidth: '90vw', height: '85vh', overflowY: 'auto', padding: '0.5rem', boxSizing: 'border-box' }}>
    <Document
      key={workerDisabled ? 'no-worker' : 'with-worker'}
      file={{ url: '/files/resume.pdf' }}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      onLoadError={(e) => {
        console.error('PDF load error', e);
        setLoadError(true);
        if (!workerDisabled) setWorkerDisabled(true);
      }}
    >
      {!loadError && numPages && Array.from(new Array(numPages), (el, index) => (
        <div key={`page_wrap_${index + 1}`} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: `${visiblePageWidth}px`, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            <div style={{ transform: `scale(${1 / dpr})`, transformOrigin: 'top center' }}>
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={Math.round(visiblePageWidth * dpr)}
                renderTextLayer
                renderAnnotationLayer
              />
            </div>
          </div>
        </div>
      ))}
    </Document>
    </div>

    {loadError && (
      <div className="pdf-fallback">
        <p>Could not render PDF with react-pdf — showing browser fallback.</p>
        <iframe
          src="/files/resume.pdf"
          title="Resume PDF"
          style={{ width: '100%', height: '85vh', border: 'none' }}
        />
      </div>
    )}


  </>
  );
    
};

const ResumeWindow = WindowWrapper(Resume, "resume");

export default ResumeWindow;