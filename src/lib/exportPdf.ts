import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const EXPORT_ROOT_ID = 'dashboard-export';

/** Copy real computed styles onto the clone so html2canvas renders text/charts correctly. */
function syncStylesForExport(source: Element, target: Element): void {
  if (source instanceof HTMLElement && target instanceof HTMLElement) {
    const computed = window.getComputedStyle(source);

    target.style.animation = 'none';
    target.style.animationDelay = '0s';
    target.style.transition = 'none';
    target.style.opacity = '1';
    target.style.transform = 'none';
    target.style.visibility = 'visible';

    target.style.color = computed.color;
    target.style.backgroundColor = computed.backgroundColor;
    target.style.borderColor = computed.borderColor;
    target.style.borderWidth = computed.borderWidth;
    target.style.borderStyle = computed.borderStyle;
    target.style.fontSize = computed.fontSize;
    target.style.fontWeight = computed.fontWeight;
    target.style.fontFamily = computed.fontFamily;
    target.style.lineHeight = computed.lineHeight;
    target.style.letterSpacing = computed.letterSpacing;
    target.style.textTransform = computed.textTransform;
    target.style.padding = computed.padding;
    target.style.margin = computed.margin;
    target.style.boxShadow = computed.boxShadow;
    target.style.overflow = 'visible';
  }

  if (source instanceof SVGElement && target instanceof SVGElement) {
    const rect = source.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      target.setAttribute('width', String(rect.width));
      target.setAttribute('height', String(rect.height));
    }
  }

  const sourceChildren = source.children;
  const targetChildren = target.children;
  for (let i = 0; i < sourceChildren.length; i++) {
    if (targetChildren[i]) {
      syncStylesForExport(sourceChildren[i], targetChildren[i]);
    }
  }
}

function getEffectiveTarget(el: HTMLElement, root: HTMLElement): HTMLElement {
  let current = el;
  while (current.parentElement && current.parentElement !== root) {
    const parent = current.parentElement;
    const parentStyle = window.getComputedStyle(parent);
    
    const isGrid = parentStyle.display.includes('grid');
    const isHorizontalFlex = parentStyle.display.includes('flex') && parentStyle.flexDirection !== 'column';
    
    if (isGrid || isHorizontalFlex) {
      current = parent;
    } else {
      break;
    }
  }
  return current;
}

function prepareClone(clonedRoot: HTMLElement, originalRoot: HTMLElement, accumulatedSpacerHeight: number = 0): void {
  clonedRoot.style.background = '#f5f6f8';
  clonedRoot.style.width = `${originalRoot.scrollWidth}px`;
  clonedRoot.style.height = 'auto';
  clonedRoot.style.minHeight = `${originalRoot.scrollHeight + accumulatedSpacerHeight}px`;
  clonedRoot.style.overflow = 'visible';

  syncStylesForExport(originalRoot, clonedRoot);

  clonedRoot.querySelectorAll('header').forEach((el) => {
    (el as HTMLElement).style.position = 'static';
  });

  clonedRoot.querySelectorAll('button').forEach((btn) => {
    const text = btn.textContent?.toLowerCase() ?? '';
    if (text.includes('export')) {
      (btn as HTMLElement).style.display = 'none';
    }
  });

  clonedRoot.querySelectorAll('svg').forEach((svg) => {
    const htmlSvg = svg as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      htmlSvg.setAttribute('width', String(Math.ceil(rect.width)));
      htmlSvg.setAttribute('height', String(Math.ceil(rect.height)));
    }
  });
}

function addCanvasPagesToPdf(pdf: jsPDF, canvas: HTMLCanvasElement): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const imgData = canvas.toDataURL('image/png', 1.0);

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }
}

export async function exportDashboardToPdf(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;

  const header = element.querySelector('header');
  const prevPosition = header instanceof HTMLElement ? header.style.position : '';

  if (header instanceof HTMLElement) {
    header.style.position = 'static';
  }

  window.scrollTo(0, 0);
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 400));

  // --- Calculate Page Breaks and Spacers ---
  const containerRect = element.getBoundingClientRect();
  const width = element.scrollWidth;
  const pdfWidth = 210;
  const pdfHeight = 297;
  const pageHeightPx = (pdfHeight / pdfWidth) * width;
  
  let accumulatedSpacerHeight = 0;

  const targets = Array.from(element.querySelectorAll('section, .dash-card, .metric-card')) as HTMLElement[];
  const effectiveTargets: HTMLElement[] = [];
  
  targets.forEach((el) => {
    const effective = getEffectiveTarget(el, element);
    if (!effectiveTargets.includes(effective)) {
      effectiveTargets.push(effective);
    }
  });

  const spacerInsertions: { elementIndex: number; height: number }[] = [];

  effectiveTargets.forEach((target, index) => {
    const rect = target.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const relativeTop = rect.top - containerRect.top;
    const relativeBottom = rect.bottom - containerRect.top;
    const height = rect.height;

    const newTop = relativeTop + accumulatedSpacerHeight;
    const newBottom = relativeBottom + accumulatedSpacerHeight;

    const pageIndexTop = Math.floor(newTop / pageHeightPx);
    const pageIndexBottom = Math.floor((newBottom - 1) / pageHeightPx);

    if (pageIndexTop !== pageIndexBottom && height <= pageHeightPx) {
      const spacerHeight = (pageIndexTop + 1) * pageHeightPx - newTop;
      spacerInsertions.push({ elementIndex: index, height: spacerHeight });
      accumulatedSpacerHeight += spacerHeight;
    }
  });

  // Assign temporary attributes to the effective targets in the live DOM
  effectiveTargets.forEach((target, index) => {
    target.setAttribute('data-pdf-split-id', String(index));
  });

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#f5f6f8',
      width: element.scrollWidth,
      height: element.scrollHeight + accumulatedSpacerHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight + accumulatedSpacerHeight,
      scrollX: 0,
      scrollY: -window.scrollY,
      onclone: (_doc, clonedElement) => {
        const original = document.getElementById(EXPORT_ROOT_ID);
        if (original && clonedElement instanceof HTMLElement) {
          prepareClone(clonedElement, original, accumulatedSpacerHeight);

          // Apply spacers to the cloned element in onclone
          spacerInsertions.forEach((insertion) => {
            const clonedTarget = clonedElement.querySelector(`[data-pdf-split-id="${insertion.elementIndex}"]`);
            if (clonedTarget instanceof HTMLElement && clonedTarget.parentNode) {
              const spacer = _doc.createElement('div');
              spacer.style.height = `${insertion.height}px`;
              spacer.style.width = '100%';
              spacer.style.clear = 'both';
              spacer.style.margin = '0';
              spacer.style.padding = '0';
              spacer.style.border = 'none';
              spacer.style.background = 'transparent';
              clonedTarget.parentNode.insertBefore(spacer, clonedTarget);
            }
          });
        }
      },
    });

    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
    addCanvasPagesToPdf(pdf, canvas);
    pdf.save(filename);
  } finally {
    if (header instanceof HTMLElement) {
      header.style.position = prevPosition;
    }
    // Clean up temporary attributes from the live DOM
    effectiveTargets.forEach((target) => {
      target.removeAttribute('data-pdf-split-id');
    });
  }
}
