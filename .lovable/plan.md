# Piano SEO Friuli On

Dividiamo la lista in 3 fasi. Solo la Fase 1 viene implementata subito dopo l'approvazione; le Fasi 2 e 3 le facciamo una alla volta, quando mi mandi i contenuti reali.

## Fase 1 — Correzioni tecniche rapide (le faccio io, subito)

1. **Lingua italiana**: la pagina oggi dichiara inglese (`lang="en"`), la cambio in `lang="it"`.
2. **URL inesistenti → 404 vero**: oggi un indirizzo come `friulion.it/qualsiasicosa` mostra "Pagina non trovata" ma risponde 200 con canonical (soft-404). Il controllo della landing cliente viene spostato lato server: se lo slug non esiste la pagina risponde 404, con `noindex` e senza canonical. Aggiungo anche una pagina 404 generale del sito.
3. **Canonical su Privacy e Cookie**, più titolo/descrizione propri.
4. **Schema LocalBusiness ampliato**: logo, immagine, coordinate geografiche di Codroipo, orari (da confermare), elenco città servite, servizi offerti, link social (Facebook/Instagram, da confermare).
5. **Immagini più leggere**: i due loghi (530 KB e 207 KB) convertiti in WebP ridimensionato (obiettivo sotto 40 KB); foto hero e locali in WebP con dimensioni corrette. SVG solo se mi mandi il logo vettoriale originale.
6. **Liste pre-renderizzate**: clienti, portfolio e servizi caricati lato server, così Google li legge subito nell'HTML invece che dopo il caricamento.

## Fase 2 — Configurazioni esterne (in parte tu, in parte io)

- **Redirect www → dominio principale 301**: si imposta dalle impostazioni dominio di Lovable (dominio principale = friulion.it), non dal codice. Ti guido io.
- **Google Search Console**: già verificata e sitemap inviata. Controllo con la connessione se ci sono URL soft-404 già indicizzati e ti dico quali.
- **Bing Webmaster Tools**: si importa direttamente da Search Console (2 minuti, lo fai tu, ti guido).
- **Google Business Profile Codroipo + recensioni dei 17 clienti**: lo fai tu; posso preparare il testo del messaggio da mandare ai clienti con il link recensioni.

## Fase 3 — Contenuti strategici (più giorni, servono i tuoi contenuti)

- 6 pagine servizio (monitor indoor, SEO, Google Ads, Meta Ads, grafica, siti web) + 3 pagine circuito per tipo di locale (bar, farmacie, palestre).
- Pagina FAQ / prezzi (con domande reali e fasce di prezzo che mi fornisci). Niente schema FAQPage: Google non lo mostra più per questo tipo di siti.
- Casi studio (Codroipo C'è, Atletica 2000, Fibromental…) con richiesta di link di ritorno.
- Pagine città (Lignano, Codroipo) solo con locali reali.
- Blog: sezione con gestione articoli dall'admin, primi due articoli "Come pubblicizzare…" e "Quanto costa…".
- Stampa locale e directory (Messaggero Veneto, Il Friuli, Pagine Gialle): attività esterna, lato tuo.

## Dettagli tecnici (Fase 1)

- `src/routes/__root.tsx`: `lang="it"`, JSON-LD ampliato, `notFoundComponent` globale.
- `src/routes/$slug.tsx`: loader server che legge la landing pubblica; se assente `throw notFound()` (status 404), head con `robots: noindex` e nessun canonical nel caso non trovato.
- `privacy.tsx`, `cookies.tsx`: head con canonical `https://friulion.it/privacy|cookies`.
- `src/assets`: versioni `.webp` dei loghi e delle foto, import aggiornati nei componenti.
- Clienti/portfolio/servizi: loader con `ensureQueryData` + `useSuspenseQuery` sulle viste pubbliche.

## Da confermare da te

- Orari di apertura e profili social da inserire nello schema (altrimenti li ometto).
