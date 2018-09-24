Manual end-to-end tests checklists
===

This document lists all user stories that *should* be manually tested before releasing a new version of Dicto.

All of these tests have to be valid on 3 following platforms: 

* Latest Chrome browser
* Latest Firefox browser
* Electron version

# Home view


| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Change language | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Start guided tour | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |


# Corpora view

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Check all nav buttons are behaving properly | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Check guided tour | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Create a new corpus | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Import a new corpus: valid | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Import a new corpus: bad JSON (should refuse and explain) | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Import a new corpus: bad schema (should refuse and explain) | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Load an example corpus | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Corpus preview card: preview should change on hover | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Open a corpus | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Download a corpus | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Duplicate a corpus | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Delete a corpus then cancel | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Delete a corpus then confirm | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |


# Corpus view

## General

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Check all nav buttons are behaving properly | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Check guided tour | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |

## Media subview

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Search a media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Create a new media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Navigate paginated list | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Edit a media annotations | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Delete a media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Click on 'more info' | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| [In more info] edit media annotations | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| [In more info] create a composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| [In more info] delete media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| delete a media when "more info" opened on it | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |

## Tags subview

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Open and close tag categories | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Edit a tag category | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Delete a tag category | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Create a tag category | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Search tags | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Create a tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Edit a tag title and description | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Add location to a tag (through long/lat) | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Add location to a tag (through address search) | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Change location of a tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Delete location of a tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Add date to a tag (just start) | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Add date to a tag (just end) | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Add date to a tag (start and end) | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Modify date of a tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Remove date of a tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Delete a tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Delete a tag while link pannel opened on it | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Delete a tag category while link pannel opened on one of its tags | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Open link pannel of a tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| [Link pannel] untag excerpts | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| [Link pannel] search new excerpts | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| [Link pannel] manually link new excerpt | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| [Link pannel] batch link new excerpts | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |

## Compositions subview


| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Search a composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Create a new composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Navigate paginated list | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Edit a composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Delete a composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Click on 'more info' | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| [In more info] edit composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| [In more info] delete composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| delete a composition when "more info" opened on it | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |

## Import corpus

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Import valid and duplicate-free corpus | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Import invalid corpus (bad JSON) : should refuse and explain | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Import invalid corpus (bad schema) : should refuse and explain | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicate : merge all | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicates : merge all | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicates : keep all | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicates : merge one media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicates : keep one media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicates : forget one media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicates : merge one tag category | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicates : keep one tag category | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicates : forget one tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicates : merge one tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicates : keep one tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Handle duplicates : forget one tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |

## Export corpus

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Open export modal | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Preview empty corpus | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Download as HTML | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Download as JSON | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Download medias list tsv | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Download excerpts list tsv | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |


# Media view


## General

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Check all nav buttons are behaving properly | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Check guided tour | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |

## Media space management

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Zoom in and out in media space | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Search excerpt in media space | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Click in media space : shoud seek | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Media space mini-control: play and pause | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Media space mini-control: move 5s forward and move 5s backward | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Check keyboard shortcuts | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Create a new chunk by dragging | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Media space : right click > delete all excerpts | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Drag an excerpt in media space | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Drag an excerpt start | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Drag an excerpt end | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Select/deselect excerpt | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |

## Excerpt edition

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Modify timecode in | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Modify timecode out | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Delete excerpt | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Close excerpt edition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Magnify/minify excerpt edition component | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Edit excerpt content | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| More options : focus on excerpt | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| More options : display keyboard shortcuts | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| More options : create a new annotation field | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| More options : switch between annotation fields | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| More options : edit an existing annotation field | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| More options : delete an existing annotation field | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Tags : search an existing tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Tags : Link tag matching search | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Tags : Link tag already linked in media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Edit tag properties | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Search an inexisting tag then hit enter > create a new tag | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Create a new tag > create a new tag category | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |

## Railway column

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Modify columns dimensions | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Brush a new media view in railway | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Scroll in railway | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Click in railway: should scroll and seek to clicked position | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Play/pause media through railway column button | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Seek in media by modifying input in railway column : valid timecode | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Seek in media by modifying input in railway column : timecode exceeding video length | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |

## Media column

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Open and modify annotated media properties | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Open media pannel | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Media pannel : navigate paginated list | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Media pannel : change media (same media platform) | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Media pannel : change media (different media platform) | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Media pannel : create a new media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Create a new media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Navigate paginated list | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> 
| Play+pause(+seek) in native media player : youtube | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> 
| Play+pause(+seek) in native media player : vimeo | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> 
| Play+pause(+seek) in native media player : facebook | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> 
| Play+pause(+seek) in native media player : soundcloud | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> 
| Play+pause(+seek) in native media player : dailymotion | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> 
| Play+pause(+seek) in native media player : mp4 video | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> 
| Play+pause(+seek) in native media player : local video | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> 
| Play+pause(+seek) in native media player : local audio | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> 

## Import annotations modal

## Export annotations modal



# Composition view

| user story | Chrome | Firefox | Electron |
| --- | --- | --- | --- |
| Check all nav buttons are behaving properly | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Check guided tour | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Edit composition properties | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Export composition to HTML page | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Export composition to HTML clipboard | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Search an excerpt | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Change excerpts field display | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Set media filter | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Set tag category filter | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Set tag filter | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Navigate excerpts pagination | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Add all matching excerpts to composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Excerpt : click on "edit excerpt" | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Excerpt : right-click > add at begining of composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Excerpt : right-click > add at end of composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Excerpt : right-click > add all excerpts from same media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Excerpt : right-click > edit media excerpts | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Dnd excerpt to composition summary in right column | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Dnd existing excerpt to composition summary in right column : should refuse and explain | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Unlink composition block | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Move composition block by dnd | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Move composition block by clicking on arrows | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Composition block edition : change displayed field | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Composition block edition : Add link to composition block | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Composition block edition : Add markdown content to composition block | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Composition block edition : Add image gallery to composition block | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Composition block : right click > move to begining of composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Composition block : right click > move to end of composition | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Composition block : right click > reorder excerpts by media | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |
| Composition block : right click > delete all composition blocks | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> | <ul><li>[ ] check</li></ul> |




