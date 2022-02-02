<template>
  <GenericDialog
      header_text="Hilfestellung"
      max_width="65rem"
      max_height="65vh"
      @close="onCancel"
  >
    <h3>Mithilfe des OntoExplorers kann man einen Einblick in
      SPARQL-Endpunkte des Semantic Web erhalten.
      Das beinhaltet das Explorieren durch, das Recherchieren nach und das Filtern von
      RDF-Datensätzen in diesen Endpunkten.</h3>
    <table>
      <tr>
        <td><span class="material-icons">public</span></td>
        <td><b>Führt zur Projekt-Webseite.</b></td>
      </tr>
    </table>
    <h3>Wissensbasis</h3>
    <p>In dieser Komponente können die gewünschten SPARQL-Endpunkte,
      in denen recherchiert werden soll, ausgewählt werden.
      Es gibt aber auch weitere Funktionen:</p>
    <table>
      <tr>
        <td><span class="material-icons">edit</span></td>
        <td><b>Bearbeiten eines Endpunktes.</b></td>
      </tr>
      <tr>
        <td></td>
        <td>Es können Änderungen am Kurznamen oder der URL eines Endpunktes vorgenommen werden.</td>
      </tr>
      <tr>
        <td><span class="material-icons">delete</span></td>
        <td><b>Löschen eines Endpunktes.</b></td>
      </tr>
      <tr>
        <td><span class="material-icons">add</span></td>
        <td><b>Hinzufügen eines Endpunktes.</b></td>
      </tr>
      <tr>
        <td></td>
        <td>Es muss mindestens die URL eines Endpunktes angegeben werden - alternativ
          auch noch ein Kurzname, um einen besseren Überblick in der Wissensbasis-Liste zu erhalten.
          Der OntoExplorer prüft, ob die angegebene URL zu einem gültigen Endpunkt führt und ob dieser
          eventuell schon in der Liste vorhanden ist.
        </td>
      </tr>
      <tr>
        <td><span class="material-icons">share</span></td>
        <td><b>Exportieren der Endpunkte.</b></td>
      </tr>
      <tr>
        <td></td>
        <td>Die genutzten Endpunkte werden im JSON-Format angezeigt.
          Eine Checkliste ermöglicht es nur bestimmte Endpunkte für den Export auszuwählen.
          Nach der Auswahl kann die Anzeige kopiert und anderweitig genutzt werden.
        </td>
      </tr>
      <tr>
        <td><span class="material-icons">file_upload</span></td>
        <td><b>Importieren von Endpunkten.</b></td>
      </tr>
      <tr>
        <td></td>
        <td>Um Endpunkte im JSON-Format einzufügen, kann der Text (auch unformatiert)
          in diese Anzeige kopiert werden. Es ist auch möglich, ihn in diesem Feld noch zu formatieren.
          Sollten Fehler oder Warnungen für bestimmte Endpunkte beim Einzufügen bestehen,
          wird im folgenden Fenster darauf hingewiesen.
        </td>
      </tr>
    </table>
    <h3>Klassenhierarchie</h3>
    <p>Wenn ein oder mehrere Endpunkte ausgewählt wurden, werden in dieser Komponente alle darin
      befindlichen Klassen angezeigt. Hinter den Klassen wird die Anzahl der darin befindlichen Instanzen
      in Klammern angezeigt. Ein Klick auf den Namen füllt dann die <b>Liste der Elemente</b> mit diesen Instanzen.</p>
    <table>
      <tr>
        <td><span class="material-icons">chevron_right</span></td>
        <td><b>Klasse enthält Unterklassen.</b></td>
      </tr>
      <tr>
        <td></td>
        <td>Ein Klick auf den Namen zeigt die Instanzen der Oberklasse an,
          ein Klick auf den Pfeil klappt die Unterklassen aus,
          in denen dann ebenso recherchiert werden kann.
        </td>
      </tr>
    </table>
    <h3>Liste der Elemente</h3>
    <p>Hier werden alle Instanzen aus der ausgewählten Klasse des Endpunktes angezeigt.
      Im Fußbereich der Komponente befindet sich die Anzahl der angezeigten Elemente und ein
      Drop-Down-Menü um die Trefferanzahl auf einer Seite einzustellen.</p>
    <table>
      <tr>
        <td><span class="material-icons">share</span></td>
        <td><b>Teilen der momentanen Ansicht.</b></td>
      </tr>
      <tr>
        <td></td>
        <td>Es wird eine URL generiert, um die momentane Ansicht des OntoExplorers zu teilen.
          Voraussetzung ist, dass die gleichen Endpunkte auf beiden Seiten vorhanden sind.
        </td>
      </tr>
    </table>
    <p>Beim Klick auf eine Instanz in der Liste ändert sich diese Komponente zu <b>Eigenschaften von <i>Instanzname</i></b>.
    </p>
    <h3>Attribute</h3>
    <p>Mithilfe der Attributauswahl kann die Liste der Instanzen einer Klasse gefiltert werden,
      ohne jedes Element einzeln aufzurufen. Beim Auswählen eines Attributs ändert sich sofort die
      Listenansicht der Elemente und fügt dieses in einer neuen Spalte hinzu. Elemente, die dieses
      Attribut nicht besitzen haben in dieser Spalte eine Zeile mit "-".</p>
    <h3>Eigenschaften von <i>Instanzname</i></h3>
    <p>Alle Attribute einer angeklickten Instanz werden hier tabellenartig aufgelistet.
      Befinden sich Symbole vor Daten in dieser Tabelle heißt das, dass mehr Informationen vorliegen.
      Mit klickbaren Links gelangt man auf die Eigenschaften-Seite der jeweiligen Instanz.</p>
    <table>
      <tr>
        <td><span class="material-icons">link</span></td>
        <td><b>Öffnen der Original-Ressource in einem neuen Tab.</b></td>
      </tr>
      <tr>
        <td><span class="material-icons">chevron_right</span></td>
        <td><b>Öffnen einer Untertabelle mit den Eigenschaften der jeweiligen Instanz.</b></td>
      </tr>
    </table>
  </GenericDialog>
</template>

<script lang="ts" src="./HelpDialog.ts">
</script>

<style lang="scss" scoped>

.material-icons {
  font-size: 20px;
  display: block;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
}

</style>
