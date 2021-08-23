/**
 * @description Calculate Pixels and send back to main thread
 */
function workercode() {
  this.calculatePixels = (e) => {
    const [width, height, pixels, id] = e.data;
    let counter = 0;
    let count = 0;
    for (let r = 8; r <= 256; r += 8) {
      for (let g = 8; g <= 256; g += 8) {
        for (let b = 8; b <= 256; b += 8) {
          if (count === height * width) {
            break;
          }
          const x = Math.floor(Math.random() * width);
          const y = Math.floor(Math.random() * height);
          const off = (y * id.width + x) * 4;
          pixels[counter] = r;
          pixels[counter + 1] = g;
          pixels[counter + 2] = b;
          pixels[counter + 3] = 255;
          if (y > width / 2) {
            pixels[off + 3] = 2 * (1 - x / 10);
          }
          counter += 4;
          count += 1;
        }
      }
    }
    return pixels;
  };

  this.onmessage = async (e) => {
    const pixels = this.calculatePixels(e);
    this.postMessage([pixels]);
  };
}

// Make worker work without Ejecting from CRA
let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const workerScript = URL.createObjectURL(blob);

export {
  workerScript,
  workercode,
};
