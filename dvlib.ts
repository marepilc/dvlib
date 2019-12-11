'use strict';

// custom types
interface ColorRGB {
    r: number,
    g: number,
    b: number
}

interface ColorRGBA {
    r: number,
    g: number,
    b: number,
    a: number
}

interface assetsObject {
    [key: string]: any
}

interface TimeFrame {
    time: number,
    frame: number
}

interface AssetsItem {
    id: string,
    src: string
}

// Global variables
export let
    width: number,
    height: number,
    keyboard: Keyboard,
    mouse: Mouse,
    animation: AnimationCtrl,
    assets: assetsObject;

export function dvStart(setup?: () => void, draw?: () => void,
                        events?: () => void, loadAssets?: () => void) {
    assets = {};
    if (loadAssets != undefined) loadAssets();
    if (assetList.length > 0) {
        preloader.on('complete', onCompletePreloader); // on complete listener
        preloader.load(assetList); // launch the loading process
    } else {
        dVrun(setup, draw, events);
    }

    function onCompletePreloader(): void {
        for (let a of assetList) {
            assets[a.id] = preloader.getResult(a.id);
        }
        dVrun(setup, draw, events);
    }
}

function dVrun(setup?: () => void, draw?: () => void, events?: () => void) {
    if (animation == undefined) {
        animation = new AnimationCtrl(() => {
            save();
            if (draw != undefined) draw();
            restore();
        });
    }
    if (setup != undefined) setup();
    if (mouse == undefined) mouse = new Mouse(dV.canvas);
    if (events != undefined) events();
    if (dV.noLoop) {
        save();
        if (draw != undefined) draw();
        restore();
    } else {
        animation.start();
    }
}

export function createCanvas(target: HTMLElement, id?: string): void {
    let cnv = document.createElement('canvas');
    if (id !== undefined) cnv.id = id;
    if (keyboard == undefined) keyboard = new Keyboard(cnv);   
    if (dV == undefined) dV = new DV(cnv);
    target.appendChild(dV.canvas);
    setContextDefault();
}

export function selectCanvas(id: string): void {
    let cnv = <HTMLCanvasElement>document.getElementById(id);
    if (keyboard == undefined) keyboard = new Keyboard(cnv);
    if (dV == undefined) dV = new DV(cnv);
    setContextDefault();
}

export function resizeCanvas(w: number, h: number, canvas: HTMLCanvasElement = dV.canvas): void {
    canvas.setAttribute('width', str(w));
    canvas.setAttribute('height', str(h));
    setContextDefault();
}

let dV: DV;

let assetList: AssetsItem[] = [];

class Mouse {
    private _canvas: HTMLCanvasElement;
    private _x: number;
    private _y: number;
    private _px: number;
    private _py: number;
    public isPressed: boolean;
    public wheel: (e: MouseWheelEvent) => void;
    public down: () => void;
    public up: () => void;
    public click: () => void;
    public dblClick: () => void;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._x = 0;
        this._y = 0;
        this._px = 0;
        this._py = 0;
        this.isPressed = false;
        this.wheel = function (e) {};
        this.down = function () {};
        this.up = function () {};
        this.click = function () {};
        this.dblClick = function () {};

        this._canvas.addEventListener('mousemove', (e: MouseEvent) => {
            this._updateMousePos(canvas, e);
        });
        this._canvas.addEventListener('wheel', (e: WheelEvent) => {
            this._updateMousePos(canvas, e);
            this.wheel(e);
        });
        this._canvas.addEventListener('mousedown', () => {
            this.isPressed = true;
            this.down();
        });
        this._canvas.addEventListener('mouseup', () => {
            this.isPressed = false;
            this.up();
        });
        this._canvas.addEventListener('click', () => {
            this.click();
        });
        this._canvas.addEventListener('dblclick', () => {
            this.dblClick();
        });
    }

    private _updateMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
        this._px = this._x;
        this._py = this._y;
        let bbox = canvas.getBoundingClientRect();
        this._x = abs(round((e.clientX - bbox.left) * (width / bbox.width)));
        this._y = abs(round((e.clientY - bbox.top) * (height / bbox.height)));
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get px() {
        return this._px;
    }

    get py() {
        return this._py;
    }
}


class Keyboard {
    public keyIsPressed: boolean;
    public altIsPressed: boolean;
    public shiftIsPressed: boolean;
    public ctrlIsPressed: boolean;
    public keyPressed: string | null;
    public keyDown: (key: string) => void;
    public keyUp: (key: string) => void;
    private _canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this.keyIsPressed = false;
        this.altIsPressed = false;
        this.shiftIsPressed = false;
        this.ctrlIsPressed = false;
        this.keyPressed = null;
        this.keyDown = function (key) { };
        this.keyUp = function (key) { };
        this._canvas.tabIndex = 1; // to make it focusable
        this._canvas.addEventListener('keydown', (e) => {
            this.keyIsPressed = true;
            if (e.key === 'Alt') this.altIsPressed = true;
            if (e.key === 'Shift') this.shiftIsPressed = true;
            if (e.key === 'Control') this.ctrlIsPressed = true;
            this.keyPressed = e.key;
            this.keyDown(e.key);
        });
        this._canvas.addEventListener('keyup', (e) => {
            this.keyIsPressed = false;
            if (e.key === 'Alt') this.altIsPressed = false;
            if (e.key === 'Shift') this.shiftIsPressed = false;
            if (e.key === 'Control') this.ctrlIsPressed = false;
            this.keyPressed = null;
            this.keyUp(e.key);
        });
    }
}

class AnimationCtrl {
    private _fps: number;
    private _delay: number;
    private _time: number | null;
    private _loop: (x: number) => void;
    public currentFrame: number;
    public isAnimating: boolean;
    public start: () => void;
    public stop: () => void;

