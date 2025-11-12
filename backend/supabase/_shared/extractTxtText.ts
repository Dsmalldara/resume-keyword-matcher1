export async function extractTxtText(fileData: Blob): Promise<string> {
  const text = await fileData.text();
  return text.trim();
}