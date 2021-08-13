const workercode = () => {
  onmessage = (e) => {
    const [width, height, pixels, id] = e.data;
    let counter = 0;
    for (let r = 8; r <= 256; r += 8) {
      for (let g = 8; g <= 256; g += 8) {
        for (let b = 8; b <= 256; b += 8) {
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
        }
      }
    }
    postMessage([pixels]);
  };
};

// Make worker work without Ejecting from CRA
let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const workerScript = URL.createObjectURL(blob);

export default workerScript;