    constructor(callback: (TimeFrame: TimeFrame) => void) {
        this._fps = 60;
        this._delay = 1000 / this._fps;
        this.currentFrame = -1;

        this._time = null;
        let reqAF: number;

        this._loop = (timestamp: number) => {
            if (this._time == null) this._time = timestamp;
            let seg = floor((timestamp - this._time) / this._delay);
            if (seg > this.currentFrame) {
                this.currentFrame = seg;
                callback({
                    time: timestamp,
                    frame: this.currentFrame
                })
            }
            reqAF = requestAnimationFrame(this._loop);
        };

        this.isAnimating = false;

        this.start = () => {
            if (!this.isAnimating) {
                this.isAnimating = true;
                reqAF = requestAnimationFrame(this._loop);
            }
        };

        this.stop = () => {
            if (this.isAnimating) {
                cancelAnimationFrame(reqAF);
                this.isAnimating = false;
                this._time = null;
                this.currentFrame = -1;
            }
        };
    }

    public get fps() {
        if (this.isAnimating) {
            return this._fps;
        } else {
            return 0;
        }
    }

    public set fps(v: number) {
        this._fps = v;
        this._delay = 1000 / this._fps;
        this.currentFrame = -1;
        this._time = null;
    }
}

class DV {
    public ctx: CanvasRenderingContext2D | null;
    public canvas: HTMLCanvasElement;
    public dpi: number;
    public noLoop: boolean;
    public withFill: boolean;
    public withStroke: boolean;
    public currentFill: string;
    public currentStroke: string;
    public fontStyle: string;
    public fontWeight: string;
    public fontSize: number;
    public fontFamily: string;
    public lineHeight: number;

    constructor(canvas: HTMLCanvasElement, noLoop = false) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.dpi = 300;
        this.noLoop = noLoop;
        this.withFill = true;
        this.withStroke = true;
        this.currentFill = light;
        this.currentStroke = dark;
        this.fontStyle = 'normal';
        this.fontWeight = 'normal';
        this.fontSize = 24;
        this.fontFamily = 'sans-serif';
        this.lineHeight = 1.1;
    }

    public commitShape() {
        if (this.withFill && !!this.ctx) this.ctx.fill();
        if (this.withStroke && !!this.ctx) this.ctx.stroke();
    }
};

export enum Cursor { // https://developer.mozilla.org/pl/docs/Web/CSS/cursor
    default, auto, crosshair, pointer, move,
    eresize, neresize, nwresize, nresize, seresize,
    swresize, sresize, wresize, text, wait, help, progress,
    copy, alias, ctxmenu, cell, notallowed, colresize,
    rowresize, nodrop, verticaltext, allscroll, neswresize,
    nwseresize, nsresize, ewresize, none
}

export function cursor(cursorType: Cursor): void {
    let types: string[] = ['default', 'auto', 'crosshair', 'pointer', 'move',
        'e-resize', 'ne-resize', 'nw-resize', 'n-resize', 'se-resize',
        'sw-resize', 's-resize', 'w-resize', 'text', 'wait', 'help', 'progress',
        'copy', 'alias', 'context-menu', 'cell', 'not-allowed', 'col-resize',
        'row-resize', 'no-drop', 'vertical-text', 'all-scroll', 'nesw-resize',
        'nwse-resize', 'ns-resize', 'ew-resize', 'none'];
    if (!!dV.canvas) dV.canvas.style.cursor = types[cursorType];
}


function setContextDefault(): void {
    if (!!dV.canvas) {
        dV.ctx = dV.canvas.getContext('2d');
        height = dV.canvas.height;
        width = dV.canvas.width;
        if (!!dV.ctx) {
            dV.ctx.fillStyle = dV.currentFill;
            dV.ctx.strokeStyle = dV.currentStroke;
            setFont();
            // dV.ctx.translate(0, height);
            // dV.ctx.scale(1, -1);
        }
    }
}

/* transformation */
export function translate(x: number, y: number): void {
    if (!!dV.ctx) dV.ctx.translate(x, y);
}

export function rotate(angle: number): void {
    if (!!dV.ctx) dV.ctx.rotate(angle);
}

export function scale(x: number, y: number): void {
    if (!!dV.ctx) dV.ctx.scale(x, y);
}

export function save(): void {
    if (!!dV.ctx) dV.ctx.save();
}

export function restore(): void {
    if (!!dV.ctx) dV.ctx.restore();
}

export function staticDrawing(): void {
    dV.noLoop = true;
}

//---------------------------------------------------//
/* DRAWING */
//---------------------------------------------------//
export function clear(): void {
    if (!!dV.ctx) dV.ctx.clearRect(0, 0, width, height);
}

export function background(...args: any[]): void {
    save();
    let c = color2rgba(...args);
    if (!!dV.ctx) {
        dV.ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
        dV.ctx.fillRect(0, 0, width, height);
    }
    restore();
}

/* stroke and fill */

export function stroke(...args: any[]): void {
    dV.withStroke = true;
    let c = color2rgba(...args);
    if (!!dV.ctx) dV.ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
    dV.currentStroke = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
}

export function strokeWidth(size: number): void {
    dV.withStroke = true;
    if (!!dV.ctx) dV.ctx.lineWidth = size;
}

export function noStroke(): void {
    dV.withStroke = false;
}

export enum StrokeCupStyle {
    butt,
    round,
    square
}

export function strokeCup(style: StrokeCupStyle): void {
    let types: CanvasLineCap[] = ['butt', 'round', 'square'];
    if (!!dV.ctx) dV.ctx.lineCap = types[style];
}

export enum JoinStyle {
    bevel,
    round,
    miter
}

