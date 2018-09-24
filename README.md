# dicto | transcribe > annotate > remix > publish video and audio content

[![Price](https://img.shields.io/badge/price-FREE-0098f7.svg)](https://github.com/dictoapp/dicto/blob/master/LICENSE)
[![License: AGPL v3.0](https://img.shields.io/badge/license-AGPL-blue.svg)](https://github.com/dictoapp/dicto/blob/master/LICENSE)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Dicto%20-%20A%20media%20annotation%20and%20publishing%20tool%20for%20academic%2C%20%20journalistic%20and%20educational%20use&url=https://www.dictoapp.github.io/dicto&hashtags=annotation,caqdas,video,publishing,design)

> A media annotation and publishing tool for academic, journalistic, and educational use

![Dicto screenshot](https://github.com/dictoapp/dicto/raw/master/screenshot.png)

Dicto is an application made for the annotation, analysis and publication of video and audio content. It allows to work with interviews, videos analysis, or oral communication restitutions, for private analysis and/or online publishing contexts.

Dicto allows to annotate videos with transcriptions, translations or commentaries, to tag them with themes, people, places and dates, and possibly to publish them as websites or embeddable html code.

Dicto is designed as a flexible tool: it can be connected to other transcription tools ; it also allows to export a corpus or a selection of excerpts as an autonomous web page ready for consultation, or as data files allowing further work with other tools.

# Installation


1. Get a google api key in google dev console -> https://console.developers.google.com then enable youtube and maps apis.
2. Go to vimeo api website, and create a new app --> https://developer.vimeo.com/apps/new then copy client id and client secret
3. Open a terminal/bash and type the following lines :

```
git clone https://github.com/dictoapp/dicto
cd dicto
npm install
cp config.sample.json app/config.dev.json
cp config.sample.json app/config.prod.json
```

4. Fill `app/config.dev.json` and `app/config.prod.json` with your google and vimeo credentials

# Main dev scripts

```
# run in electron/dev mode with hot reloading
npm run dev:electron

# run in web/dev mode with hot reloading
npm run dev:web

# pack electron application for all platforms
npm run pack

# build web version for production
npm run build:web

# fix scss code styles
npm run comb

# diagnose and fix js code
npm run lint:fix


```
    
# Contribute to Dicto

The source code of Dicto is [published on github](https://github.com/dictoapp/dicto) under free license [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). 

**The tool is currently in alpha stage, and contributions to improve it are welcome.**

Do not hesitate to [submit new issues](https://github.com/dictoapp/dicto/issues/new) to the project's repository in order to signal bugs or missing features.

## Acknowledgements

Dicto is the outcome of a design research project about academic publishing in the humanities and social sciences initiated in 2014 by Robin de Mourat (Université Rennes 2 - Sciences Po Paris), under the supervision of Nicolas Thély and Donato Ricci, and thanks to a PhD funding provided by the french Ministry of Higher Education and Research (MESR).

Dicto has been developed and improved thanks to the feedbacks and support of many persons and organizations including Donato Ricci, Nicolas Thély, Antoine Delinotte, Laetitia Giorgino, Antoine Lefur, Joachim Prehn Thomsen, Thomas Fomsgaard Nyrup, Calibro company, Université Rennes 2, médialab Sciences Po, Maison des Sciences de l'Homme de Bretagne.

Besides, it relies on a lot of open source packages made by 471 different persons for which here are some credits :

- **Sindre Sorhus** *sindresorhus@gmail.com* (204 packages)
- **Jon Schlinkert** *github@sellside.com* (94 packages)
- **Isaac Z. Schlueter** *isaacs@npmjs.com* (52 packages)
- **Kevin Mårtensson** *kevinmartensson@gmail.com* (46 packages)
- **John-David Dalton** *john.david.dalton@gmail.com* (41 packages)
- **Graham Fairweather** *xotic750@gmail.com* (37 packages)
- **James Halliday** *mail@substack.net* (29 packages)
- **Titus Wormer** *tituswormer@gmail.com* (29 packages)
- **Jordan Harband** *ljharb@gmail.com* (28 packages)
- **Sebastian McKenzie** *sebmck@gmail.com* (25 packages)
- Unknown (24 packages)
- **Ben Briggs** *beneb.info@gmail.com* (24 packages)
- **Rebecca Turner** *me@re-becca.org* (21 packages)
- **Shinnosuke Watanabe** *snnskwtnb@gmail.com* (20 packages)
- **Tobias Koppers @sokra** (20 packages)
- **Jake Verbaten** *raynos2@gmail.com* (19 packages)
- **Mathias Buus** *mathiasbuus@gmail.com* (17 packages)
- **Dominic Tarr** *dominic.tarr@gmail.com* (16 packages)
- Unknown (16 packages)
- **TJ Holowaychuk** *tj@vision-media.ca* (16 packages)
- **Sven Sauleau** (15 packages)
- **Kat Marchaán** *kzm@sykosomatic.org* (15 packages)
- **Shane Osbourne** (11 packages)
- **Nathan Rajlich** *nathan@tootallnate.net* (10 packages)
- **Vsevolod Strukchinsky** *floatdrop@gmail.com* (10 packages)
- **Mike Bostock** *mike@ocks.org* (10 packages)
- **Vladimir Krivosheev** (10 packages)
- **Fedor Indutny** *fedor@indutny.com* (10 packages)
- **Felix Böhm** *me@feedic.com* (10 packages)
- **Douglas Wilson** *doug@somethingdoug.com* (9 packages)
- **Mariusz Nowak** *medyk@medikoo.com* (9 packages)
- **Jonathan Ong** *jonathanrichardong@gmail.com* (9 packages)
- **Calvin Metcalf** *calvin.metcalf@gmail.com* (8 packages)
- **Mathias Bynens** *mathias@qiwi.be* (8 packages)
- **Sam Verschueren** *sam.verschueren@gmail.com* (8 packages)
- **JD Ballard** *i.am.qix@gmail.com* (8 packages)
- **Joshua Appelman** *jappelman@xebia.com* (8 packages)
- **Ben Newman** *bn@cs.stanford.edu* (7 packages)
- **Benjamin Coe** *ben@npmjs.com* (7 packages)
- **Matt DesLauriers** *dave.des@gmail.com* (7 packages)
- **Mikeal Rogers** *mikeal.rogers@gmail.com* (6 packages)
- **JP Richardson** *jprichardson@gmail.com* (6 packages)
- **Simon Boudrias** *admin@simonboudrias.com* (6 packages)
- **Jake Luer** *jake@alogicalparadox.com* (6 packages)
- **Feross Aboukhadijeh** *feross@feross.org* (6 packages)
- **Charlie Robbins** *charlie.robbins@gmail.com* (6 packages)
- **Chris Talkington** (5 packages)
- **Glen Maddern** (5 packages)
- **Simon Lydell** (5 packages)
- **2013+ Bevry Pty Ltd** *us@bevry.me* (5 packages)
- **Benjamin Lupton** *b@lupton.cc* (5 packages)
- **James Talmage** *james@talmage.io* (5 packages)
- **Yusuke SUZUKI** *utatane.tea@gmail.com* (5 packages)
- **Bogdan Chadkin** *trysound@yandex.ru* (5 packages)
- **Gulp Team** *team@gulpjs.com* (5 packages)
- **Thorsten Lorenz** *thlorenz@gmx.de* (5 packages)
- **Felix Geisendörfer** *felix@debuggable.com* (5 packages)
- **Arnout Kazemier** *opensource@3rd-eden.com* (5 packages)
- **Max Ogden** *max@maxogden.com* (5 packages)
- **Julian Gruber** *julian@juliangruber.com* (5 packages)
- **Tim Voronov** *ziflex@gmail.com* (4 packages)
- **IndigoUnited** *hello@indigounited.com* (4 packages)
- **Jed Watson** *jed.watson@me.com* (4 packages)
- **Evgeny Poberezkin** (4 packages)
- **Blaine Bublitz** *blaine@iceddev.com* (4 packages)
- **Forbes Lindesay** *forbes@lindesay.co.uk* (4 packages)
- *contact@wearefractal.com* (4 packages)
- **George Zahariev** *z@georgezahariev.com* (4 packages)
- **Domenic Denicola** *domenic@domenicdenicola.com* (4 packages)
- **Gil Barbara** *gilbarbara@gmail.com* (4 packages)
- **Elan Shanker** *elan.shanker+npm@gmail.com* (3 packages)
- **Travis Arnold** *travis@souporserious.com* (3 packages)
- **Dan Abramov** *dan.abramov@me.com* (3 packages)
- **Hugh Kennedy** *hughskennedy@gmail.com* (3 packages)
- **Mikola Lysenko** (3 packages)
- **Heather Arthur** *fayearthur@gmail.com* (3 packages)
- **Brian Woodward** (3 packages)
- **Kyle E. Mitchell** *kyle@kemitchell.com* (3 packages)
- **Espen Hovlandsdal** *espen@hovlandsdal.com* (3 packages)
- **Irakli Gozalishvili** *rfobic@gmail.com* (3 packages)
- **Robert Kieffer** *robert@broofa.com* (3 packages)
- **Andres Suarez** *zertosh@gmail.com* (3 packages)
- **Cloud Programmability Team** (3 packages)
- **Sergey Slipchenko** *faergeek@gmail.com* (3 packages)
- **Toru Nagashima** (3 packages)
- **Tyler Kellen** *tyler@sleekcode.net* (3 packages)
- **Roman Shtylman** *shtylman@gmail.com* (3 packages)
- **Andrey Sitnik** *andrey@sitnik.ru* (3 packages)
- **Joshua Boy Nicolai Appelman** *joshua@jbna.nl* (3 packages)
- **Luke Childs** *lukechilds123@gmail.com* (3 packages)
- **Paul Miller** *paul+gh@paulmillr.com* (3 packages)
- **Nicholas C. Zakas** *nicholas+npm@nczconsulting.com* (3 packages)
- **Maxime Thirouin** (3 packages)
- **Michael Rhodes** (3 packages)
- **Michael Jackson** *mjijackson@gmail.com* (3 packages)
- **Dmitry Filatov** *dfilatov@yandex-team.ru* (3 packages)
- **Roman Dvornov** *rdvornov@gmail.com* (3 packages)
- **Mike Sherov** (3 packages)
- **Rod Vagg** *r@va.gg* (3 packages)
- **michael mifsud** *xzyfer@gmail.com* (2 packages)
- **Michael Hart** *michael.hart.au@gmail.com* (2 packages)
- **David Frank** (2 packages)
- **Lloyd Brookes** *75pound@gmail.com* (2 packages)
- **Andrew Goode** *andrewbgoode@gmail.com* (2 packages)
- **Alex Reardon** *alexreardon@gmail.com* (2 packages)
- **Andrey Popp** *8mayday@gmail.com* (2 packages)
- **Matthew Mueller** *matt@lapwinglabs.com* (2 packages)
- **Eran Hammer** *eran@hammer.io* (2 packages)
- **Thomas Watson Steen** *w@tson.dk* (2 packages)
- **Kirill Fomichev** *fanatid@ya.ru* (2 packages)
- **Glen Mailer** *glen@stainlessed.co.uk* (2 packages)
- **Mihai Bazon** *mihai.bazon@gmail.com* (2 packages)
- **Blake Embrey** *hello@blakeembrey.com* (2 packages)
- **Guillermo Rauch** *rauchg@gmail.com* (2 packages)
- **Ahmad Nassri** *ahmad@ahmadnassri.com* (2 packages)
- **Andrew Clark** *acdlite@me.com* (2 packages)
- **Ben Lesh** *ben@benlesh.com* (2 packages)
- **Gajus Kuizinas** *gajus@gajus.com* (2 packages)
- **Ethan Cohen** (2 packages)
- **Roy Riojas** (2 packages)
- **Andrew Kelley** *superjoe30@gmail.com* (2 packages)
- **David Björklund** *david.bjorklund@gmail.com* (2 packages)
- **Michael Mclaughlin** *M8ch88l@gmail.com* (2 packages)
- **Mauro Bringolf** (2 packages)
- **Joyent** (2 packages)
- **Carl Xiong** *xiongc05@gmail.com* (2 packages)
- **Matt-Esch** *matt@mattesch.info* (2 packages)
- **case** *case@casesandberg.com* (2 packages)
- **Petka Antonov** *petka.antonov@gmail.com* (2 packages)
- **Eugene Ware** *eugene@noblesamurai.com* (2 packages)
- **Steven Vachon** *contact@svachon.com* (2 packages)
- **Roly Fentanes** (2 packages)
- **Andris Reinman** *andris.reinman@gmail.com* (2 packages)
- **Josh Glazebrook** (2 packages)
- **"Cowboy" Ben Alman** (2 packages)
- **sudodoki** *smd.deluzion@gmail.com* (2 packages)
- **Troy Goode** *troygoode@gmail.com* (2 packages)
- **Jaret Burkett** *jaretburkett@gmail.com* (2 packages)
- **Robert Kowalski** *rok@kowalski.gd* (2 packages)
- **André Cruz** *amdfcruz@gmail.com* (2 packages)
- **Tim Oxley** *secoif@gmail.com* (2 packages)
- **Conrad Pankoff** *deoxxa@fknsrs.biz* (2 packages)
- **silverwind** *me@silverwind.io* (2 packages)
- **Yeoman** (2 packages)
- **Tony Ganch** *tonyganch+github@gmail.com* (2 packages)
- **Stephen Sugden** *me@stephensugden.com* (2 packages)
- **Rafael Pedicini** *code@rafrex.com* (2 packages)
- **freeall** *freeall@gmail.com* (2 packages)
- **Meryn Stol** *merynstol@gmail.com* (2 packages)
- **John Hiesey** (2 packages)
- **Ingvar Stepanyan** *me@rreverser.com* (2 packages)
- **Daniel Cousens** (2 packages)
- **Joyent, Inc** (2 packages)
- **Jarrett Cruger** *jcrugzz@gmail.com* (2 packages)
- **Steven Levithan** (2 packages)
- **John Hewson** (1 package)
- **Sasha Koss** *koss@nocorp.me* (1 package)
- **Trent Mick** *trentm@gmail.com* (1 package)
- **1000ch** *shogo.sensui@gmail.com* (1 package)
- **Phillip Clark** *phillip@flitbit.com* (1 package)
- **Viacheslav Lotsmanov** *lotsmanov89@gmail.com* (1 package)
- **Nick Fisher** (1 package)
- **Lovell Fuller** *npm@lovell.info* (1 package)
- **Fredrik Nicol** *fredrik.nicol@gmail.com* (1 package)
- **Kevin Decker** *kpdecker@gmail.com* (1 package)
- **David Tudury** *david.tudury@gmail.com* (1 package)
- **Sergey Kryzhanovsky** *skryzhanovsky@ya.ru* (1 package)
- **Mikhail Troshev** *mishanga@yandex-team.ru* (1 package)
- **John Otander** *johnotander@gmail.com* (1 package)
- **motdotla** (1 package)
- **scottmotte** (1 package)
- **Nik Coughlin** *nrkn.com@gmail.com* (1 package)
- **Jeremie Miller** *jeremie@jabber.org* (1 package)
- **Ryan Bennett** (1 package)
- **Matthew Eernisse** *mde@fleegix.org* (1 package)
- **Dave Eddy** *dave@daveeddy.com* (1 package)
- **Samuel Attard** *samuel.r.attard@gmail.com* (1 package)
- **Alex Gorbatchev** (1 package)
- **Manuel Alabor** *manuel@alabor.me* (1 package)
- **sethlu** (1 package)
- **Yan Foto** *yan.foto@quaintous.com* (1 package)
- **Kilian Valkhof** (1 package)
- **Electron Community** (1 package)
- **Kiko Beats** *josefrancisco.verdu@gmail.com* (1 package)
- **Joe Lencioni** *joe.lencioni@gmail.com* (1 package)
- **tabrindle@gmail.com** (1 package)
- **Leland Richardson** *leland.richardson@airbnb.com* (1 package)
- **Valérian Galliat** (1 package)
- **Yehuda Katz, Tom Dale, Stefan Penner and contributors** (1 package)
- **Matt Dolan** *matt@dolan.me* (1 package)
- **Mathias Schreck** *schreck.mathias@gmail.com* (1 package)
- **Yannick Croissant** *yannick.croissant+npm@gmail.com* (1 package)
- **Supasate Choochaisri** (1 package)
- **Joel Feenstra** *jrfeenst+esquery@gmail.com* (1 package)
- **Ben Ripkens** *bripkens.dev@gmail.com* (1 package)
- **John MacFarlane** (1 package)
- **Bruno Windels** *bruno.windels@gmail.com* (1 package)
- **LM** *ralphtheninja@riseup.net* (1 package)
- **Stefan Thomas** *justmoon@members.fsf.org* (1 package)
- **Kevin Gravier** *kevin@mrkmg.com* (1 package)
- **webpack Contrib** (1 package)
- **Alexis Sellier** *github@cloudhead.io* (1 package)
- **DY** *dfcreative@gmail.com* (1 package)
- **Sergey Belov** *peimei@ya.ru* (1 package)
- **Denis Malinochkin** (1 package)
- **Ramesh Nair** *ram@hiddentao.com* (1 package)
- **Sergey Berezhnoy** *veged@ya.ru* (1 package)
- **Matteo Collina** *hello@matteocollina.com* (1 package)
- **Eli Grey** *me@eligrey.com* (1 package)
- **Antonio Macias** (1 package)
- **Joshua Holbrook** *josh.holbrook@gmail.com* (1 package)
- **Flow Team** *flow@fb.com* (1 package)
- **Olivier Lalonde** *olalonde@gmail.com* (1 package)
- **Dave Gandy** *dave@fontawesome.io* (1 package)
- **Tomás Pollak** *tomas@forkhq.com* (1 package)
- **Dane Springmeyer** *dane@mapbox.com* (1 package)
- **Nikita Skovoroda** *chalkerx@gmail.com* (1 package)
- **Philipp Dunkel** *pip@pipobscure.com* (1 package)
- **Paul Vorbach** *paul@vorba.ch* (1 package)
- **Kyle Robinson Young** *kyle@dontkry.com* (1 package)
- **Stefan Penner** *stefan.penner@gmail.com* (1 package)
- **Ilya Radchenko** *ilya@burstcreations.com* (1 package)
- **Alex Wilson** *alex.wilson@joyent.com* (1 package)
- **Alexander Tesfamichael** *alex.tesfamichael@gmail.com* (1 package)
- **Alex Ford** *alex.ford@codetunnel.com* (1 package)
- **Jaime Pillora** (1 package)
- **Nick Fitzgerald** *fitzgen@gmail.com* (1 package)
- **istarkov https://github.com/istarkov** (1 package)
- **Zhiye Li** *github@zhiye.li* (1 package)
- **Joshua Boy Nicolai Appelman** *joshua@jbnicolai.nl* (1 package)
- **Timo Sand** *timo.sand@iki.fi* (1 package)
- **Hector Parra** *hector@hectorparra.com* (1 package)
- **Florian Reiterer** *me@florianreiterer.com* (1 package)
- **DC** *threedeecee@gmail.com* (1 package)
- **Marak Squires** (1 package)
- **Thiago de Arruda** *tpadilha84@gmail.com* (1 package)
- **Andrea Giammarchi** (1 package)
- **Trent Mick, Sam Saccone** (1 package)
- **Dmitry Shirokov** *deadrunk@gmail.com* (1 package)
- **Michael Ridgway** *mcridgway@gmail.com* (1 package)
- **Alexis Deveria** *adeveria@gmail.com* (1 package)
- **Steve Mao** *maochenyan@gmail.com* (1 package)
- **Marat Dulin** *mdevils@yandex.ru* (1 package)
- **Malte Legenhausen** *legenhausen@werk85.de* (1 package)
- **Kornel Lesiński** *kornel@geekhood.net* (1 package)
- **Eric McCarthy** *eric@limulus.net* (1 package)
- **Ben Drucker** *bvdrucker@gmail.com* (1 package)
- **Steven Chim** (1 package)
- **Nick Fitzgerald** *nfitzgerald@mozilla.com* (1 package)
- **akabeko** (1 package)
- **Brian J. Brennan** *brianloveswords@gmail.com* (1 package)
- **Nadav Ivgi** (1 package)
- **kael** (1 package)
- **Thomas Coopman @tcoopman** (1 package)
- **Mozilla Developer Network** (1 package)
- **Kir Belevich** *kir@soulshine.in* (1 package)
- **Lee Byron** (1 package)
- **Jens Taylor** *jensyt@gmail.com* (1 package)
- **Shane Osbourne and John Lindquist** (1 package)
- **Devon Govett** *devongovett@gmail.com* (1 package)
- **whitequark** *whitequark@whitequark.org* (1 package)
- **Qix** (1 package)
- **Faisal Salman** *f@faisalman.com* (1 package)
- **kumavis** (1 package)
- **bubkoo** *bubkoo.wy@gmail.com* (1 package)
- **Vigour.io** *dev@vigour.io* (1 package)
- **Wes Todd** (1 package)
- **Tomek Wiszniewski** *t.wiszniewski@gmail.com* (1 package)
- **wayfind** (1 package)
- **Garen J. Torikian** *gjtorikian@gmail.com* (1 package)
- **Matt Andrews** *matt@mattandre.ws* (1 package)
- **Rob Loach** *robloach@gmail.com* (1 package)
- **Michael Mooring** *mike@mdm.cc* (1 package)
- **Alexander Shtuchkin** *ashtuchkin@gmail.com* (1 package)
- **Oliver Moran** *oliver.moran@gmail.com* (1 package)
- **shaozilee** *shaozilee@gmail.com* (1 package)
- **Dan Kogai** (1 package)
- **Tom Wu** (1 package)
- **Jeremy Ashkenas** *jashkenas@gmail.com* (1 package)
- **Felix Kling** (1 package)
- **Chute** *hello@getchute.com* (1 package)
- **Kris Zyp** (1 package)
- **Lasse Brudeskar Vikås** (1 package)
- **Aseem Kishore** *aseem.kishore@gmail.com* (1 package)
- **Douglas Crockford** (1 package)
- **Kristian Faeldt** *faeldt_kristian@cyberagent.co.jp* (1 package)
- **Jonas Pommerening** *jonas.pommerening@gmail.com* (1 package)
- **T. Jameson Little** *t.jameson.little@gmail.com* (1 package)
- **John Hurliman** *jhurliman@jhurliman.org* (1 package)
- **Niklas von Hertzen** *niklasvh@gmail.com* (1 package)
- **James Kyle** *me@thejameskyle.com* (1 package)
- **Shuhei Kagawa** *shuhei.kagawa@gmail.com* (1 package)
- **Ankit** *ankitbug94@gmail.com* (1 package)
- **Henry Zhu** *hi@henryzoo.com* (1 package)
- **staltz.com** (1 package)
- **Logan Smyth** *loganfsmyth@gmail.com* (1 package)
- **Luis Couto** *hello@luiscouto.pt* (1 package)
- **Dmitry Nizovtsev** (1 package)
- **Iskren Ivov Chernev** *iskren.chernev@gmail.com* (1 package)
- **Tim Radvan** *tim@tjvr.org* (1 package)
- **Craig Campbell** (1 package)
- **Lauri Rooden** (1 package)
- **Hardmath123** (1 package)
- **Olivier Scherrer** *pode.fr@gmail.com* (1 package)
- **Lukas Geiger** (1 package)
- **Nathan Cartwright** *fshost@yahoo.com* (1 package)
- **Matt Zabriskie** (1 package)
- **Jeremy Stashewsky** *jstash@gmail.com* (1 package)
- **Andrew Nesbitt** *andrewnez@gmail.com* (1 package)
- **Andrey Okonetchnikov @okonetchnikov** (1 package)
- **fengmk2** *fengmk2@gmail.com* (1 package)
- **AJ ONeal** *awesome@coolaj86.com* (1 package)
- **Bjørge Næss** (1 package)
- **Alex Indigo** *iam@alexindigo.com* (1 package)
- **Shannon Moeller** *me@shannonmoeller* (1 package)
- **Caolan McMahon** *caolan.mcmahon@gmail.com* (1 package)
- **Sam Roberts** *sam@strongloop.com* (1 package)
- **Elijah Insua** *tmpvar@gmail.com* (1 package)
- **Mike Hall** *mikehall314@gmail.com* (1 package)
- **Forrest L Norvell** *forrest@npmjs.com* (1 package)
- **dead-horse** *dead_horse@qq.com* (1 package)
- **Tim Caswell** *tim@creationix.com* (1 package)
- **Daijiro Wachi** (1 package)
- **Adam Baldwin** (1 package)
- **Samuel Reed** (1 package)
- **Tim Koschützki** *tim@debuggable.com* (1 package)
- **Tapani Moilanen** *moilanen.tapani@gmail.com* (1 package)
- **jb55** (1 package)
- **Braveg1rl** *braveg1rl@outlook.com* (1 package)
- **Lupo Montero** (1 package)
- **Mark Cavage** *mcavage@gmail.com* (1 package)
- **The Linux Foundation** (1 package)
- **Joseph Wynn** *joseph@wildlyinaccurate.com* (1 package)
- **TweetNaCl-js contributors** (1 package)
- **Sam Mikes** *smikes@cubane.com* (1 package)
- **Zeke Sikelianos** *zeke@sikelianos.com* (1 package)
- **yisi** *yiorsi@gmail.com* (1 package)
- **Mario Casciaro** (1 package)
- **Axel Rauschmayer** *axe@rauschma.de* (1 package)
- **Artem Medeusheyev** *artem.medeusheyev@gmail.com* (1 package)
- **CoderPuppy** *coderpup@gmail.com* (1 package)
- **Luis Rodrigues** (1 package)
- **Ivan Nikulin** *ifaaan@gmail.com* (1 package)
- **Gal Koren** (1 package)
- **Javier Blanco** *http://jbgutierrez.info* (1 package)
- **Veselin Todorov** *hi@vesln.com* (1 package)
- **Dan Pupius** *dan@obvious.com* (1 package)
- **Dan Pupius** *dan@medium.com* (1 package)
- **Nick Santos** *nicholas.j.santos@gmail.com* (1 package)
- **Ethan Davis** (1 package)
- **Vladimir Agafonkin** (1 package)
- **Ozgur Ozcitak** *oozcitak@gmail.com* (1 package)
- **C. Scott Ananian** (1 package)
- **Josh Wolfe** *thejoshwolfe@gmail.com* (1 package)
- **Joshua I. Miller** *unrtst@cpan.org* (1 package)
- **Federico Zivolo** *federico.zivolo@gmail.com* (1 package)
- **leo** (1 package)
- **Justineo** *justice360@gmail.com* (1 package)
- **Mark Dalgleish** (1 package)
- **Dale Harvey** *dale@arandomurl.com* (1 package)
- **James Long** (1 package)
- **Dan VerWeire** (1 package)
- **Kris Kowal** *kris@cixar.com* (1 package)
- **Jesse Tane** *jesse.tane@gmail.com* (1 package)
- **Chris Dickinson** *chris@neversaw.us* (1 package)
- **Tab Atkins Jr.** (1 package)
- **Scott Sauyet** *scott.sauyet@gmail.com* (1 package)
- **Vladimir Zapparov** *dervus.grim@gmail.com* (1 package)
- **Justin McCandless** (1 package)
- **Alex Reardon** *areardon@atlassian.com* (1 package)
- **Ariya Hidayat** *ariya.hidayat@gmail.com* (1 package)
- **Vivek Kumar Bansal** *contact@vkbansal.me* (1 package)
- **Malte Wessel** (1 package)
- **HackerOne** (1 package)
- **Maja Wichrowska** *maja.wichrowska@airbnb.com* (1 package)
- **Tjatse** (1 package)
- **Param Aggarwal** (1 package)
- **Joshua Comeau** *joshwcomeau@gmail.com* (1 package)
- **Joseph Puzzo** *jgpuzzo2@gmail.com* (1 package)
- **Chris Pearce** *hello@chrispearce.me* (1 package)
- **Xiao Lin** (1 package)
- **Ayrton De Craene** *im@ayrton.be* (1 package)
- **Paul Le Cam** *paul@ulem.net* (1 package)
- **Caleb Morris** *caleb.morris.g@gmail.com* (1 package)
- **Ken Hibino** *ken.hibino7@gmail.com* (1 package)
- **Pete Cook** *pete@cookpete.com* (1 package)
- **Vojtech Miksu** *vojtech@miksu.cz* (1 package)
- **Diego Oliveira** (1 package)
- **Berkeley Martinez** *berkeley@berkeleytrue.com* (1 package)
- **maisano** (1 package)
- **Maxim Vorobjov** *maxim.vorobjov@gmail.com* (1 package)
- **Josh Perez** *josh@goatslacker.com* (1 package)
- **wwayne** (1 package)
- **Stéphane Monnot** (1 package)
- **joshwnj** (1 package)
- **Yaniv Zimet** *yaniv.zimet@airbnb.com* (1 package)
- **Felipe Vargas** *felipe@fvgs.ai* (1 package)
- **Joe Lencioni** *joe.lencioni@airbnb.com* (1 package)
- **Facebook** (1 package)
- **MoOx** (1 package)
- **James Burke** *jrburke@gmail.com* (1 package)
- **Apsl** *info@apsl.net* (1 package)
- **Elger Lambert** *elgerlambert@gmail.com* (1 package)
- **Eugene Rodionov** (1 package)
- **Arnaud Benard** *arnaudm.benard@gmail.com* (1 package)
- **Vicente de Alencar** (1 package)
- **Jeroen Engels** *jfm.engels@gmail.com* (1 package)
- **Daniel Brockman** *@dbrock* (1 package)
- **Benjamin Tan** *demoneaux@gmail.com* (1 package)
- **'Julian Viereck'** *julian.viereck@gmail.com* (1 package)
- **darsain** (1 package)
- **Denis Rul** *que.etc@gmail.com* (1 package)
- **lukechilds** (1 package)
- **Mikko Haapoja** *me@mikkoh.com* (1 package)
- **Adrian Heine** *http://adrianheine.de* (1 package)
- **Parsha Pourkhomami** (1 package)
- **P'unk Avenue LLC, Zachary Stenger** *zackstenger@gmail.com* (1 package)
- **Pascal Duez** (1 package)
- **Jordan Gensler** *jordangens@gmail.com* (1 package)
- **J. Tangelder** (1 package)
- **Dustin Diaz** *dustin@dustindiaz.com* (1 package)
- **Jonathan Felchlin** *jonathan@xgecko.com* (1 package)
- **Ola Holmström** (1 package)
- **Eric Ferraiuolo** *edf@ericf.me* (1 package)
- **YuzuJS** (1 package)
- **Alexandru Marasteanu** *hello@alexei.ro* (1 package)
- **Angry Bytes** *info@angrybytes.com* (1 package)
- **Marijn Haverbeke** *marijnh@gmail.com* (1 package)
- **Tiago Quelhas** *tiagoq@gmail.com* (1 package)
- **Akash Kurdekar** *npm@kurdekar.com* (1 package)
- **Daniel Wirtz** *dcode@dcode.io* (1 package)
- **Mark Lee** (1 package)
- **Bruce Williams** *brwcodes@gmail.com* (1 package)
- **Bryce B. Baril** (1 package)
- **J. Ryan Stinnett** *jryans@gmail.com* (1 package)
- **Brian Grinstead** *briangrinstead@gmail.com* (1 package)
- **KARASZI István** *github@spam.raszi.hu* (1 package)
- **Jeremy Stashewsky** *jstashewsky@salesforce.com* (1 package)
- **barsh** (1 package)
- **James Messinger** (1 package)
- **Microsoft Corp.** (1 package)
- **Kyle Mathews** *mathews.kyle@gmail.com* (1 package)
- **KyLeo** (1 package)
- **Tom MacWright** (1 package)
- **Alex Lam** *alexlamsl@gmail.com* (1 package)
- **webpack Contrib Team** (1 package)
- **Jan Bölsche** *jan@lagomorph.de* (1 package)
- **Felix Gnass** *fgnass@gmail.com* (1 package)
- **Ryan Zimmerman** *opensrc@ryanzim.com* (1 package)
- **Cameron Lakenen** *cameron@lakenen.com* (1 package)
- **Angelos Pikoulas** *agelos.pikoulas@gmail.com* (1 package)
- **Gary Court** *gary.court@gmail.com* (1 package)
- **Jared Hanson** *jaredhanson@gmail.com* (1 package)
- **Athan Reines** *kgryte@gmail.com* (1 package)
- **suchipi** *me@suchipi.com* (1 package)
- **Nolan Lawson** *nolan.lawson@gmail.com* (1 package)
- **Berkeley Martinez** *berkeley@r3dm.com* (1 package)
- **Stefan Kleeschulte** (1 package)
- **Liad Yosef** (1 package)
- **Dmitrii Karpich** *meettya@gmail.com* (1 package)
- **Zoltan Kochan** (1 package)
- **Alberto Pose** *albertopose@gmail.com* (1 package)
- **Ryan McGrath** *ryan@venodesigns.net* (1 package)
- **Einar Otto Stangvik** *einaro.s@gmail.com* (1 package)
- **Marek Kubica** *marek@xivilization.net* (1 package)
- **jindw** *jindw@xidea.org* (1 package)
- **Michael de Wit** (1 package)
- **Adonis Fung** *adon@yahoo-inc.com* (1 package)
- **stuartlarsen@yahoo-inc.com** (1 package)
- **Kevin Roark** (1 package)