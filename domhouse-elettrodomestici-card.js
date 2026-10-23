/*!
 * DomHouse - Card Centro Controllo Elettrodomestici
 * Card Lovelace auto-generante: basta il nome (slug) dell'elettrodomestico.
 * Nessuna dipendenza esterna. Abbinata al custom component domhouse_elettrodomestici.
 *   type: custom:domhouse-elettrodomestico-card
 *   appliance: lavatrice      # slug del device (obbligatorio)
 *   name: Lavatrice           # opzionale
 *   icona: lavatrice          # opzionale: illustrazione (vedi lista)
 * Autore: Salvatore Lentini - DomHouse.it
 */
const DH_VERSION = "3.0";

// Suffissi entity_id generati dal component (nomi italiani -> slug HA)
const SUF = {
  running: ["binary_sensor", "in_funzione"], power: ["sensor", "potenza"],
  power_ftv: ["sensor", "potenza_da_fotovoltaico"], power_batt: ["sensor", "potenza_da_batteria"],
  power_grid: ["sensor", "potenza_da_rete"],
  clean: ["sensor", "energia_pulita"], clean_cycle: ["sensor", "energia_pulita_ciclo"],
  e_cycle: ["sensor", "energia_ciclo"], e_cycle_ftv: ["sensor", "energia_ciclo_da_fotovoltaico"],
  e_cycle_batt: ["sensor", "energia_ciclo_da_batteria"],
  e_cycle_grid: ["sensor", "energia_ciclo_da_rete"], e_total: ["sensor", "energia_totale"],
  dur_cycle: ["sensor", "durata_ciclo"], cost_cycle: ["sensor", "costo_ciclo"],
  cycles_total: ["sensor", "cicli_totali"], last_end: ["sensor", "fine_ultimo_ciclo"],
  last_dur: ["sensor", "durata_ultimo_ciclo"], last_cost: ["sensor", "costo_ultimo_ciclo"],
  e_oggi: ["sensor", "energia_oggi"], e_mese: ["sensor", "energia_mese"], e_anno: ["sensor", "energia_anno"],
  c_oggi: ["sensor", "costo_oggi"], c_mese: ["sensor", "costo_mese"], c_anno: ["sensor", "costo_anno"],
  cy_oggi: ["sensor", "cicli_oggi"], cy_mese: ["sensor", "cicli_mese"], cy_anno: ["sensor", "cicli_anno"],
  t_oggi: ["sensor", "tempo_oggi"], t_mese: ["sensor", "tempo_mese"], t_anno: ["sensor", "tempo_anno"],
  week: ["sensor", "riepilogo_settimana"], threshold: ["number", "soglia_di_lavoro"],
  delay_on: ["number", "ritardo_accensione"], delay_off: ["number", "ritardo_spegnimento"],
  plug: ["switch", "presa"], autooff: ["time", "spegnimento_automatico"],
  notif_push: ["switch", "notifica_push"], notif_google: ["switch", "notifica_google"],
  notif_alexa: ["switch", "notifica_alexa"], auto_enabled: ["switch", "abilita_spegnimento"],
  notif_start: ["time", "notifiche_dalle"], notif_end: ["time", "notifiche_alle"],
  notif_ha: ["switch", "notifica_ha"], last_reset: ["sensor", "ultimo_reset"],
};
const WEEKDAYS = ["lunedi", "martedi", "mercoledi", "giovedi", "venerdi", "sabato", "domenica"];
const WEEKDAYS_SHORT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

// ---- illustrazioni (una per tipo). Animazioni attive quando .wash.running ----
const LAUNDRY_DRUM = `<g class="spin"><circle cx="56" cy="80" r="23" fill="transparent"/>
  <circle cx="56" cy="72" r="7" fill="#6c8fd6"/><circle cx="64" cy="87" r="6" fill="#e889ac"/>
  <circle cx="48" cy="87" r="6" fill="#e6c86f"/><circle cx="57" cy="79" r="3.6" fill="#b79bd6"/></g>`;
function drumBody(panel) {
  return `<rect class="b" x="14" y="6" width="84" height="116" rx="12"/><line class="ln" x1="14" y1="32" x2="98" y2="32"/>
    ${panel}<circle class="p" cx="56" cy="80" r="32"/><circle class="ln" cx="56" cy="80" r="27"/>
    <circle class="glass" cx="56" cy="80" r="23"/>${LAUNDRY_DRUM}
    <rect class="d" x="27" y="122" width="9" height="6" rx="2"/><rect class="d" x="76" y="122" width="9" height="6" rx="2"/>`;
}
const PANEL_STD = `<rect class="p" x="22" y="14" width="24" height="9" rx="2"/><rect class="d" x="25" y="17.6" width="7" height="2.3" rx="1.1"/>
  <rect class="p" x="54" y="15" width="13" height="8" rx="2"/><rect class="grn" x="56" y="18" width="3.5" height="2.2" rx="1"/>
  <circle class="p" cx="84" cy="20" r="6"/><circle class="ac" cx="84" cy="17.2" r="1.6"/>`;