export function strokeJoin(style: JoinStyle, miterValue: number = 10): void {
    let types: CanvasLineJoin[] = ['bevel', 'round', 'miter'];
    if (style === JoinStyle.miter) {
        if (!!dV.ctx) dV.ctx.miterLimit = miterValue;
    }
    if (!!dV.ctx) dV.ctx.lineJoin = types[style];
}

export function dashLine(line: number, space: number, offset: number = 0): void {
    if (!!dV.ctx) {
        dV.ctx.setLineDash([line, space]);
        dV.ctx.lineDashOffset = offset;
    }
}

export function solidLine(): void {
    if (!!dV.ctx) dV.ctx.setLineDash([]);
}

export function fill(...args: any[]): void {
    dV.withFill = true;
    let c = color2rgba(...args);
    if (!!dV.ctx) dV.ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
    dV.currentFill = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
}

export function noFill(): void {
    dV.withFill = false;
}

export function shadow(level: number, offsetX: number, offsetY: number, ...color: any[]): void {
    let c = color2rgba(...color);
    if (!!dV.ctx) {
        dV.ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
        dV.ctx.shadowBlur = level;
        dV.ctx.shadowOffsetX = offsetX;
        dV.ctx.shadowOffsetY = offsetY;
    }
}

/* Shapes */
export function point(x: number, y: number): void {
    if (!!dV.ctx) dV.ctx.fillRect(x, y, 1, 1);
}

export function line(x1: number, y1: number, x2: number, y2: number): void {
    if (!!dV.ctx) {
        dV.ctx.beginPath();
        dV.ctx.moveTo(x1, y1);
        dV.ctx.lineTo(x2, y2);
        dV.ctx.stroke();
    }
}

export function arc(x: number, y: number, r: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
    if (!!dV.ctx) {
        dV.ctx.beginPath();
        dV.ctx.arc(x, y, r, startAngle, endAngle);
        dV.commitShape();
    }
}

export function circle(x: number, y: number, r: number): void {
    if (!!dV.ctx) {
        dV.ctx.beginPath();
        dV.ctx.arc(x, y, r, 0, PI * 2);
        dV.commitShape();
    }
}

export function ellipse(x: number, y: number, r1: number, r2: number, angle: number = 0): void {
    if (!!dV.ctx) {
        save();
        translate(x, y);
        rotate(angle);
        dV.ctx.beginPath();
        for (let i = 0; i < TWO_PI; i += 0.01) {
            let xPos = r1 * cos(i);
            let yPos = r2 * sin(i);
            if (i === 0) {
                dV.ctx.moveTo(xPos, yPos);
            } else {
                dV.ctx.lineTo(xPos, yPos);
            }
        }
        dV.commitShape();
        restore();
    }
}

export function ring(x: number, y: number, r1: number, r2: number,
    startAngle: number = 0, endAngle: number = TWO_PI): void {
    if (!!dV.ctx) {
        let ro = Math.max(r1, r2);
        let ri = Math.min(r1, r2);
        if (startAngle === 0 && endAngle === TWO_PI) {
            dV.ctx.beginPath();
            dV.ctx.arc(x, y, ro, startAngle, endAngle);
            dV.ctx.arc(x, y, ri, endAngle, startAngle, true);
            if (dV.withFill) dV.ctx.fill();
            if (dV.withStroke) {
                dV.ctx.beginPath();
                dV.ctx.arc(x, y, ro, startAngle, endAngle);
                dV.ctx.stroke();
                dV.ctx.beginPath();
                dV.ctx.arc(x, y, ri, startAngle, endAngle);
                dV.ctx.stroke();
            }
        } else {
            dV.ctx.beginPath();
            dV.ctx.arc(x, y, ro, startAngle, endAngle);
            dV.ctx.arc(x, y, ri, endAngle, startAngle, true);
            dV.ctx.closePath();
            dV.commitShape();
        }
    }
}

export function rect(x: number, y: number, w: number, h: number, r: number = 0): void {
    if (!!dV.ctx) {
        dV.ctx.beginPath();
        dV.ctx.moveTo(x + r, y);
        dV.ctx.lineTo(x + w - r, y);
        dV.ctx.arcTo(x + w, y, x + w, y + r, r);
        dV.ctx.lineTo(x + w, y + h - r);
        dV.ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        dV.ctx.lineTo(x + r, y + h);
        dV.ctx.arcTo(x, y + h, x, y + h - r, r);
        dV.ctx.lineTo(x, y + r);
        dV.ctx.arcTo(x, y, x + r, y, r);
        dV.commitShape();
    }
}

    


export function star(x: number, y: number, r1: number, r2: number, n: number = 5): void {
    if (!!dV.ctx) {
        let angle = TWO_PI / n;
        let halfAngle = angle / 2;
        dV.ctx.beginPath();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = x + cos(a - HALF_PI) * r2;
            let sy = y + sin(a - HALF_PI) * r2;
            dV.ctx.lineTo(sx, sy);
            sx = x + cos(a - HALF_PI + halfAngle) * r1;
            sy = y + sin(a - HALF_PI + halfAngle) * r1;
            dV.ctx.lineTo(sx, sy);
        }
        dV.ctx.closePath();
        dV.commitShape();
    }
}

export function polygon(x: number, y: number, r: number, n: number = 5): void {
    if (!!dV.ctx) {
        let angle = TWO_PI / n;
        dV.ctx.beginPath();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = x + cos(a - HALF_PI) * r;
            let sy = y + sin(a - HALF_PI) * r;
            dV.ctx.lineTo(sx, sy);
        }
        dV.ctx.closePath();
        dV.commitShape();
    }
}

