# 🛠️ Piano di Manutenzione Periodica

Per garantire che la piattaforma Agile.AI rimanga performante, sicura e affidabile, si raccomanda di seguire questo piano di manutenzione.

## 📅 Attività Settimanali

1. **Backup Dati**: Anche se Supabase gestisce backup periodici, verifica che i dati critici (progetti, sprint) siano integri.
2. **Monitoraggio Errori**: Controlla la console del browser o i log di Vercel per eventuali errori ricorrenti lato client.

## 📅 Attività Mensili

1. **Aggiornamento Dipendenze**:
    - Esegui `npm outdated` per vedere i pacchetti obsoleti.
    - Aggiorna le librerie minori con `npm update`.
    - *Nota*: Per aggiornamenti maggiori (major version), esegui prima i test (`npm test`) per evitare regressioni.
2. **Pulizia Dati**:
    - Archivia o elimina progetti di test non più utilizzati per mantenere pulito il database.
    - Svuota eventuali task "Done" molto vecchi dalla Kanban board se non più rilevanti per la reportistica.

## 📅 Attività Trimestrali

1. **Revisione Sicurezza**:
    - Controlla le policy di sicurezza di Supabase (RLS - Row Level Security).
    - Verifica che gli accessi utenti (Auth) siano corretti e non ci siano account inattivi con permessi elevati.
2. **Performance Check**:
    - Esegui un audit con Lighthouse (Chrome DevTools) sulle pagine principali (Sprint, Roadmap) per verificare le prestazioni di caricamento.
3. **Review del Codice**:
    - Controlla la presenza di codice deprecato o commentato ("dead code") che può essere rimosso.

## 🚨 In Caso di Problemi

- **Build Fallita**: Verifica il file `CHANGELOG.md` per le ultime modifiche e controlla i log di errore (es. errori di sintassi JSX).
- **Problemi Dati**: Se i dati non si salvano, verifica la connessione a Supabase e le quote di utilizzo del piano gratuito.

---
*Ultimo aggiornamento: 28 Dicembre 2025*
