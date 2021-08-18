/**
 * @description Define own worker
 */
export default class MyWorker {
    constructor(stringUrl) {
      this.url = stringUrl;
      this.onmessage = (msg) => {
        let counter = 0;
        let count = 0;
        const [width, height, pixels, id] = msg;
        let tempOff = 255, tempY = 8;
        for (let r = 8; r <= 256; r += 8) {
          for (let g = 8; g <= 256; g += 8) {
            for (let b = 8; b <= 256; b += 8) {
              if(count == height * width){
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
                tempOff = off;
                tempY = y;
              }
              counter += 4;
              count = count + 1;
            }
          }
        }
        return [pixels, tempOff, tempY]
      };
    }
  
    postMessage(msg) {
      const newFn = this.onmessage(msg);
      return newFn
    }
}