export function spline(pts: number[], tension: number = 0.5, closed: boolean = false): void {
    if (!!dV.ctx) {
        save();
        let cp: number[] = [];
        let n = pts.length;

        if (closed) {
            pts.push(pts[0], pts[1], pts[2], pts[3]);
            pts.unshift(pts[n - 1]);
            pts.unshift(pts[n - 1]);
            for (let i = 0; i < n; i += 2) {
                cp = cp.concat(getControlPoints(pts[i], pts[i + 1], pts[i + 2], pts[i + 3],
                    pts[i + 4], pts[i + 5], tension));
            }
            cp = cp.concat(cp[0], cp[1]);
            for (let i = 2; i < n + 2; i += 2) {
                dV.ctx.beginPath();
                dV.ctx.moveTo(pts[i], pts[i + 1]);
                dV.ctx.bezierCurveTo(cp[2 * i - 2], cp[2 * i - 1], cp[2 * i], cp[2 * i + 1],
                    pts[i + 2], pts[i + 3]);
                dV.ctx.stroke();
                dV.ctx.closePath();
            }
        } else {
            for (let i = 0; i < n - 4; i += 2) {
                cp = cp.concat(getControlPoints(pts[i], pts[i + 1], pts[i + 2], pts[i + 3],
                    pts[i + 4], pts[i + 5], tension));
            }
            for (let i = 2; i < pts.length - 5; i += 2) {
                dV.ctx.beginPath();
                dV.ctx.moveTo(pts[i], pts[i + 1]);
                dV.ctx.bezierCurveTo(cp[2 * i - 2], cp[2 * i - 1], cp[2 * i], cp[2 * i + 1],
                    pts[i + 2], pts[i + 3]);
                dV.ctx.stroke();
                dV.ctx.closePath();
            }
            dV.ctx.beginPath();
            dV.ctx.moveTo(pts[0], pts[1]);
            dV.ctx.quadraticCurveTo(cp[0], cp[1], pts[2], pts[3]);
            dV.ctx.stroke();
            dV.ctx.closePath();

            dV.ctx.beginPath();
            dV.ctx.moveTo(pts[n - 2], pts[n - 1]);
            dV.ctx.quadraticCurveTo(cp[2 * n - 10], cp[2 * n - 9], pts[n - 4], pts[n - 3]);
            dV.ctx.stroke();
            dV.ctx.closePath();
        }
        restore();
    }
}

function getControlPoints(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, tension: number) {
    let d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    let d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    let fa = tension * d01 / (d01 + d12);
    let fb = tension - fa;

    let p1x = x1 + fa * (x0 - x2);
    let p1y = y1 + fa * (y0 - y2);

    let p2x = x1 - fb * (x0 - x2);
    let p2y = y1 - fb * (y0 - y2);

    return [p1x, p1y, p2x, p2y]
}

export function bezier(x1: number, y1: number, cp1x: number, cp1y: number, cp2x: number,
    cp2y: number, x2: number, y2: number): void {
    if (!!dV.ctx) {
        dV.ctx.beginPath();
        dV.ctx.moveTo(x1, y1);
        dV.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
        dV.ctx.stroke();
    }
}

/* Custom Paths */
export function beginPath(x: number, y: number): void {
    if (!!dV.ctx) {
        dV.ctx.beginPath();
        dV.ctx.moveTo(x, y);
    }
}

export function endPath(): void {
    dV.commitShape();
}

export function closeShape(): void {
    if (!!dV.ctx) {
        dV.ctx.closePath();
        dV.commitShape();
    }
}

export function moveTo(x: number, y: number): void {
    if (!!dV.ctx) dV.ctx.moveTo(x, y);
}

export function lineTo(x: number, y: number): void {
    if (!!dV.ctx) dV.ctx.lineTo(x, y);
}

export function bezierTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number,
    x: number, y: number): void {
    if (!!dV.ctx) dV.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
}

export function quadraticTo(cpx: number, cpy: number, x: number, y: number): void {
    if (!!dV.ctx) dV.ctx.quadraticCurveTo(cpx, cpy, x, y);
}

/* colors */
export const light = '#EDE5DD';
export const dark = '#26201C';
export const yellow = '#ECDC21';
export const orange = '#E09423';
export const green = '#53C352';
export const red = '#E0533D';
export const blue = '#4DAFEA';
export const magenta = '#B34DFF';

function color2rgba(...args: any[] ): ColorRGBA {
    let argCount = arguments.length;
    let rgbaColor: ColorRGBA = {r: 0, g: 0, b: 0, a: 1};;
    switch (argCount) {
        case 1:
            if (typeof arguments[0] === 'number') {
                let col = round(constrain(arguments[0], 0, 255));
                rgbaColor = {r: col, g: col, b: col, a: 1};
            } else if (typeof arguments[0] === 'string') {
                let col = str2rgb(arguments[0]);
                rgbaColor = {r: col.r, g: col.g, b: col.b, a: 1};
            }
            break;
            
        case 2:
            if (typeof arguments[0] === 'string' && typeof arguments[1] === 'number'){
                let col = str2rgb(arguments[0]);
            rgbaColor = {r: col.r, g: col.g, b: col.b, a: constrain(arguments[1], 0, 1)};
            }
            break;
        
        case 3:
            if (args.every(d => typeof d === 'number')) {
                rgbaColor = {r: round(constrain(arguments[0], 0, 255)), 
                    g: round(constrain(arguments[1], 0, 255)),
                    b: round(constrain(arguments[2], 0, 255)),
                    a: 1};
            }
            break;
        
        case 4:
            if (args.every(d => typeof d === 'number')) {
                rgbaColor = {r: round(constrain(arguments[0], 0, 255)), 
                    g: round(constrain(arguments[1], 0, 255)),
                    b: round(constrain(arguments[2], 0, 255)),
                    a: constrain(arguments[1], 0, 1)};
            }
            break;

        default:
            rgbaColor = {r: 0, g: 0, b: 0, a: 1};
            break;
    }
    return rgbaColor;
}

