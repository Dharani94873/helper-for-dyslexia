# Font Files

Due to licensing considerations, font files are not included in this repository. Please download them separately:

## OpenDyslexic Font

1. Visit: https://opendyslexic.org/
2. Download the font package
3. Extract `OpenDyslexic-Regular.woff2` (or convert from .otf/.ttf to .woff2)
4. Place in `frontend/assets/fonts/OpenDyslexic-Regular.woff2`

**License**: OpenDyslexic is available under a Creative Commons license or SIL Open Font License.

## Lexend Font

Lexend is available from Google Fonts and will load automatically via CDN in the CSS file.

**Alternative**: To host locally:
1. Visit: https://fonts.google.com/specimen/Lexend
2. Download the font family
3. Extract `Lexend-Regular.woff2`
4. Place in `frontend/assets/fonts/Lexend-Regular.woff2`

**License**: Lexend is available under the SIL Open Font License.

## Converting Fonts to WOFF2

If you download .ttf or .otf files, you can convert them to .woff2 using:
- Online tool: https://cloudconvert.com/ttf-to-woff2
- Command line: `fonttools` Python library

## Fallback

If fonts are not available, the application will fall back to system fonts. The application will still function normally.
