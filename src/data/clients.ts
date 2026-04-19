/**
 * Lista dei clienti di Friuli On.
 *
 * Per aggiungere un cliente:
 * 1. Salva il logo in `src/assets/clients/` (preferibilmente PNG trasparente o SVG).
 * 2. Importalo qui sotto con `import nomeLogo from "@/assets/clients/nome-file.png";`
 * 3. Aggiungi una nuova voce all'array `clients` qui sotto.
 *
 * Vedi `src/assets/clients/README.md` per le istruzioni complete.
 */

export type Client = {
  /** Nome dell'attività mostrato sotto il logo */
  name: string;
  /** Immagine importata del logo */
  logo: string;
  /** Sito web del cliente (opzionale). Se presente, il logo diventa cliccabile. */
  website?: string;
};

// 👇 Importa qui i loghi dei clienti. Esempio:
// import barCentrale from "@/assets/clients/bar-centrale.png";

export const clients: Client[] = [
  // 👇 Aggiungi qui i clienti. Esempio:
  // {
  //   name: "Bar Centrale",
  //   logo: barCentrale,
  //   website: "https://barcentrale.it",
  // },
];
