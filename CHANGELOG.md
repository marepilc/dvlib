# Changelog

## version 1.1.4
- bug fix

## version 1.1.3

### Changed
- function **ellipse** rewritten.
- function **textSize** can be called without argument to check the current text size.
- function **checkLineHeight** can be called without argument to check the current line height.

### removed
- function **checkTextSize**
- function **checkLineHeight**

## version 1.1.2

### Added
- function **randomColor**.

### Changed
- **AnimationCtrl** --- added possibility to set initial fps inside the setup function, i.e. `animation.fps = 30`.
- function **roundStr** renamed to **round2str**.
- function **rotate** rotates the canvas clockwise.

## version 1.1.1
- bug fix

## version 1.1.0

### Added
- Boolean **dV** properities: *keyIsPressed*, *altIsPressed*, *shiftIsPressed*, *ctrlIsPressed*.
- **dV** properity: *keyPressed* (null or string).

### Changed
- Default fill color: '#567F98' (*blueLight*).
- Default stroke color: '#2D2F2F' (*coldGrayDark*).