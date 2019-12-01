interface assetsObject {
    [key: string]: any;
}
interface TimeFrame {
    time: number;
    frame: number;
}
interface AssetsItem {
    id: string;
    src: string;
}
export declare let width: number, height: number, keyboard: Keyboard, mouse: Mouse, animation: AnimationCtrl, assets: assetsObject;
export declare function dvStart(setup?: () => void, draw?: () => void, events?: () => void, loadAssets?: () => void): void;
export declare function createCanvas(target: HTMLElement, id?: string): void;
export declare function selectCanvas(id: string): void;
export declare function resizeCanvas(w: number, h: number, canvas?: HTMLCanvasElement): void;
declare class Mouse {
    private _canvas;
    private _x;
    private _y;
    private _px;
    private _py;
    isPressed: boolean;
    wheel: (e: MouseWheelEvent) => void;
    down: () => void;
    up: () => void;
    click: () => void;
    dblClick: () => void;
    constructor(canvas: HTMLCanvasElement);
    private _updateMousePos;
    get x(): number;
    get y(): number;
    get px(): number;
    get py(): number;
}
declare class Keyboard {
    keyIsPressed: boolean;
    altIsPressed: boolean;
    shiftIsPressed: boolean;
    ctrlIsPressed: boolean;
    keyPressed: string | null;
    keyDown: (key: string) => void;
    keyUp: (key: string) => void;
    private _canvas;
    constructor(canvas: HTMLCanvasElement);
}
declare class AnimationCtrl {
    private _fps;
    private _delay;
    private _time;
    private _loop;
    currentFrame: number;
    isAnimating: boolean;
    start: () => void;
    stop: () => void;
    constructor(callback: (TimeFrame: TimeFrame) => void);
    get fps(): number;
    set fps(v: number);
}
export declare enum Cursor {
    default = 0,
    auto = 1,
    crosshair = 2,
    pointer = 3,
    move = 4,
    eresize = 5,
    neresize = 6,
    nwresize = 7,
    nresize = 8,
    seresize = 9,
    swresize = 10,
    sresize = 11,
    wresize = 12,
    text = 13,
    wait = 14,
    help = 15,
    progress = 16,
    copy = 17,
    alias = 18,
    ctxmenu = 19,
    cell = 20,
    notallowed = 21,
    colresize = 22,
    rowresize = 23,
    nodrop = 24,
    verticaltext = 25,
    allscroll = 26,
    neswresize = 27,
    nwseresize = 28,
    nsresize = 29,
    ewresize = 30,
    none = 31
}
export declare function cursor(cursorType: Cursor): void;
export declare function translate(x: number, y: number): void;
export declare function rotate(angle: number): void;
export declare function scale(x: number, y: number): void;
export declare function save(): void;
export declare function restore(): void;
export declare function staticDrawing(): void;
export declare function clear(): void;
export declare function background(...args: any[]): void;
export declare function stroke(...args: any[]): void;
export declare function strokeWidth(size: number): void;
export declare function noStroke(): void;
export declare enum StrokeCupStyle {
    butt = 0,
    round = 1,
    square = 2
}
export declare function strokeCup(style: StrokeCupStyle): void;
export declare enum JoinStyle {
    bevel = 0,
    round = 1,
    miter = 2
}
export declare function strokeJoin(style: JoinStyle, miterValue?: number): void;
export declare function dashLine(line: number, space: number, offset?: number): void;
export declare function solidLine(): void;
export declare function fill(...args: any[]): void;
export declare function noFill(): void;
export declare function shadow(level: number, offsetX: number, offsetY: number, ...color: any[]): void;
export declare function point(x: number, y: number): void;
export declare function line(x1: number, y1: number, x2: number, y2: number): void;
export declare function arc(x: number, y: number, r: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
export declare function circle(x: number, y: number, r: number): void;
export declare function ellipse(x: number, y: number, r1: number, r2: number, angle?: number): void;
export declare function ring(x: number, y: number, r1: number, r2: number, startAngle?: number, endAngle?: number): void;
export declare function rect(x: number, y: number, w: number, h: number, r?: number): void;
export declare function star(x: number, y: number, r1: number, r2: number, n?: number): void;
export declare function polygon(x: number, y: number, r: number, n?: number): void;
export declare function spline(pts: number[], tension?: number, closed?: boolean): void;
export declare function bezier(x1: number, y1: number, cp1x: number, cp1y: number, cp2x: number, cp2y: number, x2: number, y2: number): void;
export declare function beginPath(x: number, y: number): void;
export declare function endPath(): void;
export declare function closeShape(): void;
export declare function moveTo(x: number, y: number): void;
export declare function lineTo(x: number, y: number): void;
export declare function bezierTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
export declare function quadraticTo(cpx: number, cpy: number, x: number, y: number): void;
export declare const light = "#EDE5DD";
export declare const dark = "#26201C";
export declare const yellow = "#ECDC21";
export declare const orange = "#E09423";
export declare const green = "#53C352";
export declare const red = "#E0533D";
export declare const blue = "#4DAFEA";
export declare const magenta = "#B34DFF";
export declare function blend(color1: string, color2: string, proportion: number): string;
export declare function randomColor(): string;
export declare enum ImgOrigin {
    lb = 0,
    rb = 1,
    cb = 2,
    lt = 3,
    rt = 4,
    ct = 5,
    lc = 6,
    rc = 7,
    cc = 8
}
export declare function placeImage(img: HTMLImageElement, x: number, y: number, origin: ImgOrigin, w?: number, h?: number): void;
export declare function text(text: string, x: number, y: number): void;
export declare function textSize(size?: number): void | number;
export declare function textWidth(text: string): number;
export declare function textDim(text: string): {
    w: number;
    h: number;
};
export declare enum TextAlign {
    left = 0,
    right = 1,
    center = 2,
    start = 3,
    end = 4
}
export declare enum TextBaseline {
    top = 0,
    hanging = 1,
    middle = 2,
    alphabetic = 3,
    ideographic = 4,
    bottom = 5
}
export declare function textAlign(h: TextAlign, v?: TextBaseline): void;
export declare function fontStyle(style?: string): void | string;
export declare function fontWeight(weight?: string): void | string;
export declare function fontFamily(family?: string): void | string;
export declare function lineHeight(height?: number): void | number;
export declare function textOnArc(text: string, x: number, y: number, r: number, startAngle: number, align?: TextAlign, outside?: boolean, inward?: boolean, kerning?: number): number;
export declare function number2str(x: number, radix?: number): string;
export declare function thousandSep(x: number, sep: string): string;
export declare const E: number, PI: number, TWO_PI: number, HALF_PI: number, PHI: number;
export declare let sin: (x: number) => number, cos: (x: number) => number, tan: (x: number) => number, asin: (x: number) => number, acos: (x: number) => number, atan: (x: number) => number, atan2: (y: number, x: number) => number;
export declare function dist(x1: number, y1: number, x2: number, y2: number): number;
export declare function deg2rad(v: number): number;
export declare function int(s: string, radix?: number): number;
export declare let str: StringConstructor;
export declare function mm2px(v: number): number;
export declare function px2mm(v: number): number;
export declare function hexStr(v: number): string;
export declare function round(x: number, decimal?: number): number;
export declare function round2str(x: number, decimal: number): string;
export declare let floor: (x: number) => number;
export declare let ceil: (x: number) => number;
export declare function constrain(v: number, l1: number, l2: number): number;
export declare function sq(v: number): number;
export declare let pow: (x: number, y: number) => number;
export declare let sqrt: (x: number) => number;
export declare let abs: (x: number) => number;
export declare function max(numbers: number[]): number;
export declare function min(numbers: number[]): number;
export declare function sum(numbers: number[]): number;
export declare function avg(numbers: number[]): number;
export declare function centile(data: number[], c: number): number;
export declare function revCentile(data: number[], n: number): number;
export declare function iqr(data: number[]): number;
export declare function dataRange(data: number[]): number;
declare enum SDevMethod {
    sample = 0,
    population = 1
}
export declare function stdDev(data: number[], method?: SDevMethod): number;
export declare class Vector {
    private _x;
    private _y;
    constructor(x: number, y: number);
    set(x: number, y: number): void;
    get x(): number;
    get y(): number;
    set x(v: number);
    set y(v: number);
    copy(): Vector;
    add(v: Vector): Vector;
    addInPlace(v: Vector): void;
    sub(v: Vector): Vector;
    subInPlace(v: Vector): void;
    mult(s: number): Vector;
    multInPlace(s: number): void;
    div(s: number): Vector;
    divInPlace(s: number): void;
    dot(v: Vector): number;
    norm(): Vector;
    normInPlace(): void;
    get direction(): number;
    set direction(angle: number);
    get magnitude(): number;
    set magnitude(magnitude: number);
    limit(limitScalar: number): void;
}
export declare class Noise {
    private _min;
    private _max;
    private _range;
    private _value;
    constructor(min: number, max: number, noiseRange: number);
    set min(value: number);
    set max(value: number);
    set noiseRange(value: number);
    get value(): number;
    set value(value: number);
    get intValue(): number;
    private nextValue;
}
export declare function randomInt(a: number, b: number): number;
export declare function choose(items: any[]): any;
export declare function random(...args: number[]): number;
export declare function shuffle(items: any[]): void;
export declare function unique(items: any[]): any[];
export declare function fibonacci(n: number): number[];
export declare function linearScale(dataMin: number, dataMax: number, resultMin: number, resultMax: number): (x: number) => number;
export declare function ordinalScale(d: any[], padding: number, resultMin: number, resultMax: number): (x: number) => number;
export declare let prnt: any;
export declare function svg2img(svg: string): HTMLImageElement;
export declare function addAsset(asset: AssetsItem): void;
export {};