const ICONS = {
  lavatrice: `<svg class="dh-ic" viewBox="0 0 112 128">${drumBody(PANEL_STD)}</svg>`,
  asciugatrice: `<svg class="dh-ic" viewBox="0 0 112 128">${drumBody(PANEL_STD)}
    <path class="warms pulse" d="M42 60 q4 -4 0 -8 M56 60 q4 -4 0 -8 M70 60 q4 -4 0 -8"/></svg>`,
  lavasciuga: `<svg class="dh-ic" viewBox="0 0 112 128">${drumBody(PANEL_STD)}
    <circle class="warm pulse" cx="44" cy="58" r="2.4"/><circle class="cool" cx="68" cy="58" r="2.4"/></svg>`,
  lavastoviglie: `<svg class="dh-ic" viewBox="0 0 112 128"><rect class="b" x="16" y="6" width="80" height="116" rx="10"/>
    <line class="ln" x1="16" y1="26" x2="96" y2="26"/><rect class="d" x="40" y="14" width="32" height="5" rx="2.5"/>
    <rect class="glass" x="26" y="34" width="60" height="80" rx="8"/>
    <g class="spin"><circle cx="56" cy="74" r="30" fill="transparent"/><line class="acs" x1="36" y1="74" x2="76" y2="74"/>
    <line class="acs" x1="56" y1="56" x2="56" y2="92"/></g>
    <circle class="ac pulse" cx="56" cy="74" r="3"/></svg>`,
  forno: `<svg class="dh-ic" viewBox="0 0 112 128"><rect class="b" x="14" y="10" width="84" height="108" rx="10"/>
    <line class="ln" x1="14" y1="34" x2="98" y2="34"/><circle class="p" cx="28" cy="22" r="4"/><circle class="p" cx="44" cy="22" r="4"/>
    <rect class="d" x="60" y="19" width="30" height="5" rx="2.5"/>
    <rect class="glass" x="24" y="44" width="64" height="62" rx="8"/>
    <rect class="warm pulse" x="34" y="58" width="44" height="34" rx="6"/></svg>`,
  microonde: `<svg class="dh-ic" viewBox="0 0 128 100"><rect class="b" x="6" y="14" width="116" height="72" rx="10"/>
    <rect class="glass" x="14" y="24" width="70" height="52" rx="6"/>
    <g class="spin"><circle cx="49" cy="50" r="20" fill="transparent"/><ellipse class="p" cx="49" cy="64" rx="16" ry="5"/>
    <rect class="warm" x="45" y="42" width="8" height="16" rx="3"/></g>
    <rect class="p" x="92" y="24" width="22" height="34" rx="4"/><circle class="ac pulse" cx="103" cy="40" r="4"/>
    <rect class="d" x="94" y="64" width="18" height="4" rx="2"/><rect class="d" x="94" y="72" width="18" height="4" rx="2"/></svg>`,
  friggitrice_aria: `<svg class="dh-ic" viewBox="0 0 112 128"><rect class="b" x="24" y="10" width="64" height="108" rx="20"/>
    <rect class="p" x="34" y="20" width="44" height="18" rx="6"/><circle class="ac pulse" cx="56" cy="29" r="5"/>
    <rect class="d" x="34" y="92" width="44" height="22" rx="8"/><rect class="d" x="48" y="112" width="16" height="6" rx="3"/>
    <path class="warms pulse" d="M44 52 q4 5 0 10 M56 52 q4 5 0 10 M68 52 q4 5 0 10"/></svg>`,
  frigo: `<svg class="dh-ic" viewBox="0 0 96 128"><rect class="b" x="18" y="4" width="60" height="120" rx="10"/>
    <line class="ln" x1="18" y1="48" x2="78" y2="48"/><rect class="d" x="24" y="20" width="5" height="18" rx="2.5"/>
    <rect class="d" x="24" y="58" width="5" height="26" rx="2.5"/>
    <path class="cools" d="M60 66 v16 M54 70 l12 8 M66 70 l-12 8"/></svg>`,
  congelatore: `<svg class="dh-ic" viewBox="0 0 120 112"><rect class="b" x="10" y="20" width="100" height="72" rx="10"/>
    <line class="ln" x1="10" y1="40" x2="110" y2="40"/><rect class="d" x="78" y="28" width="22" height="5" rx="2.5"/>
    <path class="cools" d="M40 64 v12 M35 67 l10 6 M45 67 l-10 6 M74 64 v12 M69 67 l10 6 M79 67 l-10 6"/></svg>`,
  piano_cottura: `<svg class="dh-ic" viewBox="0 0 120 120"><rect class="b" x="10" y="14" width="100" height="92" rx="12"/>
    <circle class="ln" cx="40" cy="44" r="16"/><circle class="warm pulse" cx="40" cy="44" r="9"/>
    <circle class="ln" cx="80" cy="44" r="16"/><circle class="ln" cx="40" cy="80" r="13"/>
    <circle class="ln" cx="80" cy="80" r="13"/><circle class="warm pulse" cx="80" cy="80" r="7"/></svg>`,
  scaldabagno: `<svg class="dh-ic" viewBox="0 0 96 128"><rect class="b" x="20" y="8" width="56" height="88" rx="24"/>
    <circle class="p" cx="48" cy="54" r="16"/><path class="warms pulse" d="M48 46 v16"/><circle class="warm pulse" cx="48" cy="54" r="5"/>
    <line class="ln" x1="34" y1="100" x2="34" y2="116"/><line class="ln" x1="62" y1="100" x2="62" y2="116"/>
    <circle class="ac" cx="34" cy="118" r="4"/><circle class="ac" cx="62" cy="118" r="4"/></svg>`,
  phon: `<svg class="dh-ic" viewBox="0 0 128 112"><circle class="b" cx="44" cy="44" r="30"/><circle class="p" cx="44" cy="44" r="16"/>
    <path class="b" d="M58 58 l26 26 a10 10 0 0 1 -14 14 l-26 -26 z"/><rect class="d" x="60" y="98" width="24" height="8" rx="4"/>
    <path class="cools flow" d="M78 40 h18 M78 48 h14 M78 32 h14"/></svg>`,
  macchina_caffe: `<svg class="dh-ic" viewBox="0 0 112 128"><rect class="b" x="18" y="8" width="76" height="100" rx="12"/>
    <rect class="p" x="28" y="18" width="40" height="14" rx="4"/><circle class="ac pulse" cx="80" cy="25" r="4"/>
    <rect class="d" x="44" y="44" width="24" height="8" rx="3"/>
    <path class="warms rise" d="M50 58 v8 M62 58 v8"/><path class="p" d="M40 74 h32 v6 a16 16 0 0 1 -32 0 z"/>
    <rect class="d" x="36" y="100" width="40" height="8" rx="3"/></svg>`,
  bimby: `<svg class="dh-ic" viewBox="0 0 112 128"><rect class="b" x="22" y="78" width="68" height="40" rx="10"/>
    <rect class="p" x="30" y="88" width="28" height="22" rx="4"/><circle class="ac pulse" cx="78" cy="92" r="5"/>
    <path class="b" d="M38 78 l6 -46 a12 12 0 0 1 12 -10 h0 a12 12 0 0 1 12 10 l6 46 z"/>
    <g class="spin"><circle cx="56" cy="52" r="16" fill="transparent"/><path class="acs" d="M48 52 h16 M56 44 v16"/></g></svg>`,
  deumidificatore: `<svg class="dh-ic" viewBox="0 0 100 128"><rect class="b" x="16" y="6" width="68" height="116" rx="12"/>
    <line class="ln" x1="24" y1="34" x2="76" y2="34"/><circle class="ac pulse" cx="50" cy="20" r="4"/>
    <path class="cools flow" d="M30 48 h40 M30 58 h40 M30 68 h40"/>
    <path class="cool rise" d="M50 92 a5 7 0 1 1 .1 0 z"/></svg>`,
  climatizzatore: `<svg class="dh-ic" viewBox="0 0 128 96"><rect class="b" x="8" y="16" width="112" height="40" rx="12"/>
    <line class="ln" x1="16" y1="42" x2="112" y2="42"/><circle class="ac pulse" cx="100" cy="30" r="3.5"/>
    <path class="cools flow" d="M34 66 q6 8 0 16 M58 66 q6 8 0 16 M82 66 q6 8 0 16"/></svg>`,
  pc: `<svg class="dh-ic" viewBox="0 0 88 128"><rect class="b" x="16" y="6" width="56" height="116" rx="8"/>
    <line class="ln" x1="16" y1="30" x2="72" y2="30"/><circle class="ac pulse" cx="28" cy="18" r="3.4"/>
    <rect class="d" x="40" y="15" width="22" height="4" rx="2"/>
    <g class="spin-f"><circle cx="44" cy="74" r="22" fill="transparent"/><circle class="ln" cx="44" cy="74" r="20"/>
    <path class="p" d="M44 74 l0 -18 a18 18 0 0 1 12 6 z"/><path class="p" d="M44 74 l16 8 a18 18 0 0 1 -14 10 z"/>
    <path class="p" d="M44 74 l-16 8 a18 18 0 0 1 2 -24 z"/></g><circle class="ac" cx="44" cy="74" r="4"/></svg>`,
  presa: `<svg class="dh-ic" viewBox="0 0 112 128"><rect class="b" x="26" y="20" width="60" height="88" rx="18"/>
    <circle class="d" cx="46" cy="58" r="5"/><circle class="d" cx="66" cy="58" r="5"/>
    <path class="ac pulse" d="M58 72 l-10 16 h8 l-4 14 14 -20 h-8 z"/></svg>`,
  ferro: `<svg class="dh-ic" viewBox="0 0 128 112"><path class="b" d="M14 84 q0 -30 44 -34 l50 -4 a8 8 0 0 1 2 16 q-40 6 -40 26 z"/>
    <rect class="p" x="52" y="38" width="44" height="12" rx="6"/><circle class="ac pulse" cx="88" cy="44" r="3"/>
    <path class="warms rise" d="M30 96 v10 M48 96 v10 M66 96 v10"/></svg>`,
  ventilatore: `<svg class="dh-ic" viewBox="0 0 112 128"><circle class="b" cx="56" cy="50" r="42"/>
    <g class="spin-f"><circle cx="56" cy="50" r="34" fill="transparent"/>
    <path class="p" d="M56 50 q-6 -34 18 -30 q6 16 -18 30z"/><path class="p" d="M56 50 q30 -16 26 10 q-14 10 -26 -10z"/>
    <path class="p" d="M56 50 q-24 30 -30 -2 q8 -16 30 2z"/></g><circle class="ac" cx="56" cy="50" r="6"/>
    <rect class="d" x="50" y="92" width="12" height="20"/><rect class="d" x="38" y="112" width="36" height="8" rx="4"/></svg>`,
  stufetta: `<svg class="dh-ic" viewBox="0 0 120 120"><rect class="b" x="14" y="24" width="92" height="72" rx="14"/>
    <circle class="ln" cx="60" cy="60" r="26"/><path class="warms pulse" d="M48 60 h24 M60 48 v24 M51 51 l18 18 M69 51 l-18 18"/>
    <rect class="d" x="36" y="96" width="48" height="8" rx="4"/></svg>`,
  tv: `<svg class="dh-ic" viewBox="0 0 128 112"><rect class="b" x="8" y="10" width="112" height="72" rx="8"/>
    <rect class="glass" x="16" y="18" width="96" height="56" rx="4"/><path class="acs flow" d="M34 58 q14 -26 30 -14 q10 8 26 -4"/>
    <rect class="d" x="52" y="86" width="24" height="6"/><rect class="d" x="40" y="92" width="48" height="8" rx="4"/></svg>`,
  console: `<svg class="dh-ic" viewBox="0 0 128 112"><rect class="b" x="14" y="26" width="100" height="60" rx="16"/>
    <circle class="p" cx="42" cy="56" r="12"/><path class="ln" d="M42 50 v12 M36 56 h12"/>
    <circle class="ac pulse" cx="86" cy="50" r="4"/><circle class="d" cx="86" cy="64" r="4"/><circle class="d" cx="96" cy="57" r="4"/></svg>`,
  wallbox: `<svg class="dh-ic" viewBox="0 0 96 128"><rect class="b" x="18" y="8" width="60" height="84" rx="12"/>
    <rect class="glass" x="28" y="18" width="40" height="30" rx="4"/><path class="ac pulse" d="M50 24 l-8 14 h6 l-3 12 11 -16 h-6 z"/>
    <circle class="d" cx="48" cy="64" r="8"/><path class="ln" d="M48 92 v14 a10 10 0 0 0 10 10 h8"/></svg>`,
  pompa_calore: `<svg class="dh-ic" viewBox="0 0 128 112"><rect class="b" x="10" y="16" width="108" height="80" rx="12"/>
    <g class="spin-f"><circle cx="64" cy="56" r="30" fill="transparent"/><circle class="ln" cx="64" cy="56" r="28"/>
    <path class="p" d="M64 56 q-28 -8 -20 -26 q22 0 20 26z"/><path class="p" d="M64 56 q28 -8 20 -26 q-22 0 -20 26z"/>
    <path class="p" d="M64 56 q0 28 -22 22 q-8 -20 22 -22z"/></g><circle class="ac" cx="64" cy="56" r="5"/></svg>`,
  aspirapolvere: `<svg class="dh-ic" viewBox="0 0 120 120"><circle class="b" cx="60" cy="60" r="48"/>
    <circle class="ln" cx="60" cy="60" r="36"/><g class="spin"><circle cx="60" cy="60" r="36" fill="transparent"/>
    <rect class="p" x="57" y="26" width="6" height="22" rx="3"/></g><circle class="ac pulse" cx="60" cy="42" r="4"/>
    <path class="d" d="M26 88 a48 48 0 0 0 68 0 z"/></svg>`,
  pompa_acqua: `<svg class="dh-ic" viewBox="0 0 120 120"><circle class="b" cx="56" cy="60" r="38"/>
    <g class="spin-f"><circle cx="56" cy="60" r="28" fill="transparent"/><path class="acs" d="M56 60 h22 M56 60 h-22 M56 60 v22 M56 60 v-22"/></g>
    <circle class="ac" cx="56" cy="60" r="5"/><path class="cool rise" d="M94 46 a5 7 0 1 1 .1 0 z"/>
    <rect class="d" x="86" y="56" width="20" height="10" rx="3"/></svg>`,
  bollitore: `<svg class="dh-ic" viewBox="0 0 112 128"><path class="b" d="M28 54 h56 l-6 54 a10 10 0 0 1 -10 9 h-24 a10 10 0 0 1 -10 -9 z"/>
    <path class="ln" d="M84 60 q14 6 10 24"/><rect class="d" x="44" y="40" width="24" height="10" rx="4"/>
    <rect class="d" x="30" y="116" width="52" height="8" rx="3"/><circle class="ac pulse" cx="56" cy="86" r="5"/>
    <path class="warms rise" d="M46 34 v-8 M66 34 v-8"/></svg>`,
  tostapane: `<svg class="dh-ic" viewBox="0 0 128 112"><rect class="b" x="18" y="44" width="92" height="56" rx="16"/>
    <rect class="warm" x="30" y="34" width="24" height="16" rx="4"/><rect class="warm" x="58" y="34" width="24" height="16" rx="4"/>
    <circle class="ln" cx="96" cy="72" r="7"/><circle class="ac pulse" cx="96" cy="72" r="3"/>
    <rect class="d" x="96" y="44" width="6" height="16" rx="3"/></svg>`,
  stampante_3d: `<svg class="dh-ic" viewBox="0 0 120 128"><rect class="ln" x="16" y="10" width="88" height="96" rx="4"/>
    <line class="ln" x1="16" y1="34" x2="104" y2="34"/><rect class="ac" x="40" y="30" width="40" height="8" rx="2"/>
    <rect class="d" x="52" y="38" width="16" height="12" rx="2"/><path class="warm pulse" d="M60 50 v6"/>
    <rect class="p" x="44" y="58" width="32" height="20" rx="2"/><rect class="d" x="24" y="90" width="72" height="8" rx="2"/></svg>`,
};
const ICON_OPTIONS = [
  "lavatrice", "asciugatrice", "lavasciuga", "lavastoviglie", "forno", "microonde", "friggitrice_aria",
  "frigo", "congelatore", "piano_cottura", "scaldabagno", "phon", "macchina_caffe", "bimby",
  "deumidificatore", "climatizzatore", "pc", "presa", "ferro", "ventilatore", "stufetta", "tv",
  "console", "wallbox", "pompa_calore", "aspirapolvere", "pompa_acqua", "bollitore", "tostapane", "stampante_3d",
];
function iconSvg(type) { return ICONS[type] || ICONS.presa; }

