import PptxGenJS from 'pptxgenjs';
import { convertMarkdownToHtml } from './markdownToHtml';

export function exportToPptx(markdownString, fileName = 'presentation.pptx') {
    const htmlString = convertMarkdownToHtml(markdownString);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, 'text/html');
    console.log(htmlDoc);

    const pptx = new PptxGenJS();

    const slides = htmlDoc.querySelectorAll('hr');
    slides.forEach((slideSeparator, index) => {
        const slide = pptx.addSlide();
        let content = slideSeparator.nextElementSibling;

        while (content) {
            if (content.tagName === 'H1' || content.tagName === 'H2') {
                slide.addText(content.textContent || '', {
                    x: 0.5,
                    y: (content.tagName === 'H1') ? 0.5 : 1,
                    fontSize: (content.tagName === 'H1') ? 24 : 18,
                    bold: true,
                    italic: content.tagName === 'H2',
                });
            } else if (content.tagName === 'P') {
                const strongElement = content.querySelector('strong');
                if (strongElement) {
                    slide.addText(strongElement.textContent || '', { x: 0.5, y: '50%', fontSize: 14, bold: true });
                } else {
                    slide.addText(content.textContent || '', { x: 0.5, y: '60%', fontSize: 14 });
                }
            } else if (content.tagName === 'UL') {
                const listItems = Array.from(content.querySelectorAll('li'));
                listItems.forEach((item, i) => {
                    slide.addText(item.textContent || '', { x: 0.5, y: 3 + i * 0.5, fontSize: 14 });
                });
            }

            if (content.nextElementSibling && content.nextElementSibling.tagName === 'HR') {
                break;
            }
            content = content.nextElementSibling;
        }
    });

    pptx.writeFile({ fileName: fileName })
        .then(() => {
            console.log('Presentation created successfully');
        })
        .catch((error) => {
            console.error('Error creating presentation:', error);
        });
}