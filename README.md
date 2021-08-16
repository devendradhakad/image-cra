# Documentation and Installation Guide

Live Project Url

```sh
https://image-cra.herokuapp.com/
```

## _Documentation_


[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

This application is about generating a Image having unique values of R(Red), G(Green), and B(Blue) for each pixle.

As we know that every image is formed by adding pixels in a specific dimensions and each pixel have some value of R, G and B. using these values each pixel have some color so each pixel has their own color. So when we add multiple pixles they forms some pattern and it generates an Image.

So lets take an example:
Suppose we want to generate an Image of dimensions 256 \* 128. Where Width is 256 px and Height is 128 px.

Here total number of pixles = 256 \* 128 = 32768
so to fill each pixle with unique color we need 32,768 number of unique colors
Values of R, G and B can be vary from 0...256.
There is one constrint that we have to consider, only values that are multiplier of 8 can only form pixle values, so values can be 8, 16, 24, ... 256
so for example R can have 32 values(8, 16, 24...256) and G and B will also have 32 values each.

So if we generate a pixel [R, G, B] => R --> 32, G --> 32, B --> 32 values
so total combinations of unique values will be 32 _ 32 _ 32 = 32768

Now we have 32768 number of unique [R, G, B] pixles values

## Features

- Each Pixel have unique [R, G, B] value set means unique color
- Color values are multipler of 8
- Test cases for each file upto 80% coverage

## Algorithm

First we calculate the 32768 unique [R, G, B] color set

```
let totalPixels = []
for(let r = 8; r <= 256; r += 8){
    for(let g = 8; g <= 256; g += 8){
        for(let r = 8; b <= 256; b += 8){
            totalPixels.push([r, g, b])
        }
    }
}
```

```
Complexity: O(n^3)
```

Now we have an array of length 32768 unique [R, G, B] set

using these pixel values we can draw an image on Canvas;

## Challenge

We are using ReactJs that is library of JS. We know JS is single threaded.
We have to do computation of 32768 times so its a heavy calculation. If we do it on JS's main thread then it will block rendering of UI.

## Solution

To solve this problem we are using <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API">Web Workers</a>
Web workers use different thread and perform a task in background so our main thread will not block.
But Worker also have some limitations like we can not access the DOM directly it means we dont have access to our Canvas Element. There is one expermental feature in JS "OffscreenCanvas" the Canvas workes inside worker but this is expermental feature so we are not going to use it.

So what we will do-
We do the following

- Send PostMessage to worker to initate the calculation
- Calculate the pixel values on Worker
- Return calculated pixel values back to main thread
- Generate the ImageData with same height and width
- Put ImageData into canvas and draw Image

## Tech

This application uses following projects to work properly:

- [ReactJS] - HTML enhanced for web apps!
- [Jest] - Test library
- [VsCode] - Awesome web-based text editor
- [ESlint] - To follow same development pattern
- [Prettier] -Format the project files based on given standards
- [husky] - Pre-commit hook to lint and format the files before every commit

## Installation

Application requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd code-test-new
npm i
npm run start
```

## Commands

Format project files:

```sh
npm run format
```

Check lint errors

```sh
npm run lint
```

Fix lint errors

```sh
npm run lint-fix
```

Run test cases

```sh
npm run test
```

Run test cases along with coverage

```
npm run test --coverage --watchAll
```

Build the app

```sh
npm run build
```

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
127.0.0.1:3000
```

## License

MIT

**Free Software, Hell Yeah!**