class DomHouseElettrodomesticoCard extends HTMLElement {
  static getStubConfig() { return { appliance: "lavatrice", icona: "lavatrice" }; }
  static getConfigElement() { return document.createElement("domhouse-elettrodomestico-card-editor"); }

  setConfig(config) {
    if (!config || !config.appliance) {
      throw new Error("Imposta 'appliance' con lo slug dell'elettrodomestico (es. lavatrice).");
    }
    this._config = config;
    this._slug = String(config.appliance).trim();
    this._period = this._period || "oggi";
    this._ids = {};
    for (const k in SUF) this._ids[k] = `${SUF[k][0]}.${this._slug}_${SUF[k][1]}`;
    this._built = false;
    if (this._hass) this._render();
  }
  set hass(hass) { this._hass = hass; if (!this._built) this._render(); else this._update(); }
  getCardSize() { return 16; }

  _st(key) { return this._hass && this._hass.states[this._ids[key]]; }
  _has(key) { return !!this._st(key); }
  _num(key, dec) {
    const s = this._st(key);
    if (!s || s.state === "unknown" || s.state === "unavailable" || isNaN(parseFloat(s.state))) return "—";
    const n = parseFloat(s.state);
    return dec != null ? n.toFixed(dec) : String(n);
  }
  _wfmt(key) {
    const s = this._st(key);
    if (!s || isNaN(parseFloat(s.state))) return "—";
    const n = parseFloat(s.state);
    return (Math.abs(n) < 10 ? n.toFixed(1) : n.toFixed(0)) + " W";
  }
  _hm(h) { if (isNaN(h)) return "—"; const H = Math.floor(h), m = Math.round((h - H) * 60); return H > 0 ? `${H}<small>h</small> ${m}<small>m</small>` : `${m}<small>m</small>`; }
  _minHM(min) { if (isNaN(min)) return "—"; const H = Math.floor(min / 60), m = Math.round(min % 60); return H > 0 ? `${H}<small>h</small> ${m}<small>m</small>` : `${m}<small>m</small>`; }
  _moreInfo(key) { if (!this._has(key)) return; const ev = new Event("hass-more-info", { bubbles: true, composed: true }); ev.detail = { entityId: this._ids[key] }; this.dispatchEvent(ev); }
  _toggleSwitch(key) { if (this._has(key)) this._hass.callService("switch", "toggle", { entity_id: this._ids[key] }); }
  _doReset() { this._hass.callService("domhouse_elettrodomestici", "reset", { entity_id: this._ids.running, azzera: "tutto" }); }

