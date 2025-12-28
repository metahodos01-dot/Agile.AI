# Changelog

Tutti i cambiamenti notevoli a questo progetto saranno documentati in questo file.

## [1.1.0] - 2025-12-28

### ✨ Aggiunto (Added)

- **Sprint Dashboard Avanzata**:
  - **Kanban Board** completamente interattiva con colonne Drag & Drop (To Do, Doing, Done).
  - **Calendario Eventi** per tracciare scadenze, review e cerimonie dello sprint.
  - **Blocco Note Daily** per appunti veloci durante gli stand-up meeting.
- **Reportistica Professionale**:
  - Generazione di report dettagliati con inclusione dello stato Kanban.
  - Raggruppamento automatico dei task per stato nel report.
  - Ordinamento cronologico degli eventi del calendario.
- **Persistenza Dati**: Salvataggio automatico su Supabase di tutti i dati dello sprint (task, note, eventi).

### 🐛 Risolto (Fixed)

- Risolto un bug critico che impediva il build su Vercel (caratteri speciali JSX in `Objectives.jsx`).
- Corretto errore di sintassi "Return statement not allowed" in `exportService.js`.
- Risolti i warning `act()` nella suite di test `ProjectContext`.
- Migliorata la stabilità del caricamento dei dati demo.

---

## [1.0.0] - 2025-12-25

### 🌱 Iniziale (Initial)

- Rilascio iniziale della piattaforma Agile.AI.
- Gestione Vision, Obiettivi, KPI, Team, Backlog.
- Export base del progetto.