function str2rgb(col: string): ColorRGB {
    let rgb: ColorRGB = {
        r: 0,
        g: 0,
        b: 0
    };
    let rgx: RegExp = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    if (rgx.test(col)) {
        if (col.length == 4) {
            col = col.slice(0, 2) + col[1] + col.slice(2);
            col = col.slice(0, 4) + col[3] + col.slice(4);
            col = col + col[5];
        }
        rgb.r = int(col.slice(1, 3), 16);
        rgb.g = int(col.slice(3, 5), 16);
        rgb.b = int(col.slice(5), 16);
    }
    return rgb;
}

export function blend(color1: string, color2: string, proportion: number): string {
    let c1 = (color1.indexOf('#') === 0) ? color1 : '#' + color1;
    let c2 = (color2.indexOf('#') === 0) ? color2 : '#' + color2;
    let rgx: RegExp = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    if (rgx.test(c1) && rgx.test(c2)) {
        let col1 = (c1.length === 7) ? c1.slice(1) : c1;
        let col2 = (c2.length === 7) ? c2.slice(1) : c2;
        let r1 = int(col1.slice(0, 2), 16);
        let r2 = int(col2.slice(0, 2), 16);
        let r = round((1 - proportion) * r1 + proportion * r2);
        let g1 = int(col1.slice(2, 4), 16);
        let g2 = int(col2.slice(2, 4), 16);
        let g = round((1 - proportion) * g1 + proportion * g2);
        let b1 = int(col1.slice(4), 16);
        let b2 = int(col2.slice(4), 16);
        let b = round((1 - proportion) * b1 + proportion * b2);
        let strR = r.toString(16);
        if (strR.length === 1) strR = '0' + strR;
        let strG = g.toString(16);
        if (strG.length === 1) strG = '0' + strG;
        let strB = b.toString(16);
        if (strB.length === 1) strB = '0' + strB;
        return '#' + strR + strG + strB;
    } else {
        return '#000000';
    }
}

export function randomColor(): string {
    let r: string = hexStr(randomInt(0, 255));
    let g: string = hexStr(randomInt(0, 255));
    let b: string = hexStr(randomInt(0, 255));
    return '#' + r + g + b;
}

/* Assets */

export enum ImgOrigin {
    lb, rb, cb,
    lt, rt, ct,
    lc, rc, cc
}

export function placeImage(img: HTMLImageElement, x: number, y: number, origin: ImgOrigin,
    w?: number, h?: number): void {
    let _x = x;
    let _y = y;
    let _w: number;
    let _h: number;
    if (w) {
        _w = w;
    } else {
        _w = img.naturalWidth;
    }
    if (h) {
        _h = h;
    } else {
        _h = img.naturalHeight;
    }
    if (!!dV.ctx) {
        switch (origin) {
            case ImgOrigin.lb:
                dV.ctx.drawImage(img, _x, _y, _w, -_h);
                break;
            case ImgOrigin.rb:
                dV.ctx.drawImage(img, _x - _w, _y , _w, -_h);
                break;
            case ImgOrigin.cb:
                dV.ctx.drawImage(img, _x - _w / 2, _y, _w, -_h);
                break;
            case ImgOrigin.lt:
                dV.ctx.drawImage(img, _x, _y, _w, _h);
                break;
            case ImgOrigin.rt:
                dV.ctx.drawImage(img, _x - _w, _y, _w, _h);
                break;
            case ImgOrigin.ct:
                dV.ctx.drawImage(img, _x - _w / 2, _y, _w, _h);
                break;
            case ImgOrigin.lc:
                dV.ctx.drawImage(img, _x, _y + _h / 2, _w, -_h);
                break;
            case ImgOrigin.rc:
                dV.ctx.drawImage(img, _x - _w, _y + _h / 2, _w, -_h);
                break;
            case ImgOrigin.cc:
                dV.ctx.drawImage(img, _x - _w / 2, _y + _h / 2, _w, -_h);
                break;
        }
    }
}

export function canvas(): HTMLCanvasElement | undefined {
    if (!!dV.canvas) {
        return dV.canvas;
    }
} 

//---------------------------------------------------//
/* TYPOGRAPHY */
//---------------------------------------------------//

export function text(text: string, x: number, y: number): void {
    let lines = text.split('\n');
    let lineY = y;
    if (!!dV.ctx) {
        for (let i = 0; i < lines.length; i++) {
            dV.ctx.fillText(lines[i], x, lineY);
            lineY += dV.fontSize * dV.lineHeight;
        }
    }

}

export function textSize(size?: number): void | number {
    if (size != undefined) {
        dV.fontSize = size;
        if (!!dV.ctx) {
            setFont();
        }
    } else {
        return dV.fontSize;
    }
}

export function textWidth(text: string): number {
    if (!!dV.ctx) {
        return dV.ctx.measureText(text).width;
    } else {
        return 0;
    }
}

export function textDim(text: string): {
    w: number,
    h: number
} {
    let lines = text.split('\n');
    let wSize = 0;
    let hSize = 0;
    if (!!dV.ctx) {
        for (let i = 0; i < lines.length; i++) {
            wSize = max([wSize, dV.ctx.measureText(lines[i]).width]);
            hSize += dV.fontSize * dV.lineHeight;
        }
    }
    hSize = hSize - (dV.fontSize * dV.lineHeight - dV.fontSize);
    return {
        w: wSize,
        h: hSize
    };
}

export enum TextAlign {
    left,
    right,
    center,
    start,
    end
}

