# Dicto changelog

*Written according to [Keep a changelog](https://keepachangelog.com/en/1.0.0/) guidelines and [semantic versioning](https://semver.org/)*.

## [1.0.0-alpha.3](https://github.com/dictoapp/dicto/tree/1.0.0-alpha.3) - 2018-09-28

### Fixed

* fix bug when accessing a composition containing a citation to an excerpt that has been deleted from corpus
* fix broken composition standalone player

### Changed

* in composition view, display warning when trying to cite a excerpt twice
* diverse UI/UX fixes in composition view

### Added

* in `about` section, new references to similar/alternative tools
* add manual e2e test checklist

## [1.0.0-alpha.2](https://github.com/dictoapp/dicto/tree/1.0.0-alpha.2) - 2018-09-22

### Fixed

* fix vimeo metadata retrieval method
* add missing terms in translations and correct language/wording mistakes
* fix bug in media annotation when inputing incorrect time codes
* fix diverse design minor problems
* fix some bugs with montage player

### Added

* add link to github repo issues to electron crash report
* allow copy/pasting in the electron version

## [1.0.0-alpha.1](https://github.com/dictoapp/dicto/tree/1.0.0-alpha.1) - 2018-09-21

### Fixed

* web application stalled after creating a new corpus
* fix application crash when dealing with undefined excerpts annotation fields
* add missing terms in translations
* fix minor wording issues

## [1.0.0-alpha](https://github.com/dictoapp/dicto/tree/1.0.0-alpha) - 2018-09-20

### Changed

* change various expressions/labels/translations in UI
* improve "export composition to plain HTML code" feature -> do not display iframes/medias information several times for consecutive excerpts of the same media

### Fixed

* add various missing terms in translations
* fix several major Firefox CSS compatibility issues
* fix minor UI/CSS issues in main application and output templates
* fix facebook metadata image by adding width and height
* fix a major time-tracking issue with media player component