  _render() {
    if (!this._hass) return;
    const name = this._config.name || (this._slug.charAt(0).toUpperCase() + this._slug.slice(1));
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>${this._css()}</style>
      <ha-card>
        <div class="hd">
          <div class="ic">${this._badge()}</div>
          <div class="ti"><h1>${name}</h1><div class="sub">Centro Controllo Elettrodomestici</div></div>
          <span class="pill" data-ref="pill"></span>
        </div>
        <div class="pad sep hero">
          <div class="big"><div class="lab" data-ref="heroLab"></div><div class="val" data-ref="heroVal"></div></div>
          <div class="wash" data-ref="wash">${iconSvg(this._config.icona)}</div>
          <svg class="ring" data-ref="ring" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--dh-tile2)" stroke-width="4"></circle>
            <circle data-ref="ringFg" cx="18" cy="18" r="15.5" fill="none" stroke="var(--dh-solar)" stroke-width="4" stroke-linecap="round" pathLength="100" stroke-dasharray="0 100" transform="rotate(-90 18 18)"></circle>
            <text data-ref="ringTxt" x="18" y="17.6" text-anchor="middle" font-size="8.5">—</text>
            <text data-ref="ringCap" x="18" y="24" text-anchor="middle" font-size="4.2" class="cap">PULITA</text>
          </svg>
        </div>
        <div class="pad sep flow" data-ref="flow">
          <div class="row"><span class="nm"><b style="background:var(--dh-power)"></b>Totale</span><span class="track"><span class="fill" data-ref="barTot" style="background:var(--dh-power)"></span></span><span class="amt" data-ref="pTot">—</span></div>
          <div class="row" data-ref="rowFtv"><span class="nm"><b style="background:var(--dh-solar)"></b>Da FV</span><span class="track"><span class="fill" data-ref="barFtv" style="background:var(--dh-solar)"></span></span><span class="amt solar" data-ref="pFtv">—</span></div>
          <div class="row" data-ref="rowBatt"><span class="nm"><b style="background:var(--dh-batt)"></b>Da batteria</span><span class="track"><span class="fill" data-ref="barBatt" style="background:var(--dh-batt)"></span></span><span class="amt batt" data-ref="pBatt">—</span></div>
          <div class="row" data-ref="rowGrid"><span class="nm"><b style="background:var(--dh-grid)"></b>Da rete</span><span class="track"><span class="fill" data-ref="barGrid" style="background:var(--dh-grid)"></span></span><span class="amt rete" data-ref="pGrid">—</span></div>
        </div>
        <div class="pad sep">
          <details class="acc top">
            <summary data-ref="cycleTitle">Ciclo in corso</summary>
            <div class="grid" style="margin-top:10px" data-ref="cycleGrid">
              <div class="tile tap" data-mi="e_cycle"><div class="k">Energia</div><div class="v" data-ref="ecy">—</div></div>
              <div class="tile" data-ref="tileEcyF"><div class="k">Da FV</div><div class="v solar" data-ref="ecyF">—</div></div>
              <div class="tile" data-ref="tileEcyB"><div class="k">Da batteria</div><div class="v batt" data-ref="ecyB">—</div></div>
              <div class="tile" data-ref="tileEcyR"><div class="k">Da rete</div><div class="v rete" data-ref="ecyR">—</div></div>
              <div class="tile"><div class="k">Costo</div><div class="v" data-ref="ccy">—</div></div>
            </div>
          </details>
        </div>
        <div class="pad sep">
          <details class="acc top">
            <summary>Statistiche</summary>
            <div class="tabs" data-ref="tabs" style="margin-top:10px"><button data-p="oggi">Oggi</button><button data-p="mese">Mese</button><button data-p="anno">Anno</button></div>
            <div class="grid" style="margin-top:10px">
              <div class="tile tap" data-ref="stEnergyTile"><div class="k">Energia</div><div class="v" data-ref="stEnergy">—</div></div>
              <div class="tile"><div class="k">Costo</div><div class="v" data-ref="stCost">—</div></div>
              <div class="tile"><div class="k">Cicli</div><div class="v" data-ref="stCycles">—</div></div>
              <div class="tile"><div class="k">Tempo</div><div class="v" data-ref="stTime">—</div></div>
            </div>
            <div class="subh" data-ref="lastTitle">Ultimo ciclo</div>
            <div class="grid">
              <div class="tile" style="grid-column:span 2"><div class="k">Fine</div><div class="v sm" data-ref="lEnd">—</div></div>
              <div class="tile"><div class="k">Durata</div><div class="v" data-ref="lDur">—</div></div>
              <div class="tile"><div class="k">Costo</div><div class="v" data-ref="lCost">—</div></div>
            </div>
            <div class="subh" data-ref="weekTitle">Ultimi 7 giorni</div>
            <table class="wk"><thead><tr><th>Giorno</th><th>kWh</th><th>€</th><th>Cicli</th></tr></thead><tbody data-ref="weekBody"></tbody></table>
          </details>
        </div>
        <div class="pad sep">
          <details class="acc top">
            <summary>Controllo</summary>
            <div class="ctrl" style="margin-top:6px">
              <div class="line" data-ref="plugLine" hidden>
                <svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v8"/><path d="M18 6a8 8 0 1 1-12 0"/></svg>
                <span class="lt">Presa</span><span class="sw" data-sw="plug" data-ref="plugSw" role="switch" tabindex="0"></span>
              </div>
              <div class="line tap" data-mi="threshold"><svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg><span class="lt">Soglia di lavoro</span><span class="lv" data-ref="thr">—</span></div>
              <div class="line tap" data-mi="delay_on"><svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6"/></svg><span class="lt">Ritardo accensione</span><span class="lv" data-ref="delOn">—</span></div>
              <div class="line tap" data-mi="delay_off"><svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="8"/><path d="M9 13h6"/><path d="M9 2h6"/></svg><span class="lt">Ritardo spegnimento</span><span class="lv" data-ref="delOff">—</span></div>
            </div>
            <div class="subh">Notifiche</div>
            <div class="ctrl">
              <div class="line"><svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg><span class="lt">Push</span><span class="sw" data-sw="notif_push" data-ref="pushSw" role="switch" tabindex="0"></span></div>
              <div class="line"><svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg><span class="lt">Google</span><span class="sw" data-sw="notif_google" data-ref="googleSw" role="switch" tabindex="0"></span></div>
              <div class="line"><svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/></svg><span class="lt">Alexa</span><span class="sw" data-sw="notif_alexa" data-ref="alexaSw" role="switch" tabindex="0"></span></div>
              <div class="line" data-ref="haLine"><svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9"/><path d="M10 19.5a2 2 0 0 0 4 0"/></svg><span class="lt two"><span>HA</span><span class="hint">Notifica persistente</span></span><span class="sw" data-sw="notif_ha" data-ref="haSw" role="switch" tabindex="0"></span></div>
              <div class="line tap" data-mi="notif_start"><svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span class="lt">Notifiche dalle</span><span class="lv" data-ref="nStart">—</span></div>
              <div class="line tap" data-mi="notif_end"><svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span class="lt">Notifiche alle</span><span class="lv" data-ref="nEnd">—</span></div>
            </div>
            <div class="subh" data-ref="autoWrap" hidden>Spegnimento automatico</div>
            <div class="ctrl" data-ref="autoCtrl" hidden>
              <div class="line"><svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18.4 5.6A9 9 0 1 1 5.6 5.6"/><path d="M12 2v8"/></svg><span class="lt">Abilita</span><span class="sw" data-sw="auto_enabled" data-ref="autoSw" role="switch" tabindex="0"></span></div>
              <div class="line tap" data-mi="autooff"><svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span class="lt">Orario</span><span class="lv" data-ref="autooffVal">—</span></div>
            </div>
            <div class="subh">Contatori</div>
            <div class="ctrl">
              <div class="line">
                <svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/></svg>
                <span class="lt two"><span>Reset contatori</span><span class="hint" data-ref="lastReset">Ultimo: mai</span></span>
                <button class="btn" type="button" data-ref="resetBtn">Esegui</button>
              </div>
              <div class="confirm" data-ref="resetConfirm" hidden>
                <span>Azzerare tutti i contatori e le statistiche di questo elettrodomestico?</span>
                <button class="btn" type="button" data-ref="resetNo">Annulla</button>
                <button class="btn danger" type="button" data-ref="resetYes">Azzera</button>
              </div>
            </div>
          </details>
        </div>
      </ha-card>`;
    this._els = {};
    root.querySelectorAll("[data-ref]").forEach(el => { this._els[el.getAttribute("data-ref")] = el; });
    root.querySelectorAll("[data-mi]").forEach(el => el.addEventListener("click", () => this._moreInfo(el.getAttribute("data-mi"))));
    this._els.tabs.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { this._period = b.dataset.p; this._update(); }));
    root.querySelectorAll("[data-sw]").forEach(el => {
      const key = el.getAttribute("data-sw");
      el.addEventListener("click", () => this._toggleSwitch(key));
      el.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); this._toggleSwitch(key); } });
    });
    this._els.resetBtn.addEventListener("click", () => { this._els.resetConfirm.hidden = false; });
    this._els.resetNo.addEventListener("click", () => { this._els.resetConfirm.hidden = true; });
    this._els.resetYes.addEventListener("click", () => { this._els.resetConfirm.hidden = true; this._doReset(); });
    this._built = true;
    this._update();
  }

  _update() {
    if (!this._built || !this._hass) return;
    const E = this._els;
    const running = this._st("running") && this._st("running").state === "on";
    E.pill.className = "pill " + (running ? "on" : "off");
    E.pill.textContent = running ? "In funzione" : "Fermo";
    E.wash.classList.toggle("running", running);

    E.heroLab.textContent = running ? "Durata ciclo" : "Ultimo ciclo";
    E.heroVal.innerHTML = running ? this._minHM(parseFloat(this._num("dur_cycle"))) : this._minHM(parseFloat(this._num("last_dur")));
    E.cycleTitle.textContent = running ? "Ciclo in corso" : "Ultimo ciclo";

    // Fonti disponibili: il component crea le entità solo per ciò che è configurato
    const hasFtv = this._has("power_ftv"), hasBatt = this._has("power_batt");
    const hasSplit = hasFtv || hasBatt;
    E.rowFtv.hidden = !hasFtv; E.rowBatt.hidden = !hasBatt; E.rowGrid.hidden = !hasSplit;
    E.tileEcyF.hidden = !hasFtv; E.tileEcyB.hidden = !hasBatt; E.tileEcyR.hidden = !hasSplit;
    E.flow.hidden = !hasSplit;                                  // barre solo con FV/batteria
    E.cycleGrid.style.gridTemplateColumns = hasSplit ? "" : "repeat(2, 1fr)";
    const maxW = Number(this._config.potenza_max) > 0 ? Number(this._config.potenza_max) : 3000;

    if (hasSplit) {
      // Cerchio = energia pulita (FV + batteria)
      E.ringCap.textContent = "PULITA";
      E.ringFg.style.stroke = "var(--dh-solar)";
      const clean = parseFloat(this._num("clean_cycle"));
      const pct = isNaN(clean) ? 0 : Math.max(0, Math.min(100, clean));
      E.ringFg.setAttribute("stroke-dasharray", `${pct} 100`);
      E.ringFg.setAttribute("stroke-dashoffset", "0");
      E.ringTxt.textContent = isNaN(clean) ? "—" : `${Math.round(pct)}%`;
    } else {
      // Nessuna fonte pulita: cerchio = potenza reale su fondo scala (default 3000 W), rosso
      E.ringCap.textContent = "W";
      E.ringFg.style.stroke = "var(--dh-danger)";
      const pw = parseFloat(this._num("power")) || 0;
      const fill = Math.max(0, Math.min(100, (pw / maxW) * 100));
      E.ringFg.setAttribute("stroke-dasharray", "100 100");
      E.ringFg.setAttribute("stroke-dashoffset", String(100 - fill));
      E.ringTxt.textContent = this._wfmt("power").replace(" W", "");
    }

    const pt = parseFloat(this._num("power")) || 0, pf = parseFloat(this._num("power_ftv")) || 0,
          pb = parseFloat(this._num("power_batt")) || 0, pg = parseFloat(this._num("power_grid")) || 0;
    E.pTot.textContent = this._wfmt("power"); E.pFtv.textContent = this._wfmt("power_ftv");
    E.pBatt.textContent = this._wfmt("power_batt"); E.pGrid.textContent = this._wfmt("power_grid");
    E.barTot.style.width = Math.min(100, (pt / maxW) * 100) + "%";
    E.barFtv.style.width = Math.min(100, (pf / maxW) * 100) + "%";
    E.barBatt.style.width = Math.min(100, (pb / maxW) * 100) + "%";
    E.barGrid.style.width = Math.min(100, (pg / maxW) * 100) + "%";

    E.ecy.innerHTML = `${this._num("e_cycle", 2)}<small> kWh</small>`;
    E.ecyF.innerHTML = `${this._num("e_cycle_ftv", 2)}<small> kWh</small>`;
    E.ecyB.innerHTML = `${this._num("e_cycle_batt", 2)}<small> kWh</small>`;
    E.ecyR.innerHTML = `${this._num("e_cycle_grid", 2)}<small> kWh</small>`;
    E.ccy.innerHTML = `${this._num("cost_cycle", 2)}<small> €</small>`;

    this._els.tabs.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", b.dataset.p === this._period));
    const p = this._period;
    const ek = { oggi: "e_oggi", mese: "e_mese", anno: "e_anno" }[p], ck = { oggi: "c_oggi", mese: "c_mese", anno: "c_anno" }[p];
    const cyk = { oggi: "cy_oggi", mese: "cy_mese", anno: "cy_anno" }[p], tk = { oggi: "t_oggi", mese: "t_mese", anno: "t_anno" }[p];
    E.stEnergy.innerHTML = `${this._num(ek, 2)}<small> kWh</small>`; E.stCost.innerHTML = `${this._num(ck, 2)}<small> €</small>`;
    E.stCycles.textContent = this._num(cyk, 0); E.stTime.innerHTML = this._hm(parseFloat(this._num(tk)));
    E.stEnergyTile.setAttribute("data-mi", ek);

    const swRefs = { plugSw: "plug", pushSw: "notif_push", googleSw: "notif_google", alexaSw: "notif_alexa", haSw: "notif_ha", autoSw: "auto_enabled" };
    E.haLine.hidden = !this._has("notif_ha");
    const lr = this._st("last_reset");
    E.lastReset.textContent = (lr && !isNaN(Date.parse(lr.state)))
      ? "Ultimo: " + new Date(lr.state).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : "Ultimo: mai";
    for (const ref in swRefs) { const s = this._st(swRefs[ref]); if (E[ref] && s) E[ref].setAttribute("aria-checked", s.state === "on"); }
    E.plugLine.hidden = !this._has("plug");
    const hasAuto = this._has("auto_enabled");
    E.autoWrap.hidden = !hasAuto; E.autoCtrl.hidden = !hasAuto;
    E.thr.textContent = this._has("threshold") ? `${this._num("threshold", 0)} W` : "—";
    E.delOn.textContent = `${this._num("delay_on", 0)} s`;
    E.delOff.textContent = `${this._num("delay_off", 0)} m`;
    const hhmm = (key) => { const s = this._st(key); return (s && /^\d\d:\d\d/.test(s.state)) ? s.state.slice(0, 5) : "—"; };
    E.nStart.textContent = hhmm("notif_start"); E.nEnd.textContent = hhmm("notif_end"); E.autooffVal.textContent = hhmm("autooff");

    const le = this._st("last_end");
    E.lEnd.textContent = (le && !isNaN(Date.parse(le.state))) ? new Date(le.state).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/,\s*/, " - ") : "—";
    E.lDur.innerHTML = this._minHM(parseFloat(this._num("last_dur")));
    E.lCost.innerHTML = `${this._num("last_cost", 2)}<small> €</small>`;
    E.lastTitle.textContent = `Ultimo ciclo · ${this._num("cycles_total", 0)} totali`;

    const wk = this._st("week");
    if (wk) { E.weekTitle.hidden = false; E.weekBody.closest("table").hidden = false;
      E.weekBody.innerHTML = WEEKDAYS.map((g, i) => { const d = wk.attributes[g] || {}; return `<tr><td class="d">${WEEKDAYS_SHORT[i]}</td><td>${d.kwh ?? 0}</td><td>${d.costo ?? 0}</td><td>${d.cicli ?? 0}</td></tr>`; }).join("");
    } else { E.weekTitle.hidden = true; E.weekBody.closest("table").hidden = true; }
  }

  _badge() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>`;
  }

  _css() {
    return `
      :host { --dh-card: var(--card-background-color, #fff); --dh-text: var(--primary-text-color, #1a2228);
        --dh-muted: var(--secondary-text-color, #697782); --dh-border: var(--divider-color, #d8dee4);
        --dh-tile: var(--secondary-background-color, #f4f6f8); --dh-tile2: color-mix(in srgb, var(--dh-tile) 70%, var(--dh-border));
        --dh-brand: var(--primary-color, #12a6a0); --dh-solar: #2eae63; --dh-grid: #e8902e; --dh-power: #3f8bd0; --dh-batt: #9d6ae0; --dh-danger: #e5484d; --dh-idle: #8894a0; }
      ha-card { padding: 0; overflow: hidden; color: var(--dh-text); }
      ha-card > * { padding-left: 18px; padding-right: 18px; }
      .pad { padding-top: 16px; padding-bottom: 16px; } .sep { border-top: 1px solid var(--dh-border); }
      h1 { font-size: 18px; font-weight: 700; margin: 0; letter-spacing: -.01em; }
      small { font-weight: 600; color: var(--dh-muted); font-size: .66em; }
      .title, .subh { font-weight: 700; color: var(--dh-muted); text-transform: uppercase; letter-spacing: .06em; }
      .title { font-size: 12px; margin-bottom: 10px; } .subh { font-size: 11.5px; margin: 16px 0 8px; }
      .hd { display: flex; align-items: center; gap: 12px; padding-top: 16px; padding-bottom: 16px; }
      .hd .ic { width: 42px; height: 42px; border-radius: 12px; flex: none; display: grid; place-items: center; background: var(--dh-tile); color: var(--dh-brand); }
      .hd .ic svg { width: 23px; height: 23px; } .hd .sub { font-size: 12.5px; color: var(--dh-muted); margin-top: 1px; }
      .pill { margin-left: auto; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 999px; display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; }
      .pill::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
      .pill.on { color: var(--dh-solar); background: color-mix(in srgb, var(--dh-solar) 15%, transparent); }
      .pill.off { color: var(--dh-idle); background: color-mix(in srgb, var(--dh-idle) 16%, transparent); }
      .dh-ic { height: 118px; width: auto; max-width: 92%; display: block; margin: 0 auto; }
      .hero .wash { flex: 1 1 auto; display: flex; justify-content: center; align-items: center; min-width: 0; }
      .hero .wash .dh-ic { height: 80px; max-width: 100%; margin: 0; }
      .dh-ic .b { fill: var(--dh-card); stroke: var(--dh-border); stroke-width: 2.4; }
      .dh-ic .glass { fill: var(--dh-card); stroke: var(--dh-border); stroke-width: 1.4; }
      .dh-ic .p { fill: var(--dh-tile2); } .dh-ic .d { fill: var(--dh-idle); }
      .dh-ic .ln { fill: none; stroke: var(--dh-border); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
      .dh-ic .ac { fill: var(--dh-brand); } .dh-ic .acs { fill: none; stroke: var(--dh-brand); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
      .dh-ic .warm { fill: var(--dh-grid); } .dh-ic .warms { fill: none; stroke: var(--dh-grid); stroke-width: 2.4; stroke-linecap: round; }
      .dh-ic .cool { fill: var(--dh-power); } .dh-ic .cools { fill: none; stroke: var(--dh-power); stroke-width: 2.4; stroke-linecap: round; }
      .dh-ic .grn { fill: var(--dh-solar); }
      .dh-ic .spin, .dh-ic .spin-f { transform-box: fill-box; transform-origin: center; }
      .wash.running .spin { animation: dh-spin 2.6s linear infinite; } .wash.running .spin-f { animation: dh-spin 1s linear infinite; }
      .wash.running .pulse { animation: dh-pulse 1.7s ease-in-out infinite; } .wash.running .flow { animation: dh-flow 1.9s ease-in-out infinite; }
      .wash.running .rise { animation: dh-rise 2.3s ease-in-out infinite; }
      @keyframes dh-spin { to { transform: rotate(360deg); } } @keyframes dh-pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
      @keyframes dh-flow { 0%{opacity:.2;transform:translateX(-1.5px)} 50%{opacity:1} 100%{opacity:.2;transform:translateX(2.5px)} }
      @keyframes dh-rise { 0%{opacity:0;transform:translateY(2px)} 45%{opacity:.95} 100%{opacity:0;transform:translateY(-5px)} }
      .ring [data-ref="ringFg"] { transition: stroke-dashoffset .6s ease, stroke-dasharray .6s ease; }
      .hero { display: flex; align-items: center; gap: 10px; } .hero .big { flex: 0 1 auto; min-width: 0; }
      .hero .lab { font-size: 12px; color: var(--dh-muted); text-transform: uppercase; letter-spacing: .05em; }
      .hero .val { font-size: 27px; font-weight: 750; letter-spacing: -.02em; font-variant-numeric: tabular-nums; line-height: 1.05; margin-top: 4px; white-space: nowrap; }
      .ring { width: 90px; height: 90px; flex: none; } .ring text { fill: var(--dh-text); font-weight: 750; } .ring .cap { fill: var(--dh-muted); }
      .flow { display: grid; gap: 10px; } .flow .row { display: grid; grid-template-columns: 84px 1fr 62px; align-items: center; gap: 10px; }
      .flow .nm { font-size: 13px; color: var(--dh-muted); display: flex; align-items: center; gap: 6px; } .flow .nm b { width: 9px; height: 9px; border-radius: 3px; flex: none; }
      .flow .track { height: 8px; border-radius: 999px; background: var(--dh-tile2); overflow: hidden; } .flow .fill { display: block; height: 100%; border-radius: 999px; transition: width .5s ease; width: 0; }
      .flow .amt { font-size: 13.5px; font-weight: 700; font-variant-numeric: tabular-nums; text-align: right; white-space: nowrap; }
      .solar { color: var(--dh-solar); } .rete { color: var(--dh-grid); } .batt { color: var(--dh-batt); }
      .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
      .tile { background: var(--dh-tile); border-radius: 12px; padding: 11px 12px; min-width: 0; } .tile.tap { cursor: pointer; } .tile.tap:hover { filter: brightness(.97); }
      .tile .k { font-size: 11px; color: var(--dh-muted); text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .tile .v { font-size: 17px; font-weight: 700; margin-top: 3px; font-variant-numeric: tabular-nums; } .tile .v.sm { font-size: 14px; }
      .tabs { display: flex; gap: 6px; background: var(--dh-tile2); padding: 4px; border-radius: 12px; }
      .tabs button { flex: 1; font: inherit; font-size: 13px; font-weight: 650; color: var(--dh-muted); border: 0; background: none; padding: 7px 0; border-radius: 9px; cursor: pointer; }
      .tabs button[aria-selected="true"] { background: var(--dh-card); color: var(--dh-text); box-shadow: 0 1px 3px rgba(0,0,0,.14); }
      details.acc { margin: 0; } details.acc.top { margin-top: 0; }
      details.acc > summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--dh-muted); text-transform: uppercase; letter-spacing: .06em; padding: 2px 0; }
      details.acc > summary::-webkit-details-marker { display: none; }
      details.acc > summary::after { content: ""; width: 7px; height: 7px; margin-left: auto; border-right: 2px solid var(--dh-muted); border-bottom: 2px solid var(--dh-muted); transform: rotate(45deg); transition: transform .2s; }
      details.acc[open] > summary::after { transform: rotate(-135deg); }
      .ctrl { display: grid; } .line { display: flex; align-items: center; gap: 12px; padding: 11px 2px; border-radius: 10px; } .line.tap { cursor: pointer; } .line.tap:hover { background: var(--dh-tile); }
      .line .ci { width: 20px; height: 20px; color: var(--dh-muted); flex: none; } .line .lt { font-size: 14px; } .line .lv { margin-left: auto; font-size: 14px; font-weight: 650; color: var(--dh-muted); font-variant-numeric: tabular-nums; }
      .sw { margin-left: auto; width: 44px; height: 26px; border-radius: 999px; background: var(--dh-tile2); border: 1px solid var(--dh-border); position: relative; cursor: pointer; transition: background .2s; flex: none; }
      .sw::after { content: ""; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); transition: transform .2s; }
      .sw[aria-checked="true"] { background: var(--dh-brand); border-color: var(--dh-brand); } .sw[aria-checked="true"]::after { transform: translateX(18px); }
      .wk { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 6px; } .wk th, .wk td { text-align: right; padding: 7px 6px; font-variant-numeric: tabular-nums; }
      .wk th { font-size: 11px; color: var(--dh-muted); text-transform: uppercase; letter-spacing: .04em; font-weight: 600; border-bottom: 1px solid var(--dh-border); }
      .wk td:first-child, .wk th:first-child { text-align: left; } .wk tbody tr + tr td { border-top: 1px solid var(--dh-border); } .wk .d { color: var(--dh-muted); }
      [hidden] { display: none !important; }
      .line .lt.two { display: flex; flex-direction: column; gap: 2px; } .line .lt .hint { font-size: 12px; color: var(--dh-muted); }
      .btn { font: inherit; font-size: 13px; font-weight: 650; border: 1px solid var(--dh-border); background: var(--dh-tile); color: var(--dh-text); padding: 7px 14px; border-radius: 10px; cursor: pointer; flex: none; }
      .line .btn { margin-left: auto; } .btn:hover { filter: brightness(.96); }
      .btn.danger { background: #d9534f; border-color: #d9534f; color: #fff; }
      .confirm { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 10px 12px; margin: 2px 0 6px; border-radius: 12px; background: color-mix(in srgb, #d9534f 12%, transparent); font-size: 13px; }
      .confirm span { flex: 1 1 170px; }
      @media (prefers-reduced-motion: reduce) { .fill, .sw, .sw::after, details.acc > summary::after, .wash.running .spin, .wash.running .spin-f, .wash.running .pulse, .wash.running .flow, .wash.running .rise { animation: none; transition: none; } }
    `;
  }
}

