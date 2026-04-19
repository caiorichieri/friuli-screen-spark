# Loghi Clienti

Per aggiungere un nuovo cliente al sito:

## 1. Carica il logo in questa cartella

Salva il file logo qui dentro (`src/assets/clients/`).

**Formato consigliato:**
- PNG con sfondo trasparente (preferito)
- SVG (ottimo, scala perfettamente)
- JPG solo se non hai alternative

**Dimensioni consigliate:**
- Larghezza: ~400-600 px
- Altezza: ~200-300 px
- Peso: < 100 KB

**Esempio nome file:** `bar-centrale.png`, `farmacia-alfa.svg`

## 2. Aggiungi il cliente alla lista

Apri il file `src/data/clients.ts` e aggiungi una nuova voce all'array `clients`:

```ts
import barCentrale from "@/assets/clients/bar-centrale.png";

export const clients: Client[] = [
  // ... clienti esistenti
  {
    name: "Bar Centrale",
    logo: barCentrale,
    website: "https://barcentrale.it", // opzionale
  },
];
```

Se il cliente non ha un sito web, ometti il campo `website` o lascialo `undefined`.

## 3. Salva e verifica

Il logo apparirà automaticamente:
- Nella **fascia scorrevole** sulla home page
- Nella **griglia completa** della pagina `/clienti`
