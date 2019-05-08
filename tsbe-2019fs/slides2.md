class: center, middle
# Web-Programmieren 2

TSBE Frühlingssemester 2019  
`http://smlz.github.io/tsbe-2019fs/web/`  

Pawel Kowalski
`pawel.kowalski@orbit7.ch`

.footnote.bottom[<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="/assets/by-sa.svg" /></a>]

---

# Kursübersicht

1. Einführung, HTML, UX-Desing, Projektstart

2. **CSS, CSS-Frameworks, Einführung JavaScript**

3. JavaScript, MVVM-Framework (vue.js), Projektarbeit

4. Routing, einfaches Backend, Projektarbeit

5. Build-Tools, Präsentationen, Praxistipps

---

# Heute

1. CSS

2. Gruppenarbeit: CSS-Frameworks

3. Person des Tages: John McCarthy

4. Einführung JavaScript

5. Projektarbeit

---

# CSS

* Formateigenschaften beschreiben die Formatierung

* Der CSS-Selektor beschreibt, auf welches Element die Formatierung angewandt wird.

---

# CSS Eigenschaften

* Direkt im Tag (nicht empfohlen):
```html
<span style="border: 5px solid blue">Hallo</span>
```
<span style="border: 5px solid blue">Hallo</span>

* Im `style`-Tag, im `head` der HTML-Datei:
```HTML
<style>
        .mitRand {
            border: 3px dotted darkgray;
        }
</style>
...
<span class="mitRand">Guten Tag</span>
```
<style>.mitRand {border: 3px dotted darkgray;}</style>
<span class="mitRand">Guten Tag</span>

* In einer externen Datei:
```html
<link rel="stylesheet" href="styles.css">
```
---

# CSS-Selektoren: <br/>Einfache Elemente

####CSS  
```CSS
*td {
    border: solid black 2px;
}
```
####HTML
```HTML
<table>
  <tr>
*     <td >Diese Zelle hat einen Rand</td>
*     <td>... und diese auch!</td>
  </tr>
</table>
```
---
# CSS-Selektoren: <br/>Klassen

####CSS
```CSS
*td.mitRand {
    border: solid black 2px;
}
```
####HTML
```HTML
<table>
  <tr>
*     <td class="mitRand">Diese Zelle hat einen Rand</td>
      <td>... und diese keinen!</td>
  </tr>
</table>
```
---
# CSS-Selektoren: <br/>Geschachtelte Elemente

####CSS
```CSS
*table.mitRand td {
    border: solid black 2px;
}
```
####HTML
```HTML
<table class="mitRand">
  <tr>
*     <td>Diese Zelle hat einen Rand</td>
  </tr>
</table>
<table>
  <tr>
      <td>... und diese keinen!</td>
  </tr>
</table>
```
---
# CSS-Selektoren: <br/>Direkte Kinder

####CSS
```CSS
*table > tr > td {
    border: solid black 2px;
}
```
####HTML
```HTML
<table>
  <th>
    <td>Kein Rand hier :-(</td>
  <th>
  <tr>
*      <td class="mitRand">Dafür hier</td>
  </tr>
</table>
```
---
# CSS-Selektoren: <br/>Geschwister

####CSS
```CSS
*td.mitRand, td.mitRand + td {
    border: solid black 2px;
}
```
####HTML
```HTML
<table>
  <tr>
*     <td class="mitRand">Diese Zelle hat einen Rand</td>
*     <td>... und diese auch!</td>
  </tr>
</table>
```
---
# CSS-Selektoren: IDs

####CSS
```CSS
*#mitRand {
    border: solid black 2px;
}
```
####HTML
```HTML
<table>
  <tr>
*     <td id="mitRand">Diese Zelle hat einen Rand</td>
      <td>... und hier wieder mal keiner!</td>
  </tr>
</table>
```

ID-Attribute haben in einem HTML einen speziellen Status, denn sie dürfen in
jedem Dokument genau einmal verwendet werden.

---
# Tutorials

* MDN Tutorials:
  * [Simple selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Simple_selectors)
  * [Values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Values_and_units)