// ---- editor per le impostazioni della card ----
class DomHouseCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; if (this._form) this._form.hass = hass; }
  _render() {
    if (this._form) { this._form.data = this._config; return; }
    this._form = document.createElement("ha-form");
    this._form.schema = [
      { name: "appliance", required: true, selector: { text: {} } },
      { name: "name", selector: { text: {} } },
      { name: "icona", selector: { select: { mode: "dropdown", options: ICON_OPTIONS.map(v => ({ value: v, label: v })) } } },
      { name: "potenza_max", selector: { number: { min: 100, max: 10000, step: 50, mode: "box", unit_of_measurement: "W" } } },
    ];
    this._form.computeLabel = (s) => ({ appliance: "Elettrodomestico (slug del device)", name: "Nome (opzionale)", icona: "Illustrazione", potenza_max: "Fondo scala potenza · W (barre e cerchio, default 3000)" }[s.name] || s.name);
    if (this._hass) this._form.hass = this._hass;
    this._form.data = this._config;
    this._form.addEventListener("value-changed", (e) => {
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: e.detail.value } }));
    });
    this.appendChild(this._form);
    const credit = document.createElement("div");
    credit.innerHTML = `Salvatore Lentini · <a href="https://domhouse.it" target="_blank" rel="noopener" style="color:var(--primary-color);text-decoration:none">DomHouse.it</a> · v${DH_VERSION}`;
    credit.style.cssText = "margin-top:16px;padding-top:12px;border-top:1px solid var(--divider-color);font-size:12px;color:var(--secondary-text-color);text-align:center";
    this.appendChild(credit);
  }
}

customElements.define("domhouse-elettrodomestico-card", DomHouseElettrodomesticoCard);
customElements.define("domhouse-elettrodomestico-card-editor", DomHouseCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({ type: "domhouse-elettrodomestico-card", name: "DomHouse Elettrodomestico", description: "Card completa per un elettrodomestico del Centro Controllo DomHouse.", preview: false });
console.info(`%c DOMHOUSE-ELETTRODOMESTICO-CARD %c v${DH_VERSION} `, "color:#fff;background:#12a6a0;border-radius:3px 0 0 3px;padding:2px 6px", "color:#12a6a0;background:#1a2227;border-radius:0 3px 3px 0;padding:2px 6px");
