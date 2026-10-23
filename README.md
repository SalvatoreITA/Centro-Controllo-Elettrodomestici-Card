# DomHouse – Card Centro Controllo Elettrodomestici

Card Lovelace per **Home Assistant** che mostra, in un'unica scheda, tutto ciò che il custom component [**domhouse_elettrodomestici**](../custom_components/domhouse_elettrodomestici/README.md) genera per un elettrodomestico: stato, durata e consumi del ciclo, split per fonte (fotovoltaico / batteria / rete), energia pulita, statistiche e controlli.

La card **si disegna da sola** a partire dallo *slug* del device: niente dipendenze (no card-mod, no button-card), niente lista di entità da scrivere a mano.

- **Versione:** 3.0
- **Tipo:** `custom:domhouse-elettrodomestico-card`
- **Dipendenze:** nessuna (solo il custom component DomHouse)
- 🌐 [www.domhouse.it](https://domhouse.it/centro-controllo-elettrodomestici-in-home-assistant/)

---

## Indice

- [Caratteristiche](#caratteristiche)
- [Installazione](#installazione)
- [Configurazione](#configurazione)
- [Editor grafico](#editor-grafico)
- [Comportamento adattivo](#comportamento-adattivo)
- [Illustrazioni](#illustrazioni)
- [Sezioni della card](#sezioni-della-card)
- [Entità usate](#entità-usate)
- [Note e risoluzione problemi](#note-e-risoluzione-problemi)

---

## Caratteristiche

- **Auto-generante**: basta lo slug del device, la card ricava da sola tutte le entità.
- **Adattiva alle fonti**: mostra "Da FV" e "Da batteria" solo se le hai; chi non ha il fotovoltaico vede un layout dedicato con la **potenza istantanea**.
- **Hero dinamico**: durata del ciclo (in corso / ultimo), illustrazione animata dell'elettrodomestico, cerchio con % di energia pulita o potenza.
- **Barre di ripartizione** colorate e proporzionali (Totale / Da FV / Da batteria / Da rete).
- **Statistiche** oggi / mese / anno, ultimo ciclo, storico 7 giorni.
- **Sezione Controllo** integrata: presa, canali notifiche, fascia oraria, spegnimento automatico, reset contatori.
- **~30 illustrazioni** di elettrodomestici, animate quando l'apparecchio è in funzione.
- Tema chiaro/scuro, nessuna dipendenza esterna.

---

## Installazione

1. Copia `domhouse-elettrodomestico-card.js` in `config/www/`.
2. **Impostazioni → Dashboard → ⋮ → Risorse → Aggiungi risorsa**
   - URL: `/local/domhouse-elettrodomestico-card.js`
   - Tipo: **Modulo JavaScript**
3. Aggiungi una scheda **manuale** alla dashboard (vedi sotto).

> Dopo ogni aggiornamento del file, ricarica con **Ctrl+Shift+R** per bypassare la cache del browser.

---

## Configurazione

Esempio minimo:

```yaml
type: custom:domhouse-elettrodomestico-card
appliance: lavatrice
```

Esempio completo:

```yaml
type: custom:domhouse-elettrodomestico-card
appliance: lavatrice      # slug del device (OBBLIGATORIO)
name: Lavatrice           # opzionale: titolo mostrato in alto
icona: lavatrice          # opzionale: illustrazione (default: presa)
potenza_max: 2500         # opzionale: fondo scala W per barre e cerchio (default 3000)
```

| Opzione | Obbligatoria | Default | Descrizione |
|---------|:---:|---------|-------------|
| `appliance` | ✅ | — | Lo **slug** del device DomHouse (es. `lavatrice`). È il nome del device reso minuscolo con gli spazi in `_`. |
| `name` | — | dallo slug | Titolo mostrato in testata. |
| `icona` | — | `presa` | Illustrazione (vedi [elenco](#illustrazioni)). |
| `potenza_max` | — | `3000` | Fondo scala in W: regola il riempimento delle **barre** e del **cerchio potenza** (utile per tarare su phon, PC, forno, ecc.). |

Per più elettrodomestici: una card ciascuno, cambiando `appliance` e `icona`.

---

## Editor grafico

La card ha un editor visuale (Modifica scheda → la trovi nell'elenco card, oppure ⚙️). Puoi impostare:
- **Elettrodomestico (slug del device)**
- **Nome**
- **Illustrazione** (menu a tendina)
- **Fondo scala potenza · W (barre e cerchio, default 3000)**

In fondo all'editor trovi il credito *Salvatore Lentini · DomHouse.it · v3.0*.

---

## Comportamento adattivo

La card controlla **quali entità esistono** e cambia layout di conseguenza.

### Con fotovoltaico e/o batteria
- **Cerchio** in alto a destra: **% di energia pulita** del ciclo (FV + batteria), in verde.
- **Barre**: Totale, Da FV, Da batteria (se presente), Da rete — ciascuna colorata e proporzionale alla potenza sul **fondo scala** (`potenza_max`). La somma delle fonti corrisponde al Totale.
- Le voci che non ti riguardano spariscono (niente "Da batteria" se non hai l'accumulo).

### Senza fotovoltaico né batteria
- Le barre vengono **nascoste** (non servono: è tutto da rete).
- Il cerchio diventa la **potenza istantanea in W**, colore **rosso**, e si riempie in proporzione al consumo sul fondo scala (`potenza_max`, default 3000 W → a 1500 W il cerchio è a metà).
- La sezione *Ciclo in corso* mostra solo **Energia** e **Costo**, centrati.

| | Con FV/batteria | Senza FV/batteria |
|---|---|---|
| Cerchio | % pulita (verde) | Potenza W (rosso) |
| Barre | Totale/FV/batteria/rete | nascoste |
| Tile ciclo | Energia, FV, (batteria), rete, Costo | Energia, Costo |

---

## Illustrazioni

Valori ammessi per `icona` (si animano quando l'elettrodomestico è **in funzione**):

`lavatrice`, `asciugatrice`, `lavasciuga`, `lavastoviglie`, `forno`, `microonde`, `friggitrice_aria`, `frigo`, `congelatore`, `piano_cottura`, `scaldabagno`, `phon`, `macchina_caffe`, `bimby`, `deumidificatore`, `climatizzatore`, `pc`, `presa`, `ferro`, `ventilatore`, `stufetta`, `tv`, `console`, `wallbox`, `pompa_calore`, `aspirapolvere`, `pompa_acqua`, `bollitore`, `tostapane`, `stampante_3d`.

Se `icona` non è valida, viene usata `presa`.

---

## Sezioni della card

Dall'alto in basso:

1. **Testata** — nome, sottotitolo, stato (*In funzione* / *Fermo*).
2. **Hero** — durata del ciclo (in corso o ultimo), illustrazione animata, cerchio (pulita o potenza).
3. **Barre** — ripartizione della potenza per fonte (solo con FV/batteria).
4. **Ciclo in corso / Ultimo ciclo** *(a scomparsa)* — Energia, Da FV, Da batteria, Da rete, Costo.
5. **Statistiche** *(a scomparsa)* — tab Oggi / Mese / Anno (Energia, Costo, Cicli, Tempo), ultimo ciclo (Fine/Durata/Costo), tabella ultimi 7 giorni.
6. **Controllo** *(a scomparsa)* — vedi sotto.

> Le tre sezioni a tendina (**Ciclo in corso**, **Statistiche**, **Controllo**) partono **sempre chiuse** a ogni apertura della card. Le apri con un tocco; rientrando tornano chiuse.

### Sezione Controllo
- **Presa**: accendi/spegni la presa smart (se configurata).
- **Spegnimento automatico**: abilita lo spegnimento a orario e imposta l'ora.
- **Notifiche**: interruttori **Push / Google / Alexa / HA** e **fascia oraria** (Google/Alexa) per le notifiche di fine ciclo gestite dal blueprint.
- **Contatori**: pulsante **reset** (con conferma), chiama `domhouse_elettrodomestici.reset`.

---

## Entità usate

La card costruisce gli `entity_id` come `<dominio>.<slug>_<suffisso>` a partire da `appliance`. Esempi con `appliance: lavatrice`:
`binary_sensor.lavatrice_in_funzione`, `sensor.lavatrice_potenza`, `sensor.lavatrice_potenza_da_fotovoltaico`, `sensor.lavatrice_potenza_da_batteria`, `sensor.lavatrice_potenza_da_rete`, `sensor.lavatrice_energia_pulita_ciclo`, `sensor.lavatrice_energia_ciclo`, `sensor.lavatrice_durata_ciclo`, `sensor.lavatrice_costo_ciclo`, le statistiche `..._energia_oggi/mese/anno`, `switch.lavatrice_presa`, `time.lavatrice_spegnimento_automatico`, ecc.

Se un'entità **non esiste** (es. non hai la batteria), la relativa riga/tile semplicemente non viene mostrata.

---

## Note e risoluzione problemi

- **Lingua**: gli `entity_id` del component sono generati da HA dai nomi in **italiano**. La card presuppone quella lingua; con HA in un'altra lingua gli slug cambiano e la card non troverebbe le entità.
- **Slug del device**: se non sei sicuro, in *Impostazioni → Dispositivi e servizi → \[il device\]* guarda un'entità (es. `sensor.<slug>_potenza`): la parte prima di `_potenza` è lo slug da mettere in `appliance`.
- **La card non si aggiorna dopo un update** → è la cache: **Ctrl+Shift+R**, o svuota la cache delle risorse Lovelace.
- **L'illustrazione non si muove** → si anima **solo** quando l'elettrodomestico è *In funzione*; da fermo è statica (è voluto).

---

© DomHouse.it — Salvatore Lentini
