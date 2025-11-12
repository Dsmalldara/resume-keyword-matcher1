import { getDocument } from 'pdfjs-dist';

type TextItem = {
  str: string;
};

export async function extractPdfText(fileData: Blob): Promise<string> {
  const arrayBuffer = await fileData.arrayBuffer();
  
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const pageText = textContent.items
      .map((item) => (item as TextItem).str)
      .join(' ');
    
    fullText += pageText + '\n\n';
  }
  
  return fullText.trim();
}