export enum TextBaseline {
    top,
    hanging,
    middle,
    alphabetic,
    ideographic,
    bottom
}

export function textAlign(h: TextAlign, v?: TextBaseline): void {
    if (!!dV.ctx) {
        const optionsH: CanvasTextAlign[] = ['left', 'right', 'center', 'start', 'end'];
        const optionsV: CanvasTextBaseline[] = ['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'];
        dV.ctx.textAlign = optionsH[h];
        if (v != undefined) dV.ctx.textBaseline = optionsV[v];
    }
}

function setFont(): void {
    if (!!dV.ctx) {
        dV.ctx.font = `${dV.fontStyle} ${dV.fontWeight} ${dV.fontSize}px ${dV.fontFamily}`;
    }
}


export function fontStyle(style?: string): void | string {
    if (style) {
        dV.fontStyle = style;
        if (!!dV.ctx) {
            setFont();
        }
    } else {
        return dV.fontStyle;
    }
}

export function fontWeight(weight?: string): void | string {
    if (weight) {
        dV.fontWeight = weight;
        if (!!dV.ctx) {
            setFont();
        }
    } else {
        return dV.fontWeight;
    }
}

export function fontFamily(family?: string): void | string {
    if (family) {
        dV.fontFamily = family;
        if (!!dV.ctx) {
            setFont();
        }
    } else {
        return dV.fontFamily;
    }
}

export function lineHeight(height?: number): void | number {
    if (height != undefined) {
        dV.lineHeight = height;
    } else {
        return dV.lineHeight;
    }
}

export function textOnArc(text: string, x: number, y: number, r: number, startAngle: number,
    align: TextAlign = TextAlign.center, outside: boolean = true,
    inward: boolean = true, kerning: number = 0): number {
    if (!!dV.ctx) {
        let clockwise = (align === TextAlign.left) ? 1 : -1; // draw clockwise if right. Else counterclockwise
        if (!outside) r -= dV.fontSize;
        if (((align === TextAlign.center || align === TextAlign.right) && inward) ||
            (align === TextAlign.left && !inward)) text = text.split('').reverse().join('');
        save();
        dV.ctx.translate(x, y);
        let _startAngle = startAngle;
        startAngle += HALF_PI;
        if (!inward) startAngle += PI;
        dV.ctx.textBaseline = 'middle';
        dV.ctx.textAlign = 'center';
        if (align === TextAlign.center) {
            for (let i = 0; i < text.length; i++) {
                let charWidth = dV.ctx.measureText(text[i]).width;
                startAngle += ((charWidth + (i === text.length - 1 ? 0 : kerning)) /
                    (r - dV.fontSize)) / 2 * -clockwise;
            }
        }
        let tempAngle = 0;
        dV.ctx.rotate(startAngle);
        for (let i = 0; i < text.length; i++) {
            let charWidth = dV.ctx.measureText(text[i]).width;
            dV.ctx.rotate((charWidth / 2) / (r - dV.fontSize) * clockwise);
            dV.ctx.fillText(text[i], 0, (inward ? 1 : -1) * (0 - r + dV.fontSize / 2));

            dV.ctx.rotate((charWidth / 2 + kerning) / (r - dV.fontSize) * clockwise);
            tempAngle += ((charWidth / 2) / (r - dV.fontSize) * clockwise) +
                ((charWidth / 2 + kerning) / (r - dV.fontSize) * clockwise);
        }
        restore();
        return _startAngle + tempAngle;
    } else {
        return 0;
    }
}

export function number2str(x: number, radix: number = 10): string {
    return x.toString(radix);
}

export function thousandSep(x: number, sep: string): string {
    let s: string = number2str(x);
    let st: string[] = s.split('.');
    let st1 = st[0];
    let st2 = st.length > 1 ? '.' + st[1] : '';
    let rgx: RegExp = /(\d+)(\d{3})/;
    while (rgx.test(st1)) {
        st1 = st1.replace(rgx, '$1' + sep + '$2');
    }
    return st1 + st2;
}

//---------------------------------------------------//
/* MATH */
//---------------------------------------------------//
export const E = Math.E,
    PI = Math.PI,
    TWO_PI = Math.PI * 2,
    HALF_PI = Math.PI / 2,
    PHI = (1 + Math.sqrt(5)) / 2;

export let sin = Math.sin,
    cos = Math.cos,
    tan = Math.tan,
    asin = Math.asin,
    acos = Math.acos,
    atan = Math.atan,
    atan2 = Math.atan2;

export function dist(x1: number, y1: number, x2: number, y2: number): number {
    return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
}

/* Conversion */

export function deg2rad(v: number): number {
    return v * PI / 180;
}

export function int(s: string, radix: number = 10): number {
    return parseInt(s, radix);
}

export let str: StringConstructor = String;

export function mm2px(v: number): number {
    return round(dV.dpi * v / 25.4);
}

export function px2mm(v: number): number {
    return round(v * 25.4 / dV.dpi * 10) / 10;
}

export function hexStr(v: number): string {
    if (constrain(v, 0, 255).toString(16).length == 1) {
        return 0 + constrain(v, 0, 255).toString(16);
    } else {
        return constrain(v, 0, 255).toString(16);
    }
}

/* Functions */
export function round(x: number, decimal?: number): number { // round
    if (decimal) {
        let n = 1;
        for (let i = 0; i < decimal; i++) {
            n *= 10;
        }
        return Math.round(x * n) / n
    } else {
        return Math.round(x);
    }
}

export function round2str(x: number, decimal: number): string {
    let s = number2str(round(x, decimal));
    let ss: string[] = s.split('.');
    let missing0: number = 0;
    if (ss.length === 2) {
        missing0 = decimal - ss[1].length;
    } else {
        s += '.';
        missing0 = decimal;
    }
    for (let i = 0; i < missing0; i++) {
        s += '0';
    }
    return s;
}

