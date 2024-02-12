let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  moveX = 0;
  moveY = 0;
  endX = 0;
  endY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  startEvent = 'mousedown';
  moveEvent = 'mousemove';
  endEvent = 'mouseup';

  constructor() {
    // Check if the device supports touch events
    if ('ontouchstart' in window) {
      this.startEvent = 'touchstart';
      this.moveEvent = 'touchmove';
      this.endEvent = 'touchend';
    }
  }

  init(paper) {
    document.addEventListener(this.moveEvent, (e) => {
      e.preventDefault();
      if (!this.rotating) {
        this.moveX = this.getEventX(e);
        this.moveY = this.getEventY(e);

        this.velX = this.moveX - this.prevX;
        this.velY = this.moveY - this.prevY;
      }

      const dirX = this.getEventX(e) - this.startX;
      const dirY = this.getEventY(e) - this.startY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevX = this.moveX;
        this.prevY = this.moveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener(this.startEvent, (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.startX = this.getEventX(e);
      this.startY = this.getEventY(e);
      this.prevX = this.startX;
      this.prevY = this.startY;
    });

    paper.addEventListener(this.endEvent, () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // For two-finger rotation on touch screens
    if (this.startEvent === 'touchstart') {
      paper.addEventListener('gesturestart', (e) => {
        e.preventDefault();
        this.rotating = true;
      });
      paper.addEventListener('gestureend', () => {
        this.rotating = false;
      });
    }
  }

  getEventX(event) {
    return this.startEvent === 'touchstart' ? event.touches[0].clientX : event.clientX;
  }

  getEventY(event) {
    return this.startEvent === 'touchstart' ? event.touches[0].clientY : event.clientY;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
