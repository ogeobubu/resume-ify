declare module 'pdfjs-dist/build/pdf' {
    export const GlobalWorkerOptions: any;
    export function getDocument(url: string | { url: string }): any;
  }