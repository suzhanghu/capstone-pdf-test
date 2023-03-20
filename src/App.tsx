import React, { useEffect, useRef } from 'react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import { Node, Mark } from '@tiptap/core';
import { Paragraph } from '@tiptap/extension-paragraph';
import UnderlineExtension from '@tiptap/extension-underline';
import './App.css';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Doc = Node.create({
  name: 'doc',
  topNode: true,
  content: 'block+',
});

const Text = Node.create({
  name: 'text',
  group: 'inline',
  content: 'text*',
  toDOM: () => ['span', 0],
});

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const editor = useEditor({
    extensions: [Doc, Text, Paragraph, UnderlineExtension],
    content: '<p>Hello world!</p>',
  });

  useEffect(() => {
    async function loadPdf() {
      const pdf = await pdfjs.getDocument('/example.pdf').promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');
        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
        }
      }
    }
    loadPdf();
  }, []);

  return (
    <div className="App">
      <div className="editor-container">
        <div className="pdf-background">
          <canvas ref={canvasRef} className="pdf-canvas" />
        </div>
        <div className="editor-wrapper">
          <EditorContent editor={editor} className="editor-content" />
        </div>
      </div>
    </div>
  );
}

export default App;