* Code Academy (Registrierung erforderlich)
  * [Learn CSS](https://www.codecademy.com/learn/learn-css)

---

# John McCarthy
.middle.center[![John McCarthy](jmc.jpg)]

.center[Entdecker von LISP]

---

# JavaScript Geschichte

* 1995 Brendan Eich bei Netscape (10 Tage)

* Standardisierte Version: ECMAScript (aktuell ES6)

* Assembler des Webs

---
# Features

* Dynamisch typisiert

* Keine Klassen. Prototypen!

* Funktionen sind auch Objekte

* Läuft im Browser; wird als Sourcecode ausgeliefert, keine Kompilation

* Keine Threads, Event-Basiert

---
class: center, middle
# Grösstes Feature

## &nbsp;

---
class:center, middle
# Grösstes Feature

## Die Absenz von Features

---
# Wie sieht JS aus?


```JavaScript
function add(a, b) {
    return a + b;
}

var y = 5;
var x = 3 + y;
var z = add(x, y);

console.log(z);
```
---

# Objekte in JavaScript

Objekte können mit `new` oder mit dem Objekt-Literal `{}` kreiert werden.

```javascript
var x = new Object();
var y = {};
```

```javascript
// Neues Objekt direkt erstellen
var car = {
    make: "Ford",
    model: "Mustang"
};

// Zugriff auf Felder eines Objektes auch mit eckigen Klammern
car['year'] = 1978;

// Methode zum Objekt hinzufügen
car.printInfo = function() {
    console.log(this.make + " " + this.model + " (" + this.year + ")");
}
car.printInfo();
```
---

# JavaScript Arrays

Arrays werden mit den eckigen Klammern erstellt.
```JavaScript
var a = [1, 2, 3, 4, 5];

// Arrays beginnen wie üblich bei 0
console.log(a[0]);

var i;

for(i = 0; i < a.length; i += 1) {
    console.log(a[i]);
}
```

---
# Zahlen &mdash;  Ein Trauerspiel?

Alle Zahlen in JavaScript sind Fliesskommazahlen. Es gibt keine Integer


```JavaScript
console.log(0.1 + 0.2);    // 0.30000000000000004
```

Zahlen sind auch Objekte:

```JavaScript
var x = 123.456;
x.toString();   // "123.456"
x.toFixed(2);   // "123.46"
```

Zahlen in Strings umwandeln:

```JavaScript
parseInt("123", 10);        // 123
parseFloat("1.234", 10);    // 1.234
```

---
# Strings (Unicode)

```JavaScript
var str = "Das ist ein String";
var str2 = "中文 español English हिन्दी বাংলা русский 日本語 ਪੰਜਾਬੀ 한국어"
```


Zugriff auf einzelne Zeichen (Characters)

```JavaScript
var str = "Das ist ein String";
var x = str[4];   // "i"
```
---
# Funktionen

Funktionen können auf zwei Arten definiert werden.

Mit der Funktions-*Anweisung*:
```JavaScript
function cube(x) {
    return x * x * x;
}
```

oder als annonymer Funktions-*Ausdruck*, dessen Ergebnis man dann in einer Variable abspeichern kann:
```JavaScript
var cube = function(x) {
    return x * x * x;
}
```

---
# Asynchrone Funktionen


```JavaScript
async function ... {
}
```

---
# Funktionen sind Objekte

Man kann sie als Argumente übergeben:
```JavaScript
// Schreibt hello nach 1000ms
function sayHello() {
    console.log('hello');
}

setTimeout(sayHello, 1000);
```

... oder als von einer Funktion zurückgeben:
```JavaScript
// Gibt eine Funktion zurück
function makeAdder(initial) {
    // Der Wert von 'initial' geht nicht verloren, wenn makeAdder
    // fertig ist.
    return function(x) {
        return initial + x;
    }
}
var f = makeAdder(5);
console.log(f(2));      // -> 7
```
---
# Neue Objekte erstellen mit Constructor-Funktionen

Normale Funktionen können, wenn mit `new` aufgerufen, als Konstruktoren dienen.
```JavaScript
function Point(x, y) {
    // 'this' zeigt auf die neue Instanz
    this.x = x;
    this.y = y;
}

// Anwendung mit 'new'
var p = new Point(3, 4);
console.log(p.dist());  // -> 5
```
---
# Vererbung mit Prototypen

Das `prototype` Objekt der Konstruktor-Funktion dient als Vorlage für alle kreierten Objekte.

```JavaScript
// Methoden definieren über das Prototyp-Objekt
Point.prototype.dist = function () {
    return Math.sqrt(this.x*this.x + this.y*this.y);
};
```

---
# Console API

console API kann für die Ausgabe verwendet werden

```JavaScript
// print a normal message
console.log('hello');

// console print a warning message
console.warn('this is a warning');

// make a timing
console.time('loop');
var i = 10000;
while ( i-- ) {
    //console.log( i );
}
console.timeEnd('loop');
```

---
# Console API - table

console API kann auch tabelarische Ausgaben machen

```JavaScript
// json/object
abc = {'a': 12, 'b': 21}

// console print a table
console.table(abc);
```

---
# Debug API

debug API kann für die Ausgabe verwendet werden

```JavaScript

function abc(x) {
    console.log(x);
    return x;
}

debug(abc);
```

---
# Bad Parts: Globale Variablen

Wenn man das `var` vergisst, kreiert man automatisch eine globale Variable.

```JavaScript
myname = "Daniel"; // global
window.myname = "Daniel"; // global

// Ausserhalb einer Funktion
var myname = "Daniel"; // global
```

---
# Bad Parts: Man kann alles überschreiben

```JavaScript
Math.sqrt(9) // 3
Math.sqrt = function (x) {
    return x*x*x;
}
Math.sqrt(9) // 729
```

Nicht empfehlenswert!

---
# Bad Parts: Gleichheit

`==` und `!=` liefern komische Resultate:
```JavaScript
'' == 0;            // true
' \t\n' == 0;       // true
null == undefined;  // true
true + true;        // 2

"0" == false;       // true
"" == false;        // true
"0" == "";          // false
```


`===` und `!==` brauchen
```JavaScript
'' === 0;           // false
' \t\n' === 0;      // false
null === undefined; // false
```
---
# Warmup - Gruppenarbeit

* Fat arrows
* Functional JavaScript
* Destructuring
* Template literals
* let vs. var
* New array functions

---
class: middle, center
# JavaScript Zukunft

Alles <del>wird</del> **ist** gut mit ES6

---
class: center
# Tutorials

* http://www.learn-js.org/

* https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps
