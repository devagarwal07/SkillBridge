export class SplitText {
  private element: HTMLElement;
  public chars: HTMLElement[] = [];
  public words: HTMLElement[] = [];
  public lines: HTMLElement[] = [];

  // Current user data
  private currentDateTime = "2025-03-03 19:39:58";
  private currentUser = "vkhare2909";

  constructor(element: HTMLElement, private options = { type: "chars" }) {
    this.element = element;
    this.split();
  }

  private split(): void {
    const text = this.element.textContent || "";
    const textArray = text.split(" ");

    // Clear original content
    this.element.textContent = "";

    if (
      this.options.type.includes("words") ||
      this.options.type.includes("chars")
    ) {
      textArray.forEach((word, wordIndex) => {
        const wordSpan = this.createSpan(
          "word",
          word + (wordIndex !== textArray.length - 1 ? "&nbsp;" : "")
        );
        this.words.push(wordSpan);
        this.element.appendChild(wordSpan);

        if (this.options.type.includes("chars")) {
          const chars = wordSpan.textContent?.split("") || [];
          wordSpan.textContent = "";

          chars.forEach((char) => {
            const charSpan = this.createSpan("char", char);
            this.chars.push(charSpan);
            wordSpan.appendChild(charSpan);
          });
        }
      });
    }

    if (this.options.type.includes("lines")) {
      // We need to wait for the browser to calculate layout
      setTimeout(() => {
        this.calculateLines();
      }, 100);
    }
  }

  private createSpan(className: string, content: string): HTMLElement {
    const span = document.createElement("span");
    span.classList.add(className);
    span.style.display = "inline-block";
    span.style.position = "relative";
    span.innerHTML = content;
    span.dataset.user = this.currentUser;
    span.dataset.timestamp = this.currentDateTime;
    return span;
  }

  private calculateLines(): void {
    let currentTop = 0;
    let currentLine: HTMLElement[] = [];

    this.words.forEach((word, index) => {
      const wordTop = word.offsetTop;

      if (index === 0 || wordTop === currentTop) {
        currentLine.push(word);
      } else {
        // New line detected
        this.wrapLineElements(currentLine);
        currentLine = [word];
        currentTop = wordTop;
      }

      // Handle the last line
      if (index === this.words.length - 1) {
        this.wrapLineElements(currentLine);
      }
    });
  }

  private wrapLineElements(elements: HTMLElement[]): void {
    if (elements.length === 0) return;

    const lineWrapper = document.createElement("span");
    lineWrapper.classList.add("line");
    lineWrapper.style.display = "block";
    lineWrapper.style.position = "relative";
    lineWrapper.dataset.user = this.currentUser;
    lineWrapper.dataset.timestamp = this.currentDateTime;

    const parent = elements[0].parentNode;
    parent?.insertBefore(lineWrapper, elements[0]);

    elements.forEach((element) => {
      lineWrapper.appendChild(element);
    });

    this.lines.push(lineWrapper);
  }
}
