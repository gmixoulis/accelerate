import { convertMarkdownToHtml } from './markdownToHtml';

export function exportToDocx(markdownString, fileName = 'document.doc'){
  const preHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"> <head><meta charset="utf-8"><title>Shared Powerflow Message</title><style>body { font-family: Calibri, sans-serif; font-size: 11pt; }</style></head><body>';
  const postHtml = "</body></html>";
  const htmlString = convertMarkdownToHtml(markdownString);

  const html = preHtml + htmlString + postHtml;

  var link = document.createElement("a");

  document.body.appendChild(link);

  link.href = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
  link.download = fileName;
  link.click();

  document.body.removeChild(link);
}