export let floor: (x: number) => number = Math.floor;
export let ceil: (x: number) => number = Math.ceil;

export function constrain(v: number, l1: number, l2: number): number {
    if (v < Math.min(l1, l2)) {
        return Math.min(l1, l2);
    } else if (v > Math.max(l1, l2)) {
        return Math.max(l1, l2);
    } else {
        return v;
    }
}

export function sq(v: number): number {
    return Math.pow(v, 2);
}

export let pow: (x: number, y: number) => number = Math.pow;
export let sqrt: (x: number) => number = Math.sqrt;
export let abs: (x: number) => number = Math.abs;

export function max(numbers: number[]): number {
    return Math.max(...numbers);
}

export function min(numbers: number[]): number {
    return Math.min(...numbers);
}

export function sum(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b);
}

export function avg(numbers: number[]): number {
    return sum(numbers) / numbers.length;
}

export function centile(data: number[], c: number): number {
    let dataCopy = data.concat();
    dataCopy.sort(function (a, b) {
        return a - b
    });
    let pos = (dataCopy.length + 1) * c / 100;
    let ix = floor(pos);
    if (ix === 0) {
        return dataCopy[ix];
    } else if (ix > dataCopy.length - 1) {
        return dataCopy[dataCopy.length - 1]
    } else {
        let rem = pos - ix;
        let diff = dataCopy[ix] - dataCopy[ix - 1];
        return dataCopy[ix - 1] + diff * rem;
    }
}

export function revCentile(data: number[], n: number): number {
    let dataCopy = data.concat();
    dataCopy.sort(function (a, b) {
        return a - b
    });
    let pos1: number = 1;
    let pos2: number = dataCopy.length;
    for (let i = 0; i < dataCopy.length; i++) {
        if (dataCopy[i] < n) {
            pos1++;
        } else if (dataCopy[i] > n) {
            pos2 = i;
            break;
        }
    }
    return floor(avg([pos1, pos2])) / dataCopy.length * 100;
}

export function iqr(data: number[]): number {
    return centile(data, 75) - centile(data, 25);
}

export function dataRange(data: number[]): number {
    return max(data) - min(data);
}

enum SDevMethod {
    sample,
    population
}

export function stdDev(data: number[], method: SDevMethod = SDevMethod.sample): number {
    let avgX = avg(data);
    let s = 0;
    for (let i = 0; i < data.length; i++) {
        s += pow(data[i] - avgX, 2);
    }
    let divider = data.length - 1;
    if (method === SDevMethod.population) {
        divider = data.length;
    }
    return sqrt(s / divider);
}

export class Vector {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public set(x: number, y: number) {
        this._x = x;
        this._y = y;
    }


    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public set x(v: number) {
        this._x = v;
    }

    public set y(v: number) {
        this._y = v;
    }

    public copy(): Vector {
        return new Vector(this._x, this._y);
    }

    public add(v: Vector): Vector {
        return new Vector(this._x + v.x, this._y + v.y);
    }

    public addInPlace(v: Vector): void {
        this._x += v.x;
        this._y += v.y;
    }

    public sub(v: Vector): Vector {
        return new Vector(this._x - v.x, this._y - v.y);
    }

    public subInPlace(v: Vector): void {
        this._x -= v.x;
        this._y -= v.y;
    }

    public mult(s: number): Vector {
        return new Vector(this._x * s, this._y * s);
    }

    public multInPlace(s: number): void {
        this._x *= s;
        this._y *= s;
    }

    public div(s: number): Vector {
        return new Vector(this._x / s, this._y / s);
    }

    public divInPlace(s: number): void {
        this._x /= s;
        this._y /= s;
    }

    public dot(v: Vector): number { // dot product of two vectors
        return this._x * v.x + this._y * v.y;
    }

    public norm(): Vector {
        let e1 = this._x / (Math.sqrt(this._x * this._x + this.y * this.y));
        let e2 = this._y / (Math.sqrt(this._x * this._x + this._y * this._y));
        return new Vector(e1, e2);
    }

    public normInPlace(): void {
        let e1 = this._x / (Math.sqrt(this._x * this._x + this._y * this._y));
        let e2 = this._y / (Math.sqrt(this._x * this._x + this._y * this._y));
        this._x = e1;
        this._y = e2;
    }

    get direction(): number {
        return Math.atan2(this._y, this._x);
    }

    set direction(angle: number) {
        let magnitude = this.magnitude;
        this._x = Math.cos(angle) * magnitude;
        this._y = Math.sin(angle) * magnitude;
    }

    get magnitude(): number {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    set magnitude(magnitude: number) {
        let direction = this.direction;
        this._x = Math.cos(direction) * magnitude;
        this._y = Math.sin(direction) * magnitude;
    }

    public limit(limitScalar: number) {
        if (this.magnitude > limitScalar) {
            let direction = this.direction;
            this._x = Math.cos(direction) * limitScalar;
            this._y = Math.sin(direction) * limitScalar;
        }
    }
}

/* Numbers */
export class Noise {
    private _min: number;
    private _max: number;
    private _range: number;
    private _value: number;
    constructor(min: number, max: number, noiseRange: number) {
        this._min = min;
        this._max = max;
        this._range = noiseRange * (max - min);
        this._value = Math.random() * (max - min) + min;
    }
    set min(value: number) {
        if (this._value < value) {
            this._value = value;
        }
        this._min = value;
    }
    set max(value: number) {
        if (this._value > value) {
            this._value = value;
        }
        this._max = value;
    }
    set noiseRange(value: number) {
        if (value > 0 && value < 1) {
            this._range = value * (this._max - this._min);
        }
    }
    get value(): number {
        this.nextValue();
        return this._value;
    }
    set value(value: number) {
        if (value >= this._min && value <= this._max) {
            this._value = value;
        }
    }
    get intValue(): number {
        this.nextValue();
        return round(this._value);
    }
    private nextValue(): void {
        let min0, max0;
        min0 = this._value - this._range / 2;
        max0 = this._value + this._range / 2;
        if (min0 < this._min) {
            min0 = this._min;
            max0 = min0 + this._range;
        } else if (max0 > this._max) {
            max0 = this._max;
            min0 = max0 - this._range;
        }
        this._value = Math.random() * (max0 - min0) + min0;
    }
}

export function randomInt(a: number, b: number): number {
    return Math.floor(Math.random() * (Math.max(a, b) - Math.min(a, b) + 1)) + Math.min(a, b);
}

export function choose(items: any[]): any {
    return items[randomInt(0, items.length - 1)];
}

export function random(...args: number[]): number {
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
        let e1 = Math.max(args[0], args[1]) - Math.min(args[0], args[1]);
        let e2 = Math.min(args[0], args[1]);
        return Math.random() * e1 + e2;
    } else {
        return Math.random();
    }
}

export function shuffle(items: any[]): void {
    let j, x;
    for (let i = items.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = items[i];
        items[i] = items[j];
        items[j] = x;
    }
}

export function unique(items: any[]): any[] {
    return items.filter((value, index, self) => {
        return self.indexOf(value) === index;
    }).sort();
}

export function fibonacci(n: number): number[] {
    let result = [1, 1];
    if (n < 1) {
        return [];
    } else if (n === 1) {
        return [1];
    } else if (n === 2) {
        return [1, 1];
    } else {
        for (let i = 0; i < n - 2; i++) {
            result.push(result[i] + result[i + 1]);
        }
        return result
    }
}

/* Scales */
export function linearScale(dataMin: number, dataMax: number, resultMin: number,
    resultMax: number): (x: number) => number {
    return (v: number) => {
        let domain: number;
        if (dataMin != dataMax) {
            domain = (v - dataMin) / (dataMax - dataMin);
        } else {
            domain = 0.5;
        }
        let range = resultMax - resultMin;
        return domain * range + resultMin;
    }
}

export function ordinalScale(d: any[], padding: number, resultMin: number,
    resultMax: number): (x: number) => number {
    let result: number[] = [];
    let scale: any;
    if (d.length > 1) {
        scale = linearScale(0, d.length - 1, resultMin + padding, resultMax - padding);
    } else {
        scale = () => {
            return (resultMax - resultMin) / 2;
        };
    }
    for (let i = 0; i < d.length; i++) {
        result.push(round(scale(i)));
    }
    return (idx: number) => {
        let values = result;
        if (idx >= values.length) {
            return values[values.length - 1];
        } else {
            return values[idx];
        }
    }
}

//---------------------------------------------------//
/* Control */
//---------------------------------------------------//

export let prnt = Function.prototype.bind.call(console.log, console, 'dvlib >> ');

export function svg2img(svg: string): HTMLImageElement {
    let img = new Image();
    let blob = new Blob([svg], {type: 'image/svg+xml'});
    img.src = URL.createObjectURL(blob);
    return img;
}

// Preloader
class Preloader {
    public assets: any;
    public onProgress: () => void;
    public onComplete: () => void;
    public loadingProgress: number;
    public loadAssets: any;

    constructor() {
        this.assets = {};

        this.onProgress = () => { };
        this.onComplete = () => { };

        this.loadingProgress = 0;
    }

    on(eventName: string, callbackFunction: () => void) {
        switch (eventName) {
            case 'progress':
                this.onProgress = callbackFunction;
                break;
            case 'complete':
                this.onComplete = callbackFunction;
                break;
        }
    }

    load(assets: any[]) {
        let total: number = assets.length;

        let loaded: number = 0;

        let onFinishedLoading = () => {
            loaded++;

            this.loadingProgress = loaded / total;
            if (loaded == total) {
                this.onComplete();
            }
        };
        this.loadingProgress = 0;
        for (let count = 0; count < total; count++) {

            let id = assets[count].id;
            let src = assets[count].src;

            let type = src.split('.').pop();

            switch (type) {
                case 'svg':
                case 'png':
                case 'jpg':
                case 'jpeg':
                    this.loadImg(id, src, onFinishedLoading);
                    break;

                // JSON files.
                case 'json':
                    this.loadJson(id, src, onFinishedLoading);
                    break;

                // Default case for unsuported file types.
                default:
                    onFinishedLoading();
                    break;
            }
        }
    }

    loadJson(id: string, src: string, callback: () => void) {

        this.request(src, 'json', (response) => {

            this.assets[id] = response;

            callback();
        });
    }

    loadImg(id: string, src: string, callback: () => void) {

        this.request(src, 'blob', (response) => {

            let img = new Image();

            img.src = URL.createObjectURL(response);

            this.assets[id] = img;

            img.onload = callback;
        });
    }

    request(src: string, type: XMLHttpRequestResponseType, callback: (response: any) => void) {

        let xhrObj = new XMLHttpRequest();

        xhrObj.onload = () => {
            callback(xhrObj.response);
        };

        xhrObj.open('get', src, true);
        xhrObj.responseType = type;
        xhrObj.send();
    }

    getResult(id: string) {
        if (typeof this.assets[id] !== 'undefined') {
            return this.assets[id];
        } else {
            return null;
        }
    }
}

let preloader: Preloader = new Preloader();

export function addAsset(asset: AssetsItem): void {
    assetList.push(asset);
}
