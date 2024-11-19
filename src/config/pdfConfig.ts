import * as PDFJS from 'pdfjs-dist/build/pdf';
import PDFJSWorker from 'pdfjs-dist/build/pdf.worker';

PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker;

export default PDFJS;
