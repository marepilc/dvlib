"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dvStart(setup, draw, events, loadAssets) {
    if (loadAssets != undefined)
        loadAssets();
    if (assetList.length > 0) {
        preloader.on('complete', onCompletePreloader);
        preloader.load(assetList);
    }
    else {
        dVrun(setup, draw, events);
    }
    function onCompletePreloader() {
        for (var _i = 0, assetList_1 = assetList; _i < assetList_1.length; _i++) {
            var a = assetList_1[_i];
            exports.assets[a.id] = preloader.getResult(a.id);
        }
        dVrun(setup, draw, events);
    }
}
exports.dvStart = dvStart;
function dVrun(setup, draw, events) {
    if (setup != undefined)
        setup();
    initMouse();
    if (events != undefined)
        events();
    if (exports.dV.noLoop) {
        sAttr();
        if (draw != undefined)
            draw();
        rAttr();
    }
    else {
        if (exports.animation == undefined) {
            exports.animation = new AnimationCtrl(function () {
                sAttr();
                if (draw != undefined)
                    draw();
                rAttr();
            });
            exports.animation.start();
        }
    }
}
function initMouse() {
    if (exports.mouse == undefined) {
        exports.mouse = new Mouse(exports.dV.canvas);
    }
}
exports.initMouse = initMouse;
function createCanvas(target) {
    exports.dV = new DV(document.createElement('canvas'));
    target.appendChild(exports.dV.canvas);
    setContextDefault();
}
exports.createCanvas = createCanvas;
function selectCanvas(id) {
    var cnv = document.getElementById(id);
    exports.dV = new DV(cnv);
    setContextDefault();
}
exports.selectCanvas = selectCanvas;
function resizeCanvas(w, h, canvas) {
    if (canvas === void 0) { canvas = exports.dV.canvas; }
    canvas.setAttribute('width', exports.str(w));
    canvas.setAttribute('height', exports.str(h));
    setContextDefault();
}
exports.resizeCanvas = resizeCanvas;
var assetList = [];
var Mouse = (function () {
    function Mouse(canvas) {
        var _this = this;
        this._canvas = canvas;
        this._x = 0;
        this._y = 0;
        this._px = 0;
        this._py = 0;
        this.isPressed = false;
        this.mouseWheel = function (e) { };
        this.mouseDown = function () { };
        this.mouseUp = function () { };
        this.mouseClick = function () { };
        this.mouseDblClick = function () { };
        this._canvas.addEventListener('mousemove', function (e) {
            _this._updateMousePos(canvas, e);
        });
        this._canvas.addEventListener('wheel', function (e) {
            _this._updateMousePos(canvas, e);
            _this.mouseWheel(e);
        });
        this._canvas.addEventListener('mousedown', function () {
            _this.isPressed = true;
            _this.mouseDown();
        });
        this._canvas.addEventListener('mouseup', function () {
            _this.isPressed = false;
            _this.mouseUp();
        });
        this._canvas.addEventListener('click', function () {
            _this.mouseClick();
        });
        this._canvas.addEventListener('dblclick', function () {
            _this.mouseDblClick();
        });
    }
    Mouse.prototype._updateMousePos = function (canvas, e) {
        this._px = this._x;
        this._py = this._y;
        var bbox = canvas.getBoundingClientRect();
        this._x = exports.abs(round((e.clientX - bbox.left) * (exports.width / bbox.width)));
        this._y = exports.abs(round((e.clientY - bbox.bottom) * (exports.height / bbox.height)));
    };
    Object.defineProperty(Mouse.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mouse.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mouse.prototype, "px", {
        get: function () {
            return this._px;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mouse.prototype, "py", {
        get: function () {
            return this._py;
        },
        enumerable: true,
        configurable: true
    });
    return Mouse;
}());
var DV = (function () {
    function DV(canvas, _noLoop) {
        if (_noLoop === void 0) { _noLoop = false; }
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.dpi = 300;
        this.noLoop = _noLoop;
        this.withFill = true;
        this.withStroke = true;
        this.currentFill = '#437aa9';
        this.currentStroke = '#02020e';
        this.fontStyle = 'normal';
        this.fontWeight = 'normal';
        this.fontSize = 24;
        this.fontFamily = 'sans-serif';
        this.lineHeight = 1.1;
        this.animation = null;
    }
    DV.prototype.commitShape = function () {
        if (this.withFill && !!this.ctx)
            this.ctx.fill();
        if (this.withStroke && !!this.ctx)
            this.ctx.stroke();
    };
    return DV;
}());
;
var Cursor;
(function (Cursor) {
    Cursor[Cursor["default"] = 0] = "default";
    Cursor[Cursor["auto"] = 1] = "auto";
    Cursor[Cursor["crosshair"] = 2] = "crosshair";
    Cursor[Cursor["pointer"] = 3] = "pointer";
    Cursor[Cursor["move"] = 4] = "move";
    Cursor[Cursor["eresize"] = 5] = "eresize";
    Cursor[Cursor["neresize"] = 6] = "neresize";
    Cursor[Cursor["nwresize"] = 7] = "nwresize";
    Cursor[Cursor["nresize"] = 8] = "nresize";
    Cursor[Cursor["seresize"] = 9] = "seresize";
    Cursor[Cursor["swresize"] = 10] = "swresize";
    Cursor[Cursor["sresize"] = 11] = "sresize";
    Cursor[Cursor["wresize"] = 12] = "wresize";
    Cursor[Cursor["text"] = 13] = "text";
    Cursor[Cursor["wait"] = 14] = "wait";
    Cursor[Cursor["help"] = 15] = "help";
    Cursor[Cursor["progress"] = 16] = "progress";
    Cursor[Cursor["copy"] = 17] = "copy";
    Cursor[Cursor["alias"] = 18] = "alias";
    Cursor[Cursor["ctxmenu"] = 19] = "ctxmenu";
    Cursor[Cursor["cell"] = 20] = "cell";
    Cursor[Cursor["notallowed"] = 21] = "notallowed";
    Cursor[Cursor["colresize"] = 22] = "colresize";
    Cursor[Cursor["rowresize"] = 23] = "rowresize";
    Cursor[Cursor["nodrop"] = 24] = "nodrop";
    Cursor[Cursor["verticaltext"] = 25] = "verticaltext";
    Cursor[Cursor["allscroll"] = 26] = "allscroll";
    Cursor[Cursor["neswresize"] = 27] = "neswresize";
    Cursor[Cursor["nwseresize"] = 28] = "nwseresize";
    Cursor[Cursor["nsresize"] = 29] = "nsresize";
    Cursor[Cursor["ewresize"] = 30] = "ewresize";
    Cursor[Cursor["none"] = 31] = "none";
})(Cursor = exports.Cursor || (exports.Cursor = {}));
function cursor(cursorType) {
    var types = ['default', 'auto', 'crosshair', 'pointer', 'move',
        'e-resize', 'ne-resize', 'nw-resize', 'n-resize', 'se-resize',
        'sw-resize', 's-resize', 'w-resize', 'text', 'wait', 'help', 'progress',
        'copy', 'alias', 'context-menu', 'cell', 'not-allowed', 'col-resize',
        'row-resize', 'no-drop', 'vertical-text', 'all-scroll', 'nesw-resize',
        'nwse-resize', 'ns-resize', 'ew-resize', 'none'];
    if (!!exports.dV.canvas)
        exports.dV.canvas.style.cursor = types[cursorType];
}
exports.cursor = cursor;
function setContextDefault() {
    if (!!exports.dV.canvas) {
        exports.dV.ctx = exports.dV.canvas.getContext('2d');
        exports.height = exports.dV.canvas.height;
        exports.width = exports.dV.canvas.width;
        if (!!exports.dV.ctx) {
            exports.dV.ctx.fillStyle = exports.dV.currentFill;
            exports.dV.ctx.strokeStyle = exports.dV.currentStroke;
            setFont();
            exports.dV.ctx.translate(0, exports.height);
            exports.dV.ctx.scale(1, -1);
        }
    }
}
exports.setContextDefault = setContextDefault;
function translate(x, y) {
    if (!!exports.dV.ctx)
        exports.dV.ctx.translate(x, y);
}
exports.translate = translate;
function rotate(angle) {
    if (!!exports.dV.ctx)
        exports.dV.ctx.rotate(angle);
}
exports.rotate = rotate;
function scale(x, y) {
    if (!!exports.dV.ctx)
        exports.dV.ctx.scale(x, y);
}
exports.scale = scale;
function sAttr() {
    if (!!exports.dV.ctx)
        exports.dV.ctx.save();
}
exports.sAttr = sAttr;
function rAttr() {
    if (!!exports.dV.ctx)
        exports.dV.ctx.restore();
}
exports.rAttr = rAttr;
function staticDrawing() {
    exports.dV.noLoop = true;
}
exports.staticDrawing = staticDrawing;
function clear() {
    if (!!exports.dV.ctx)
        exports.dV.ctx.clearRect(0, 0, exports.width, exports.height);
}
exports.clear = clear;
function background(col) {
    sAttr();
    var c = (col.indexOf('#') === 0) ? col : '#' + col;
    var rgx = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    if (rgx.test(c)) {
        if (!!exports.dV.ctx)
            exports.dV.ctx.fillStyle = col;
    }
    if (!!exports.dV.ctx)
        exports.dV.ctx.fillRect(0, 0, exports.width, exports.height);
    rAttr();
}
exports.background = background;
function stroke(col, alpha) {
    if (alpha === void 0) { alpha = 1; }
    exports.dV.withStroke = true;
    var c = (col.indexOf('#') === 0) ? col : '#' + col;
    var rgx = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    if (rgx.test(c)) {
        var rgb = str2rgb(c);
        if (!!exports.dV.ctx)
            exports.dV.ctx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
        exports.dV.currentStroke = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
    }
}
exports.stroke = stroke;
function strokeWidth(size) {
    exports.dV.withStroke = true;
    if (!!exports.dV.ctx)
        exports.dV.ctx.lineWidth = size;
}
exports.strokeWidth = strokeWidth;
function noStroke() {
    exports.dV.withStroke = false;
}
exports.noStroke = noStroke;
var StrokeCupStyle;
(function (StrokeCupStyle) {
    StrokeCupStyle[StrokeCupStyle["butt"] = 0] = "butt";
    StrokeCupStyle[StrokeCupStyle["round"] = 1] = "round";
    StrokeCupStyle[StrokeCupStyle["square"] = 2] = "square";
})(StrokeCupStyle = exports.StrokeCupStyle || (exports.StrokeCupStyle = {}));
function strokeCup(style) {
    var types = ['butt', 'round', 'square'];
    if (!!exports.dV.ctx)
        exports.dV.ctx.lineCap = types[style];
}
exports.strokeCup = strokeCup;
var JoinStyle;
(function (JoinStyle) {
    JoinStyle[JoinStyle["bevel"] = 0] = "bevel";
    JoinStyle[JoinStyle["round"] = 1] = "round";
    JoinStyle[JoinStyle["miter"] = 2] = "miter";
})(JoinStyle = exports.JoinStyle || (exports.JoinStyle = {}));
function strokeJoin(style, miterValue) {
    if (miterValue === void 0) { miterValue = 10; }
    var types = ['bevel', 'round', 'miter'];
    if (style === JoinStyle.miter) {
        if (!!exports.dV.ctx)
            exports.dV.ctx.miterLimit = miterValue;
    }
    if (!!exports.dV.ctx)
        exports.dV.ctx.lineJoin = types[style];
}
exports.strokeJoin = strokeJoin;
function dashLine(line, space, offset) {
    if (offset === void 0) { offset = 0; }
    if (!!exports.dV.ctx) {
        exports.dV.ctx.setLineDash([line, space]);
        exports.dV.ctx.lineDashOffset = offset;
    }
}
exports.dashLine = dashLine;
function solidLine() {
    if (!!exports.dV.ctx)
        exports.dV.ctx.setLineDash([]);
}
exports.solidLine = solidLine;
function fill(col, alpha) {
    if (alpha === void 0) { alpha = 1; }
    exports.dV.withFill = true;
    var c = (col.indexOf('#') === 0) ? col : '#' + col;
    var rgx = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    if (rgx.test(c)) {
        var rgb = str2rgb(c);
        if (!!exports.dV.ctx)
            exports.dV.ctx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
        exports.dV.currentFill = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
    }
}
exports.fill = fill;
function noFill() {
    exports.dV.withFill = false;
}
exports.noFill = noFill;
function point(x, y) {
    if (!!exports.dV.ctx)
        exports.dV.ctx.fillRect(x, y, 1, 1);
}
exports.point = point;
function line(x1, y1, x2, y2) {
    if (!!exports.dV.ctx) {
        exports.dV.ctx.beginPath();
        exports.dV.ctx.moveTo(x1, y1);
        exports.dV.ctx.lineTo(x2, y2);
        exports.dV.ctx.stroke();
    }
}
exports.line = line;
function arc(x, y, r, angle1, angle2) {
    if (!!exports.dV.ctx) {
        exports.dV.ctx.beginPath();
        exports.dV.ctx.arc(x, y, r, angle1, angle2);
        exports.dV.commitShape();
    }
}
exports.arc = arc;
function circle(x, y, r) {
    if (!!exports.dV.ctx) {
        exports.dV.ctx.beginPath();
        exports.dV.ctx.arc(x, y, r, 0, exports.PI * 2);
        exports.dV.commitShape();
    }
}
exports.circle = circle;
function ellipse(x, y, r1, r2, angle) {
    if (angle === void 0) { angle = 0; }
    if (!!exports.dV.ctx) {
        exports.dV.ctx.beginPath();
        for (var i = 0; i < exports.TWO_PI; i += 0.01) {
            var xPos = x - (r2 * exports.sin(i)) * exports.sin(angle * exports.PI) + (r1 * exports.cos(i)) * exports.cos(angle * exports.PI);
            var yPos = y + (r1 * exports.cos(i)) * exports.sin(angle * exports.PI) + (r2 * exports.sin(i)) * exports.cos(angle * exports.PI);
            if (i === 0) {
                exports.dV.ctx.moveTo(xPos, yPos);
            }
            else {
                exports.dV.ctx.lineTo(xPos, yPos);
            }
        }
        exports.dV.commitShape();
    }
}
exports.ellipse = ellipse;
function ring(x, y, r1, r2, angle1, angle2) {
    if (angle1 === void 0) { angle1 = 0; }
    if (angle2 === void 0) { angle2 = exports.TWO_PI; }
    if (!!exports.dV.ctx) {
        var ro = Math.max(r1, r2);
        var ri = Math.min(r1, r2);
        if (angle1 === 0 && angle2 === exports.TWO_PI) {
            exports.dV.ctx.beginPath();
            exports.dV.ctx.arc(x, y, ro, angle1, angle2);
            exports.dV.ctx.arc(x, y, ri, angle2, angle1, true);
            if (exports.dV.withFill)
                exports.dV.ctx.fill();
            if (exports.dV.withStroke) {
                exports.dV.ctx.beginPath();
                exports.dV.ctx.arc(x, y, ro, angle1, angle2);
                exports.dV.ctx.stroke();
                exports.dV.ctx.beginPath();
                exports.dV.ctx.arc(x, y, ri, angle1, angle2);
                exports.dV.ctx.stroke();
            }
        }
        else {
            exports.dV.ctx.beginPath();
            exports.dV.ctx.arc(x, y, ro, angle1, angle2);
            exports.dV.ctx.arc(x, y, ri, angle2, angle1, true);
            exports.dV.ctx.closePath();
            exports.dV.commitShape();
        }
    }
}
exports.ring = ring;
function rect(x, y, w, h, r) {
    if (r === void 0) { r = 0; }
    if (!!exports.dV.ctx) {
        exports.dV.ctx.beginPath();
        exports.dV.ctx.moveTo(x + r, y);
        exports.dV.ctx.lineTo(x + w - r, y);
        exports.dV.ctx.arcTo(x + w, y, x + w, y + r, r);
        exports.dV.ctx.lineTo(x + w, y + h - r);
        exports.dV.ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        exports.dV.ctx.lineTo(x + r, y + h);
        exports.dV.ctx.arcTo(x, y + h, x, y + h - r, r);
        exports.dV.ctx.lineTo(x, y + r);
        exports.dV.ctx.arcTo(x, y, x + r, y, r);
        exports.dV.commitShape();
    }
}
exports.rect = rect;
function star(x, y, r1, r2, n) {
    if (n === void 0) { n = 5; }
    if (!!exports.dV.ctx) {
        var angle = exports.TWO_PI / n;
        var halfAngle = angle / 2;
        exports.dV.ctx.beginPath();
        for (var a = 0; a < exports.TWO_PI; a += angle) {
            var sx = x + exports.cos(a) * r2;
            var sy = y + exports.sin(a) * r2;
            exports.dV.ctx.lineTo(sx, sy);
            sx = x + exports.cos(a + halfAngle) * r1;
            sy = y + exports.sin(a + halfAngle) * r1;
            exports.dV.ctx.lineTo(sx, sy);
        }
        exports.dV.ctx.closePath();
        exports.dV.commitShape();
    }
}
exports.star = star;
function polygon(x, y, r, n) {
    if (n === void 0) { n = 5; }
    if (!!exports.dV.ctx) {
        var angle = exports.TWO_PI / n;
        exports.dV.ctx.beginPath();
        for (var a = 0; a < exports.TWO_PI; a += angle) {
            var sx = x + exports.cos(a) * r;
            var sy = y + exports.sin(a) * r;
            exports.dV.ctx.lineTo(sx, sy);
        }
        exports.dV.ctx.closePath();
        exports.dV.commitShape();
    }
}
exports.polygon = polygon;
function spline(pts, tension, closed) {
    if (tension === void 0) { tension = 0.5; }
    if (closed === void 0) { closed = false; }
    if (!!exports.dV.ctx) {
        sAttr();
        var cp = [];
        var n = pts.length;
        if (closed) {
            pts.push(pts[0], pts[1], pts[2], pts[3]);
            pts.unshift(pts[n - 1]);
            pts.unshift(pts[n - 1]);
            for (var i = 0; i < n; i += 2) {
                cp = cp.concat(getControlPoints(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], pts[i + 4], pts[i + 5], tension));
            }
            cp = cp.concat(cp[0], cp[1]);
            for (var i = 2; i < n + 2; i += 2) {
                exports.dV.ctx.beginPath();
                exports.dV.ctx.moveTo(pts[i], pts[i + 1]);
                exports.dV.ctx.bezierCurveTo(cp[2 * i - 2], cp[2 * i - 1], cp[2 * i], cp[2 * i + 1], pts[i + 2], pts[i + 3]);
                exports.dV.ctx.stroke();
                exports.dV.ctx.closePath();
            }
        }
        else {
            for (var i = 0; i < n - 4; i += 2) {
                cp = cp.concat(getControlPoints(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], pts[i + 4], pts[i + 5], tension));
            }
            for (var i = 2; i < pts.length - 5; i += 2) {
                exports.dV.ctx.beginPath();
                exports.dV.ctx.moveTo(pts[i], pts[i + 1]);
                exports.dV.ctx.bezierCurveTo(cp[2 * i - 2], cp[2 * i - 1], cp[2 * i], cp[2 * i + 1], pts[i + 2], pts[i + 3]);
                exports.dV.ctx.stroke();
                exports.dV.ctx.closePath();
            }
            exports.dV.ctx.beginPath();
            exports.dV.ctx.moveTo(pts[0], pts[1]);
            exports.dV.ctx.quadraticCurveTo(cp[0], cp[1], pts[2], pts[3]);
            exports.dV.ctx.stroke();
            exports.dV.ctx.closePath();
            exports.dV.ctx.beginPath();
            exports.dV.ctx.moveTo(pts[n - 2], pts[n - 1]);
            exports.dV.ctx.quadraticCurveTo(cp[2 * n - 10], cp[2 * n - 9], pts[n - 4], pts[n - 3]);
            exports.dV.ctx.stroke();
            exports.dV.ctx.closePath();
        }
        rAttr();
    }
}
exports.spline = spline;
function getControlPoints(x0, y0, x1, y1, x2, y2, tension) {
    var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    var d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    var fa = tension * d01 / (d01 + d12);
    var fb = tension - fa;
    var p1x = x1 + fa * (x0 - x2);
    var p1y = y1 + fa * (y0 - y2);
    var p2x = x1 - fb * (x0 - x2);
    var p2y = y1 - fb * (y0 - y2);
    return [p1x, p1y, p2x, p2y];
}
function bezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2) {
    if (!!exports.dV.ctx) {
        exports.dV.ctx.beginPath();
        exports.dV.ctx.moveTo(x1, y1);
        exports.dV.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
        exports.dV.ctx.stroke();
    }
}
exports.bezier = bezier;
function beginShape(x, y) {
    if (!!exports.dV.ctx) {
        exports.dV.ctx.beginPath();
        exports.dV.ctx.moveTo(x, y);
    }
}
exports.beginShape = beginShape;
function endShape() {
    exports.dV.commitShape();
}
exports.endShape = endShape;
function closeShape() {
    if (!!exports.dV.ctx) {
        exports.dV.ctx.closePath();
        exports.dV.commitShape();
    }
}
exports.closeShape = closeShape;
function moveTo(x, y) {
    if (!!exports.dV.ctx)
        exports.dV.ctx.moveTo(x, y);
}
exports.moveTo = moveTo;
function lineTo(x, y) {
    if (!!exports.dV.ctx)
        exports.dV.ctx.lineTo(x, y);
}
exports.lineTo = lineTo;
function bezierTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    if (!!exports.dV.ctx)
        exports.dV.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
}
exports.bezierTo = bezierTo;
function quadraticTo(cpx, cpy, x, y) {
    if (!!exports.dV.ctx)
        exports.dV.ctx.quadraticCurveTo(cpx, cpy, x, y);
}
exports.quadraticTo = quadraticTo;
exports.coldGrayDark = '#2D2F2F';
exports.coldGrayMidDark = '#696D6D';
exports.coldGrayMidLight = '#B0B6B6';
exports.coldGrayLight = '#ECF4F4';
exports.warmGrayDark = '#434240';
exports.warmGrayMidDark = '#787672';
exports.warmGrayMidLight = '#B4B1AB';
exports.warmGrayLight = '#FAF6EE';
exports.greenDark = '#3B5750';
exports.greenLight = '#5B887C';
exports.redDark = '#743432';
exports.redLight = '#AA5957';
exports.blueDark = '#395465';
exports.blueLight = '#567F98';
function str2rgb(col) {
    var rgb = {
        r: 0,
        g: 0,
        b: 0
    };
    var rgx = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
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
function blend(color1, color2, proportion) {
    var c1 = (color1.indexOf('#') === 0) ? color1 : '#' + color1;
    var c2 = (color2.indexOf('#') === 0) ? color2 : '#' + color2;
    var rgx = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    if (rgx.test(c1) && rgx.test(c2)) {
        var col1 = (c1.length === 7) ? c1.slice(1) : c1;
        var col2 = (c2.length === 7) ? c2.slice(1) : c2;
        var r1 = int(col1.slice(0, 2), 16);
        var r2 = int(col2.slice(0, 2), 16);
        var r = round((1 - proportion) * r1 + proportion * r2);
        var g1 = int(col1.slice(2, 4), 16);
        var g2 = int(col2.slice(2, 4), 16);
        var g = round((1 - proportion) * g1 + proportion * g2);
        var b1 = int(col1.slice(4), 16);
        var b2 = int(col2.slice(4), 16);
        var b = round((1 - proportion) * b1 + proportion * b2);
        return '#' + r.toString(16) + g.toString(16) + b.toString(16);
    }
    else {
        return '#000000';
    }
}
exports.blend = blend;
function shadow(color, level, offsetX, offsetY) {
    if (offsetX === void 0) { offsetX = 0; }
    if (offsetY === void 0) { offsetY = 0; }
    if (!!exports.dV.ctx) {
        exports.dV.ctx.shadowColor = color;
        exports.dV.ctx.shadowBlur = level;
        exports.dV.ctx.shadowOffsetX = offsetX;
        exports.dV.ctx.shadowOffsetY = offsetY;
    }
}
exports.shadow = shadow;
var ImgOrigin;
(function (ImgOrigin) {
    ImgOrigin[ImgOrigin["bLeft"] = 0] = "bLeft";
    ImgOrigin[ImgOrigin["bRight"] = 1] = "bRight";
    ImgOrigin[ImgOrigin["bCenter"] = 2] = "bCenter";
    ImgOrigin[ImgOrigin["tLeft"] = 3] = "tLeft";
    ImgOrigin[ImgOrigin["tRight"] = 4] = "tRight";
    ImgOrigin[ImgOrigin["tCenter"] = 5] = "tCenter";
    ImgOrigin[ImgOrigin["mLeft"] = 6] = "mLeft";
    ImgOrigin[ImgOrigin["mRight"] = 7] = "mRight";
    ImgOrigin[ImgOrigin["mCenter"] = 8] = "mCenter";
})(ImgOrigin = exports.ImgOrigin || (exports.ImgOrigin = {}));
function placeImage(img, x, y, origin, w, h) {
    var _x = x;
    var _y = y;
    var _w;
    var _h;
    if (w) {
        _w = w;
    }
    else {
        _w = img.naturalWidth;
    }
    if (h) {
        _h = h;
    }
    else {
        _h = img.naturalHeight;
    }
    if (!!exports.dV.ctx) {
        sAttr();
        scale(1, -1);
        switch (origin) {
            case ImgOrigin.bLeft:
                exports.dV.ctx.drawImage(img, _x, -_y, _w, -_h);
                break;
            case ImgOrigin.bRight:
                exports.dV.ctx.drawImage(img, _x - _w, -_y, _w, -_h);
                break;
            case ImgOrigin.bCenter:
                exports.dV.ctx.drawImage(img, _x - _w / 2, -_y, _w, -_h);
                break;
            case ImgOrigin.tLeft:
                exports.dV.ctx.drawImage(img, _x, -_y + _h, _w, -_h);
                break;
            case ImgOrigin.tRight:
                exports.dV.ctx.drawImage(img, _x - _w, -_y + _h, _w, -_h);
                break;
            case ImgOrigin.tCenter:
                exports.dV.ctx.drawImage(img, _x - _w / 2, -_y + _h, _w, -_h);
                break;
            case ImgOrigin.mLeft:
                exports.dV.ctx.drawImage(img, _x, -_y + _h / 2, _w, -_h);
                break;
            case ImgOrigin.mRight:
                exports.dV.ctx.drawImage(img, _x - _w, -_y + _h / 2, _w, -_h);
                break;
            case ImgOrigin.mCenter:
                exports.dV.ctx.drawImage(img, _x - _w / 2, -_y + _h / 2, _w, -_h);
                break;
        }
        rAttr();
    }
}
exports.placeImage = placeImage;
exports.E = Math.E, exports.PI = Math.PI, exports.TWO_PI = Math.PI * 2, exports.HALF_PI = Math.PI / 2, exports.PHI = (1 + Math.sqrt(5)) / 2;
exports.sin = Math.sin, exports.cos = Math.cos, exports.tan = Math.tan, exports.asin = Math.asin, exports.acos = Math.acos, exports.atan = Math.atan, exports.atan2 = Math.atan2;
function deg2rad(v) {
    return v * exports.PI / 180;
}
exports.deg2rad = deg2rad;
var Vector = (function () {
    function Vector(x, y) {
        this._x = x;
        this._y = y;
    }
    Vector.prototype.set = function (x, y) {
        this._x = x;
        this._y = y;
    };
    Object.defineProperty(Vector.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (v) {
            this._x = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (v) {
            this._y = v;
        },
        enumerable: true,
        configurable: true
    });
    Vector.prototype.copy = function () {
        return new Vector(this._x, this._y);
    };
    Vector.prototype.add = function (v) {
        return new Vector(this._x + v.x, this._y + v.y);
    };
    Vector.prototype.addInPlace = function (v) {
        this._x += v.x;
        this._y += v.y;
    };
    Vector.prototype.sub = function (v) {
        return new Vector(this._x - v.x, this._y - v.y);
    };
    Vector.prototype.subInPlace = function (v) {
        this._x -= v.x;
        this._y -= v.y;
    };
    Vector.prototype.mult = function (s) {
        return new Vector(this._x * s, this._y * s);
    };
    Vector.prototype.multInPlace = function (s) {
        this._x *= s;
        this._y *= s;
    };
    Vector.prototype.div = function (s) {
        return new Vector(this._x / s, this._y / s);
    };
    Vector.prototype.divInPlace = function (s) {
        this._x /= s;
        this._y /= s;
    };
    Vector.prototype.dot = function (v) {
        return this._x * v.x + this._y * v.y;
    };
    Vector.prototype.norm = function () {
        var e1 = this._x / (Math.sqrt(this._x * this._x + this.y * this.y));
        var e2 = this._y / (Math.sqrt(this._x * this._x + this._y * this._y));
        return new Vector(e1, e2);
    };
    Vector.prototype.normInPlace = function () {
        var e1 = this._x / (Math.sqrt(this._x * this._x + this._y * this._y));
        var e2 = this._y / (Math.sqrt(this._x * this._x + this._y * this._y));
        this._x = e1;
        this._y = e2;
    };
    Object.defineProperty(Vector.prototype, "direction", {
        get: function () {
            return Math.atan2(this._y, this._x);
        },
        set: function (angle) {
            var magnitude = this.magnitude;
            this._x = Math.cos(angle) * magnitude;
            this._y = Math.sin(angle) * magnitude;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "magnitude", {
        get: function () {
            return Math.sqrt(this._x * this._x + this._y * this._y);
        },
        set: function (magnitude) {
            var direction = this.direction;
            this._x = Math.cos(direction) * magnitude;
            this._y = Math.sin(direction) * magnitude;
        },
        enumerable: true,
        configurable: true
    });
    Vector.prototype.limit = function (limitScalar) {
        if (this.magnitude > limitScalar) {
            var direction = this.direction;
            this._x = Math.cos(direction) * limitScalar;
            this._y = Math.sin(direction) * limitScalar;
        }
    };
    return Vector;
}());
exports.Vector = Vector;
function dist(x1, y1, x2, y2) {
    return exports.sqrt(exports.pow(x2 - x1, 2) + exports.pow(y2 - y1, 2));
}
exports.dist = dist;
function int(s, radix) {
    if (radix === void 0) { radix = 10; }
    return parseInt(s, radix);
}
exports.int = int;
exports.str = String;
function mm2px(v) {
    return round(exports.dV.dpi * v / 25.4);
}
exports.mm2px = mm2px;
function px2mm(v) {
    return round(v * 25.4 / exports.dV.dpi * 10) / 10;
}
exports.px2mm = px2mm;
function hexStr(v) {
    if (constrain(v, 0, 255).toString(16).length == 1) {
        return 0 + constrain(v, 0, 255).toString(16);
    }
    else {
        return constrain(v, 0, 255).toString(16);
    }
}
exports.hexStr = hexStr;
function round(x, decimal) {
    if (decimal) {
        var n = 1;
        for (var i = 0; i < decimal; i++) {
            n *= 10;
        }
        return Math.round(x * n) / n;
    }
    else {
        return Math.round(x);
    }
}
exports.round = round;
function roundStr(x, decimal) {
    var s = number2str(round(x, decimal));
    var ss = s.split('.');
    var missing0 = 0;
    if (ss.length === 2) {
        missing0 = decimal - ss[1].length;
    }
    else {
        s += '.';
        missing0 = decimal;
    }
    for (var i = 0; i < missing0; i++) {
        s += '0';
    }
    return s;
}
exports.roundStr = roundStr;
exports.floor = Math.floor;
exports.ceil = Math.ceil;
function constrain(v, l1, l2) {
    if (v < Math.min(l1, l2)) {
        return Math.min(l1, l2);
    }
    else if (v > Math.max(l1, l2)) {
        return Math.max(l1, l2);
    }
    else {
        return v;
    }
}
exports.constrain = constrain;
function sq(v) {
    return Math.pow(v, 2);
}
exports.sq = sq;
exports.pow = Math.pow;
exports.sqrt = Math.sqrt;
exports.abs = Math.abs;
function max(numbers) {
    return Math.max.apply(Math, numbers);
}
exports.max = max;
function min(numbers) {
    return Math.min.apply(Math, numbers);
}
exports.min = min;
function sum(numbers) {
    return numbers.reduce(function (a, b) { return a + b; });
}
exports.sum = sum;
function avg(numbers) {
    return sum(numbers) / numbers.length;
}
exports.avg = avg;
function centile(data, c) {
    var dataCopy = data.concat();
    dataCopy.sort(function (a, b) {
        return a - b;
    });
    var pos = (dataCopy.length + 1) * c / 100;
    var ix = exports.floor(pos);
    if (ix === 0) {
        return dataCopy[ix];
    }
    else if (ix > dataCopy.length - 1) {
        return dataCopy[dataCopy.length - 1];
    }
    else {
        var rem = pos - ix;
        var diff = dataCopy[ix] - dataCopy[ix - 1];
        return dataCopy[ix - 1] + diff * rem;
    }
}
exports.centile = centile;
function revCentile(data, n) {
    var dataCopy = data.concat();
    dataCopy.sort(function (a, b) {
        return a - b;
    });
    var pos1 = 1;
    var pos2 = dataCopy.length;
    for (var i = 0; i < dataCopy.length; i++) {
        if (dataCopy[i] < n) {
            pos1++;
        }
        else if (dataCopy[i] > n) {
            pos2 = i;
            break;
        }
    }
    return exports.floor(avg([pos1, pos2])) / dataCopy.length * 100;
}
exports.revCentile = revCentile;
function iqr(data) {
    return centile(data, 75) - centile(data, 25);
}
exports.iqr = iqr;
function dataRange(data) {
    return max(data) - min(data);
}
exports.dataRange = dataRange;
var SDevMethod;
(function (SDevMethod) {
    SDevMethod[SDevMethod["sample"] = 0] = "sample";
    SDevMethod[SDevMethod["population"] = 1] = "population";
})(SDevMethod || (SDevMethod = {}));
function stdDev(data, method) {
    if (method === void 0) { method = SDevMethod.sample; }
    var avgX = avg(data);
    var s = 0;
    for (var i = 0; i < data.length; i++) {
        s += exports.pow(data[i] - avgX, 2);
    }
    var divider = data.length - 1;
    if (method === SDevMethod.population) {
        divider = data.length;
    }
    return exports.sqrt(s / divider);
}
exports.stdDev = stdDev;
var Noise = (function () {
    function Noise(min, max, noiseRange) {
        this._min = min;
        this._max = max;
        this._range = noiseRange * (max - min);
        this._value = Math.random() * (max - min) + min;
    }
    Object.defineProperty(Noise.prototype, "min", {
        set: function (value) {
            if (this._value < value) {
                this._value = value;
            }
            this._min = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Noise.prototype, "max", {
        set: function (value) {
            if (this._value > value) {
                this._value = value;
            }
            this._max = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Noise.prototype, "noiseRange", {
        set: function (value) {
            if (value > 0 && value < 1) {
                this._range = value * (this._max - this._min);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Noise.prototype, "value", {
        get: function () {
            this.nextValue();
            return this._value;
        },
        set: function (value) {
            if (value >= this._min && value <= this._max) {
                this._value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Noise.prototype, "intValue", {
        get: function () {
            this.nextValue();
            return round(this._value);
        },
        enumerable: true,
        configurable: true
    });
    Noise.prototype.nextValue = function () {
        var min0, max0;
        min0 = this._value - this._range / 2;
        max0 = this._value + this._range / 2;
        if (min0 < this._min) {
            min0 = this._min;
            max0 = min0 + this._range;
        }
        else if (max0 > this._max) {
            max0 = this._max;
            min0 = max0 - this._range;
        }
        this._value = Math.random() * (max0 - min0) + min0;
    };
    return Noise;
}());
exports.Noise = Noise;
function randomInt(a, b) {
    return Math.floor(Math.random() * (Math.max(a, b) - Math.min(a, b) + 1)) + Math.min(a, b);
}
exports.randomInt = randomInt;
function choose(numbers) {
    return numbers[randomInt(0, numbers.length - 1)];
}
exports.choose = choose;
function random() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
        var e1 = Math.max(args[0], args[1]) - Math.min(args[0], args[1]);
        var e2 = Math.min(args[0], args[1]);
        return Math.random() * e1 + e2;
    }
    else {
        return Math.random();
    }
}
exports.random = random;
function shuffle(array) {
    var j, x;
    for (var i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
}
exports.shuffle = shuffle;
function unique(array) {
    return array.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    }).sort();
}
exports.unique = unique;
function fibonacci(n) {
    var result = [1, 1];
    if (n < 1) {
        return [];
    }
    else if (n === 1) {
        return [1];
    }
    else if (n === 2) {
        return [1, 1];
    }
    else {
        for (var i = 0; i < n - 2; i++) {
            result.push(result[i] + result[i + 1]);
        }
        return result;
    }
}
exports.fibonacci = fibonacci;
function linearScale(dataMin, dataMax, resultMin, resultMax) {
    return function (v) {
        var domain;
        if (dataMin != dataMax) {
            domain = (v - dataMin) / (dataMax - dataMin);
        }
        else {
            domain = 0.5;
        }
        var range = resultMax - resultMin;
        return domain * range + resultMin;
    };
}
exports.linearScale = linearScale;
function ordinalScale(d, padding, resultMin, resultMax) {
    var result = [];
    var scale;
    if (d.length > 1) {
        scale = linearScale(0, d.length - 1, resultMin + padding, resultMax - padding);
    }
    else {
        scale = function () {
            return (resultMax - resultMin) / 2;
        };
    }
    for (var i = 0; i < d.length; i++) {
        result.push(round(scale(i)));
    }
    return function (idx) {
        var values = result;
        if (idx >= values.length) {
            return values[values.length - 1];
        }
        else {
            return values[idx];
        }
    };
}
exports.ordinalScale = ordinalScale;
function number2str(x, radix) {
    if (radix === void 0) { radix = 10; }
    return x.toString(radix);
}
exports.number2str = number2str;
function thousandSep(x, sep) {
    var s = number2str(x);
    var st = s.split('.');
    var st1 = st[0];
    var st2 = st.length > 1 ? '.' + st[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(st1)) {
        st1 = st1.replace(rgx, '$1' + sep + '$2');
    }
    return st1 + st2;
}
exports.thousandSep = thousandSep;
function text(text, x, y) {
    var lines = text.split('\n');
    var lineY = -y;
    if (!!exports.dV.ctx) {
        sAttr();
        scale(1, -1);
        for (var i = 0; i < lines.length; i++) {
            exports.dV.ctx.fillText(lines[i], x, lineY);
            lineY += exports.dV.fontSize * exports.dV.lineHeight;
        }
        rAttr();
    }
}
exports.text = text;
function textSize(size) {
    exports.dV.fontSize = size;
    if (!!exports.dV.ctx) {
        setFont();
    }
}
exports.textSize = textSize;
function checkTextSize() {
    return exports.dV.fontSize;
}
exports.checkTextSize = checkTextSize;
function textWidth(text) {
    if (!!exports.dV.ctx) {
        return exports.dV.ctx.measureText(text).width;
    }
    else {
        return 0;
    }
}
exports.textWidth = textWidth;
function textDim(text) {
    var lines = text.split('\n');
    var wSize = 0;
    var hSize = 0;
    if (!!exports.dV.ctx) {
        for (var i = 0; i < lines.length; i++) {
            wSize = max([wSize, exports.dV.ctx.measureText(lines[i]).width]);
            hSize += exports.dV.fontSize * exports.dV.lineHeight;
        }
    }
    hSize = hSize - (exports.dV.fontSize * exports.dV.lineHeight - exports.dV.fontSize);
    return {
        w: wSize,
        h: hSize
    };
}
exports.textDim = textDim;
var HAlignment;
(function (HAlignment) {
    HAlignment[HAlignment["left"] = 0] = "left";
    HAlignment[HAlignment["right"] = 1] = "right";
    HAlignment[HAlignment["center"] = 2] = "center";
    HAlignment[HAlignment["start"] = 3] = "start";
    HAlignment[HAlignment["end"] = 4] = "end";
})(HAlignment = exports.HAlignment || (exports.HAlignment = {}));
var VAlignment;
(function (VAlignment) {
    VAlignment[VAlignment["top"] = 0] = "top";
    VAlignment[VAlignment["hanging"] = 1] = "hanging";
    VAlignment[VAlignment["middle"] = 2] = "middle";
    VAlignment[VAlignment["alphabetic"] = 3] = "alphabetic";
    VAlignment[VAlignment["ideographic"] = 4] = "ideographic";
    VAlignment[VAlignment["bottom"] = 5] = "bottom";
})(VAlignment = exports.VAlignment || (exports.VAlignment = {}));
function textAlign(h, v) {
    if (!!exports.dV.ctx) {
        var optionsH = ['left', 'right', 'center', 'start', 'end'];
        var optionsV = ['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'];
        exports.dV.ctx.textAlign = optionsH[h];
        if (v !== undefined)
            exports.dV.ctx.textBaseline = optionsV[v];
    }
}
exports.textAlign = textAlign;
function setFont() {
    if (!!exports.dV.ctx) {
        exports.dV.ctx.font = exports.dV.fontStyle + ' ' + exports.dV.fontWeight + ' ' + exports.dV.fontSize + 'px ' + exports.dV.fontFamily;
    }
}
exports.setFont = setFont;
function fontStyle(style) {
    if (style) {
        exports.dV.fontStyle = style;
        if (!!exports.dV.ctx) {
            setFont();
        }
    }
    else {
        return exports.dV.fontStyle;
    }
}
exports.fontStyle = fontStyle;
function fontWeight(weight) {
    if (weight) {
        exports.dV.fontWeight = weight;
        if (!!exports.dV.ctx) {
            setFont();
        }
    }
    else {
        return exports.dV.fontWeight;
    }
}
exports.fontWeight = fontWeight;
function fontFamily(family) {
    if (family) {
        exports.dV.fontFamily = family;
        if (!!exports.dV.ctx) {
            setFont();
        }
    }
    else {
        return exports.dV.fontFamily;
    }
}
exports.fontFamily = fontFamily;
function lineHeight(height) {
    exports.dV.lineHeight = height;
}
exports.lineHeight = lineHeight;
function checkLineHeight() {
    return exports.dV.lineHeight;
}
exports.checkLineHeight = checkLineHeight;
function textOnArc(text, x, y, r, startA, align, outside, inward, kerning) {
    if (align === void 0) { align = HAlignment.center; }
    if (outside === void 0) { outside = true; }
    if (inward === void 0) { inward = true; }
    if (kerning === void 0) { kerning = 0; }
    if (!!exports.dV.ctx) {
        var clockwise = (align === HAlignment.left) ? 1 : -1;
        if (!outside)
            r -= exports.dV.fontSize;
        if (((align === HAlignment.center || align === HAlignment.right) && inward) ||
            (align === HAlignment.left && !inward))
            text = text.split('').reverse().join('');
        sAttr();
        if (!!exports.dV.ctx)
            exports.dV.ctx.translate(x, y);
        var _startA = startA;
        startA += exports.HALF_PI;
        if (!inward)
            startA += exports.PI;
        exports.dV.ctx.textBaseline = 'middle';
        exports.dV.ctx.textAlign = 'center';
        if (align === HAlignment.center) {
            for (var i = 0; i < text.length; i++) {
                var charWidth = exports.dV.ctx.measureText(text[i]).width;
                startA += ((charWidth + (i === text.length - 1 ? 0 : kerning)) /
                    (r - exports.dV.fontSize)) / 2 * -clockwise;
            }
        }
        var tempA = 0;
        exports.dV.ctx.rotate(startA);
        for (var i = 0; i < text.length; i++) {
            var charWidth = exports.dV.ctx.measureText(text[i]).width;
            exports.dV.ctx.rotate((charWidth / 2) / (r - exports.dV.fontSize) * clockwise);
            exports.dV.ctx.fillText(text[i], 0, (inward ? 1 : -1) * (0 - r + exports.dV.fontSize / 2));
            exports.dV.ctx.rotate((charWidth / 2 + kerning) / (r - exports.dV.fontSize) * clockwise);
            tempA += ((charWidth / 2) / (r - exports.dV.fontSize) * clockwise) +
                ((charWidth / 2 + kerning) / (r - exports.dV.fontSize) * clockwise);
        }
        rAttr();
        return _startA + tempA;
    }
    else {
        return 0;
    }
}
exports.textOnArc = textOnArc;
exports.prnt = Function.prototype.bind.call(console.log, console, 'dvlib >> ');
function playSound(sound) {
    sound.muted = false;
    sound.load();
    sound.play();
}
exports.playSound = playSound;
var AnimationCtrl = (function () {
    function AnimationCtrl(callback) {
        var _this = this;
        this.fps = 60;
        this.delay = 1000 / this.fps;
        this.currentFrame = -1;
        var time = null;
        var reqAF;
        this.loop = function (timestamp) {
            if (time == null)
                time = timestamp;
            var seg = exports.floor((timestamp - time) / _this.delay);
            if (seg > _this.currentFrame) {
                _this.currentFrame = seg;
                callback({
                    time: timestamp,
                    frame: _this.currentFrame
                });
            }
            reqAF = requestAnimationFrame(_this.loop);
        };
        this.isAnimating = false;
        this.frameRate = function (newfps) {
            _this.fps = newfps;
            _this.delay = 1000 / _this.fps;
            _this.currentFrame = -1;
            time = null;
        };
        this.start = function () {
            if (!_this.isAnimating) {
                _this.isAnimating = true;
                reqAF = requestAnimationFrame(_this.loop);
            }
        };
        this.stop = function () {
            if (_this.isAnimating) {
                cancelAnimationFrame(reqAF);
                _this.isAnimating = false;
                time = null;
                _this.currentFrame = -1;
            }
        };
    }
    return AnimationCtrl;
}());
var Preloader = (function () {
    function Preloader() {
        this.assets = {};
        this.onProgress = function () { };
        this.onComplete = function () { };
        this.loadingProgress = 0;
    }
    Preloader.prototype.on = function (eventName, callbackFunction) {
        switch (eventName) {
            case 'progress':
                this.onProgress = callbackFunction;
                break;
            case 'complete':
                this.onComplete = callbackFunction;
                break;
        }
    };
    Preloader.prototype.load = function (assets) {
        var _this = this;
        var total = assets.length;
        var loaded = 0;
        var onFinishedLoading = function () {
            loaded++;
            _this.loadingProgress = loaded / total;
            if (loaded == total) {
                _this.onComplete();
            }
        };
        this.loadingProgress = 0;
        for (var count = 0; count < total; count++) {
            var id = assets[count].id;
            var src = assets[count].src;
            var type = src.split('.').pop();
            switch (type) {
                case 'svg':
                case 'png':
                case 'jpg':
                case 'jpeg':
                    this.loadImg(id, src, onFinishedLoading);
                    break;
                case 'json':
                    this.loadJson(id, src, onFinishedLoading);
                    break;
                case 'mp3':
                case 'wav':
                    this.loadAudio(id, src, onFinishedLoading);
                    break;
                default:
                    onFinishedLoading();
                    break;
            }
        }
    };
    Preloader.prototype.loadJson = function (id, src, callback) {
        var _this = this;
        this.request(src, 'json', function (response) {
            _this.assets[id] = response;
            callback();
        });
    };
    Preloader.prototype.loadImg = function (id, src, callback) {
        var _this = this;
        this.request(src, 'blob', function (response) {
            var img = new Image();
            img.src = URL.createObjectURL(response);
            _this.assets[id] = img;
            img.onload = callback;
        });
    };
    Preloader.prototype.loadAudio = function (id, src, callback) {
        var _this = this;
        this.request(src, 'blob', function (response) {
            var audio = new Audio();
            audio.src = URL.createObjectURL(response);
            audio.muted = true;
            _this.assets[id] = audio;
            callback();
        });
    };
    Preloader.prototype.request = function (src, type, callback) {
        var xhrObj = new XMLHttpRequest();
        xhrObj.onload = function () {
            callback(xhrObj.response);
        };
        xhrObj.open('get', src, true);
        xhrObj.responseType = type;
        xhrObj.send();
    };
    Preloader.prototype.getResult = function (id) {
        if (typeof this.assets[id] !== 'undefined') {
            return this.assets[id];
        }
        else {
            return null;
        }
    };
    return Preloader;
}());
var preloader = new Preloader();
function addAsset(asset) {
    assetList.push(asset);
}
exports.addAsset = addAsset;
exports.assets = {};
