# UX Test

All the documentation is in german

## Szenario

Du planst deine Mahlzeiten einmal pro Woche, um alle benötigten Zutaten für deine Rezepte effizient an einem Tag einzukaufen. Kürzlich hast du von einer App erfahren, die es dir ermöglicht, deine eigenen Rezepte samt Zutaten zu erfassen. Zusätzlich kannst du auf öffentliche Rezepte von anderen Benutzern zugreifen. Mit diesen Funktionen kannst du bequem deine Wochenplanung für Mittag- und/oder Abendessen organisieren.

Stelle dir vor, du möchtest die App ausprobieren, um deine wöchentliche Essensplanung zu vereinfachen.

## Startpunkt

- Startpunkt: https://foolist-planning.vercel.app/
- Credentials: Du erstellt einen neuen Account mit der Email ux@test.ch und ein Passwort deiner Wahl.


## Instruktionen

- Erfasse ein Rezept:
    Erstelle ein neues Rezept, das nur für dich sichtbar ist. Nutze dafür das folgende Rezept: [Spaghetti Aglio e Olio](https://fooby.ch/de/rezepte/16252/spaghetti-aglio-e-olio)
    Stelle sicher, dass alle Zutaten korrekt eingetragen sind.

- Plane Abendessen für zwei Personen:
    Da du werktags arbeitest und kein Homeoffice hast, möchtest du die App nur für die Planung des Abendessens für zwei Personen nutzen.

- Integriere dein neu erstelltes Rezept:
    Plane dein soeben erstelltes Rezept sowie zwei weitere spezifische Gerichte deiner Wahl für die kommende Woche ein.

- Effiziente Auswahl für die restlichen Tage:
    Für die verbleibenden vier Tage der Woche möchtest du Gerichte auswählen, die mit möglichst wenig Aufwand geplant werden können. Nutze, wenn möglich, Funktionen der App, die dir die Auswahl erleichtern (z. B. Vorschläge, Schnellplanung, Favoriten).

- Einkaufsliste verwenden:
    Nach der Planung willst du deine Einkaufliste einsehen.


## Durchführung Test

### Durchführung UX Test Anonym1

Person hat Übersichtsseite ganz kurz überflogen und ist mit dem Login Link auf dem Homescreen abgesprungen.
Danach die Aufgabenstellung nochmals kurz angeschaut ob Login oder Signup benutzt werden soll.

Auf der Übersichtsseite (loged in) den Button "Create and edit recipes" benutzt.
Button "Add New Recipe" schnell gefunden.
Copy Paste von Titel und URL des Vorgegebenen Rezeptes.

Serving Size konnte das 1 nicht gelöscht werden. Umständlich markiert und überschrieben => verbessern

Description angeschaut und gesehen, dass es Optional ist mit dem Kommentar "Vermutlich ist das wenn man es auch für andere erfasst mit Instruktionen"

Die Testperson hat für das Rezept die Kategorien "Fast", "Vegan" und "Soulfood" angewählt. 

Mit dem Hinweis in der Zutatenliste wie diese erfasst werden konnte, hat die testende Person die Zutaten von Fooby kopiert, unnötige "Zutaten" wie "Salzwasser, siedend" entfernt und Angaben entsprechend der Vorgabe formatiert



Label privat gelesen, und korrekt eingeschätzt das ein Rezept nur für die Testperson erfasst werden soll, und somit aktiviert.

Rezept entsprechend abgespeichert.

Direkt zu "Week Planning" in der Menu Leiste gesprungen.

Gelesen das aktuell keine Planung vorhanden ist und Button gesucht um diese zu erstellen, und entsprechend eine Planung erstellt.
Einstellungen wurden nicht benutzt, stattdessen wurden die Mittagsessen einfach ignoriert.

Für einen zufälligen Tag hat die Testperson das erstellte Rezept "Spaghetti Aglio e Olio" ausgewählt via "Add Recipe" Button
Für zwei weitere Tage via "Add Receipe" Button die Liste durchgegangen und etwas ausgewählt.
Für die restlichen Abendessen wurde der "Random" Button benutzt. Hier wurden 3 mal Rezepte ausgewählt, welche bereits eingeplant waren, danach wurde nochmals "Random" Button benutzt. => Vermutlich sollten Rezepte ausgeschlossen werden, welche bereits eingeplant sind.

Die Testperson hat nach der Planung kurz etwas gesucht wo die Einkaufsliste zu finden ist (eventuell auf der Planungsseite vermutet) und dann in der Navigationsleiste die "Shopping List" entdeckt.

Kurz überflogen und als sinnvoll eingeschätzt. Eine Zahl wurde als 1333.33333333 dargestellt, was mit Humor genommen wurde => Entsprechende Rundung einbauen

Da die Shopping List aktuell sehr wenig Funktion bietet habe ich noch nach gewünschter Funktionen / Erwartungen gefragt.
Testperson Input:
- Vor dem einkaufen eine Möglichkeit, die vorhandenen Zutaten zu löschen / streichen.
- Während dem Einkaufen die Zutaten abhacken, welche man bereits hat.
- Download Button bieten (Printansicht ist ganz in Ordnung, benötigt aktuell noch etwas viel Platz)

Weitere Inputs:
- Wochenplanung eventuell einstellen können, mit welchem Tag dieser beginnt für geistige Planung

## Zusammenfassung Erkenntnisse

### Sofortige Verbesserungen 

Serving Size muss gelöscht werden könnnen ❌
Rundung einbauen bei Zutaten für die Einkaufsliste ❌

### Generelle Erkenntnisse

"Bookmarking" wurde nicht gesehen. Die Testperson meinte aber im Nachhinein auch, dass man ja im beim Hinzufügen auch Suchen könnte, beim Hinweis das es eventuell angenehmer wäre auf der Rezept Übersicht.
Auch wenn Bilder hinzugefügt werden, würde sie eher über den Titel des Rezeptes auswählen, womit der Dropdown genügend ist.
=> Dies ist wohl eher Personenspezifisch und kann nicht als generell angesehen werden.

Settings sind eventuell schwierig zu finden. Vieleicht benötigt es einen Hinweis in der Planung dazu.
Eventuell beim nächsten Test eine Planung für 4 Personen als Instruktion erstellen, da dort die Random Assignments die falsche Anzahl Personen als Default hätte.

Assign random dinners wurde ziemlich sicher kurz angeschaut aber nicht benutzt. Eventuell sollte im nächsten Test zwei Planungen erstellt werden um zu sehen ob die Funktion gefunden wird und sich entsprechend den Erwartungen der Testpersonen verhält.

### Verbesserungen für die Zukunft

- "Random" Button für einzelne Tage soll Rezepte ausschliessen, welche bereits eingeplant sind
- Einkaufsliste bereits vorhandene Zutaten löschen lassen.
- Einkaufsliste Zutaten für während dem Einkauf abhacken lassen via Swipe
- Einkaufslistge Download Button (Browser Print Funktion?) und die Printansicht Platzsparender machen.
- Einstellung mit welchem Tag die Woche beginnt bei der Wochenplanung.

- Eventuell Bookmarking versuchen intutivier zu machen oder Funktion ändern?