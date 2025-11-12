import * as mammoth from 'mammoth';

export async function extractDocxText(fileData: Blob): Promise<string> {
  const arrayBuffer = await fileData.arrayBuffer();
  
  const result = await mammoth.extractRawText({ arrayBuffer });
  
  return result.value.trim();
}