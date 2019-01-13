# Dynamic Visualizations Library
<a href= "https://dvlib.org"><img src="https://dvlib.org/images/dvlogo100.svg" align="left" hspace="10" vspace="6"></a>
Dynamic Visualizations Library ([*dvlib*](https://dvlib.org)) is a JavaScript library which helps to create interactive data visualizations on HTML Canvas. Because [*dvlib*](https://dvlib.org) is written in TypeScript, it can be easily used with [PowerBI Visual Tools](https://github.com/Microsoft/PowerBI-visuals-tools) to create outstanding custom visualizations for Power BI using object oriented programming approach.
## Installing
Recommended installation is via `npm`.

```
npm i dvlib
```

## Quick start with webpack
### Create new folder with the following structure\

```
newProject
|- /src
  |- main.ts
|- /dist
  |- index.html
|- webpack.config.js
```

*index.html*

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>dvlib</title>
</head>
<body>
  <script type="text/javascript" src="./main.js"></script>
</body>
</html>
```
*webpack.config.js*

```js
const path = require('path');

module.exports = {
    entry: './src/main.ts',
    mode: 'production',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```
### Create package.json
```node
npm init -y
```
### Install webpack and webpack-cli
```node
npm i --save-dev webpack
```
```node
npm i --save-dev webpack-cli
```
Add to the to the "scripts" dictionary in the package.json:

```json
"build": "webpack --config webpack.config.js"
```
### Install the TypeScript compiler and loader
```node
npm i --save-dev typescript ts-loader
```
### Create tsconfig.json
```node
npx tsc --init
```
### Install dvlib
```node
npm i dvlib
```
### Write your first program
*main.ts*

```ts
import "dvlib";
import { 
    createCanvas, dvStart, resizeCanvas, background, fill, 
    textAlign, HAlignment, textSize, text, width, height 
} from "dvlib";

dvStart(setup, draw);

function setup(): void {
    let body: HTMLElement = document.getElementsByTagName('body')[0];
    createCanvas(body);
    resizeCanvas(600, 300);
}

function draw() {
    background('#2d2f2f');
    fill('#faf6ee');
    textAlign(HAlignment.center);
    textSize(48);
    text('Hello, World!', width / 2, height / 2);
}
```
<img src="https://dvlib.org/images/helloworld.png" align="middle" hspace="10" vspace="6">