/* Expose a single crop through both margins. Only a change in layout needs a new print. */
(() => {
  const photograph = new Image();
  photograph.src = 'site/home/lunar-highlands.webp';

  function smooth(value) {
    const t = Math.min(1, Math.max(0, value));
    return t * t * (3 - 2 * t);
  }

  class LunarSurface extends HTMLElement {
    connectedCallback() {
      this.canvas = document.createElement('canvas');
      this.replaceChildren(this.canvas);
      this.observer = new ResizeObserver(() => {
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(() => this.draw());
      });
      this.observer.observe(this);
      photograph.decode().then(() => this.draw()).catch(() => {});
    }

    disconnectedCallback() {
      this.observer.disconnect();
      cancelAnimationFrame(this.frame);
    }

    draw() {
      if (!this.isConnected || !photograph.naturalWidth || !this.clientWidth) return;
      const {canvas} = this;
      const width = Math.min(1600, this.clientWidth);
      const height = Math.max(1, Math.round(this.clientHeight * width / this.clientWidth));
      if (this.hasAttribute('ready') && canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', {willReadFrequently:true});
      if (!ctx) return;
      // Crop the oblique highlands view uniformly, keeping the foreground ridge in frame.
      const scale = Math.min(1600 / width, 1270 / height);
      const sw = width * scale, sh = height * scale;
      ctx.drawImage(photograph, (1600 - sw) * .62, 808 - sh / 2, sw, sh, 0, 0, width, height);
      const frame = ctx.getImageData(0, 0, width, height);
      const data = frame.data;
      const headingShade = Array.from({length:width}, (_,x) => .18 + .82 * smooth((x / width - .18) / .76));
      const nightExposure = Array.from({length:256}, (_,v) => 144 * Math.pow(v / 255, 1.12));
      // The pit shadows and lit rims surface at different points along the scroll.
      const entrance = parseFloat(getComputedStyle(this).paddingTop) * width / this.clientWidth;
      const exit = parseFloat(getComputedStyle(this).paddingBottom) * width / this.clientWidth;
      for (let y = 0; y < height; y++) {
        const depth = Math.min(1, y / entrance, (height - 1 - y) / exit);
        const variation = 4 * depth * (1 - depth);
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const relief = data[i] / 255;
          const exposure = smooth(depth + variation * (.1 + .16 * (x / width - .5) - .16 * relief));
          const rock = nightExposure[data[i]] * headingShade[x];
          data[i] = 7 + rock;
          data[i+1] = 10 + rock;
          data[i+2] = 15 + rock;
          data[i+3] = Math.round(255 * exposure);
        }
      }
      ctx.putImageData(frame, 0, 0);
      this.setAttribute('ready','');
    }
  }
  customElements.define('lf-lunar-surface', LunarSurface);
})();
