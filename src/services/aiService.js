// AI Service per Industria - Risposte in Italiano
// Orientato a settori industriali: manifattura, produzione, logistica, automazione
// In produzione, questo si collegherà a OpenAI/Gemini API

export const generateAIResponseV2 = async (prompt, type) => {
   return new Promise((resolve) => {
      setTimeout(() => {
         try {
            if (type === 'vision') {
               // Vision discorsiva + Value Proposition strutturata
               const productName = prompt.projectName || 'Il prodotto';
               const target = prompt.targetAudience || 'le aziende';
               const problem = prompt.problem || 'le inefficienze attuali';
               const differentiation = prompt.differentiation || 'tecnologia avanzata';

               resolve(`${productName} si pone l'ambizioso obiettivo di trasformare il settore per ${target}, risolvendo in modo definitivo le criticità legate a ${problem}. Attraverso un approccio innovativo basato su ${differentiation}, non ci limitiamo a migliorare i processi esistenti, ma ridefiniamo lo standard di eccellenza operativa. La nostra visione è quella di un futuro in cui l'efficienza non va a scapito della qualità, creando un ecosistema integrato e sostenibile.
   
   🚀 **Value Proposition & Elementi Differenzianti**
   
   ✨ **Innovazione Radicale**: Oltre le soluzioni tradizionali, portiamo ${differentiation} al centro del processo.
   💎 **Impatto Misurabile**: Risoluzione concreta di ${problem} con ROI tangibile.
   🤝 **Focus sull'Utente**: Progettato specificamente per le esigenze di ${target}.
   🔗 **Integrazione Totale**: Si inserisce perfettamente nel workflow esistente.`);

            } else if (type === 'objectives') {
               // Obiettivi allineati alla vision - LOGICA IMPACT-DRIVEN V2
               console.log("AI Service: Generating objectives with context:", prompt);

               const visionText = (prompt.vision || "").toLowerCase() + " " + (prompt.problem || "").toLowerCase();

               // 1. Strategic Intent Detection (Shared Logic)
               const intentKeywords = {
                  leadership: ['n.1', 'leader', 'mercato', 'market', 'posizionamento', 'brand', 'riferimento', 'top', 'ceo', 'manager', 'vision'],
                  efficiency: ['costi', 'ridur', 'waste', 'sprechi', 'automazion', 'risparmi', 'efficienz', 'velocit', 'tempo', 'time', 'process', 'manutenzion', 'refactoring'],
                  innovation: ['ai', 'artificial', 'adoption', 'nuovo', 'innovazion', 'tecnolog', 'modern', 'digital', 'trasformazion', 'intelligenz'],
                  growth: ['vendit', 'fatturat', 'aument', 'crescit', 'revenue', 'client', 'acquisizion', 'espansion', 'business'],
                  quality: ['bug', 'difett', 'error', 'qualit', 'test', 'affidabil', 'incident', 'stabil', 'sicurezz', 'compliance']
               };

               let primaryIntent = 'generic';
               let maxScore = 0;

               for (const [intent, keywords] of Object.entries(intentKeywords)) {
                  let score = 0;
                  keywords.forEach(word => {
                     if (visionText.includes(word)) score += 1;
                  });
                  if (intent === 'efficiency' && (visionText.includes('automati') || visionText.includes('manuten'))) score += 2;
                  if (score > maxScore) {
                     maxScore = score;
                     primaryIntent = intent;
                  }
               }
               console.log(`AI Objectives Logic: Detected STRATEGIC INTENT '${primaryIntent}'`);

               const objectives = [];

               switch (primaryIntent) {
                  case 'leadership':
                     objectives.push({
                        text: `Diventare la soluzione N.1 per ${prompt.targetAudience || 'il mercato'} entro il prossimo Q4.`,
                        rationale: 'Necessario per consolidare la posizione dominante e attrarre investitori.'
                     });
                     objectives.push({
                        text: `Raggiungere un NPS > 70 offrendo un'esperienza utente "best-in-class".`,
                        rationale: 'La fedeltà del cliente è il principale motore di crescita organica a lungo termine.'
                     });
                     objectives.push({
                        text: `Stabilire una partnership strategica con Top Player del settore.`,
                        rationale: 'Accresce la Brand Authority e apre nuovi canali di distribuzione.'
                     });
                     break;
                  case 'efficiency':
                     objectives.push({
                        text: `Ridurre i costi operativi (OpEx) del 20% tramite automazione intelligente.`,
                        rationale: 'Ottimizzazione necessaria per migliorare i margini e liberare risorse per R&D.'
                     });
                     objectives.push({
                        text: `Dimezzare il Cycle Time dei processi core da X a Y giorni.`,
                        rationale: 'La velocità di esecuzione è il nostro vantaggio competitivo principale.'
                     });
                     objectives.push({
                        text: `Automatizzare l'80% delle attività ripetitive di manutenzione.`,
                        rationale: 'Eliminare il lavoro a basso valore aggiunto permette al team di innovare.'
                     });
                     break;
                  case 'innovation':
                     objectives.push({
                        text: `Lanciare la nuova piattaforma AI-driven con adozione > 60% al Day 1.`,
                        rationale: 'L\'innovazione tecnologica è la leva per distanziare la concorrenza.'
                     });
                     objectives.push({
                        text: `Ridurre il Time-to-Value per i nuovi clienti a meno di 15 giorni.`,
                        rationale: 'Accelerare il valore percepito riduce il churn iniziale.'
                     });
                     objectives.push({
                        text: `Implementare funzionalità predittive per anticipare i bisogni dell'utente.`,
                        rationale: 'Passare da un approccio reattivo a proattivo fidelizza il cliente.'
                     });
                     break;
                  default:
                     objectives.push({
                        text: `Diventare leader di mercato risolvendo le criticità di ${prompt.targetAudience || 'utenti'}.`,
                        rationale: 'Obiettivo di posizionamento standard per guidare la crescita.'
                     });
                     objectives.push({
                        text: `Aumentare l'efficienza operativa riducendo gli sprechi del 20%.`,
                        rationale: 'Miglioramento della bottom-line aziendale.'
                     });
                     objectives.push({
                        text: `Validare il Product-Market Fit con 50 clienti paganti.`,
                        rationale: 'Validazione essenziale prima di scalare gli investimenti.'
                     });
               }

               resolve(objectives);

            } else if (type === 'kpi') {
               const objectiveText = (prompt.objective || "").toLowerCase();
               const kpis = [];

               // 1. Estrazione Parametri Numerici
               const numberMatch = objectiveText.match(/(\d+)(%|k|m)?/);
               const extractedTarget = numberMatch ? (objectiveText.includes('ridur') || objectiveText.includes('diminuir') ? `< ${numberMatch[0]}` : `> ${numberMatch[0]}`) : null;

               // 2. Mappa Keywords -> KPI Categories (Expanded)
               const intentKeywords = {
                  leadership: ['n.1', 'leader', 'mercato', 'market', 'posizionamento', 'brand', 'riferimento', 'top', 'ceo', 'manager', 'vision'],
                  efficiency: ['costi', 'ridur', 'waste', 'sprechi', 'automazion', 'risparmi', 'efficienz', 'velocit', 'tempo', 'time', 'process', 'manutenzion', 'refactoring'],
                  innovation: ['ai', 'artificial', 'adoption', 'nuovo', 'innovazion', 'tecnolog', 'modern', 'digital', 'trasformazion', 'intelligenz'],
                  growth: ['vendit', 'fatturat', 'aument', 'crescit', 'revenue', 'client', 'acquisizion', 'espansion', 'business'],
                  quality: ['bug', 'difett', 'error', 'qualit', 'test', 'affidabil', 'incident', 'stabil', 'sicurezz', 'compliance']
               };

               let primaryIntent = 'generic';
               let maxScore = 0;

               // Punteggio pesato: parole esatte valgono di più
               for (const [intent, keywords] of Object.entries(intentKeywords)) {
                  let score = 0;
                  keywords.forEach(word => {
                     if (objectiveText.includes(word)) score += 1;
                  });

                  // Boost specifici per disambiguare
                  if (intent === 'efficiency' && (objectiveText.includes('automati') || objectiveText.includes('manuten'))) score += 2;

                  if (score > maxScore) {
                     maxScore = score;
                     primaryIntent = intent;
                  }
               }

               // Fallback intelligente per "code maintenance" se non catturato sopra
               if (objectiveText.includes('codice') || objectiveText.includes('software')) {
                  if (primaryIntent === 'generic') primaryIntent = 'efficiency';
               }

               console.log(`AI KPI Logic: Detected STRATEGIC INTENT '${primaryIntent}' for objective '${objectiveText}'`);

               // VAGUE OBJECTIVE CHECK
               if (primaryIntent === 'generic' && maxScore < 2 && objectiveText.length < 20) {
                  kpis.push({
                     name: '⚠️ Obiettivo Troppo Vago',
                     target: 'N/A',
                     rationale: 'Specifica meglio: vuoi efficienza costi o velocità sul mercato?'
                  });
                  kpis.push({
                     name: 'Suggerimento: Definire Scope',
                     target: 'SMART',
                     rationale: 'Aggiungi numeri o date (es. "entro Q4", "ridurre del 20%").'
                  });
                  resolve(kpis);
                  return;
               }

               // 3. Generazione KPI con Razionale
               switch (primaryIntent) {
                  case 'leadership':
                     kpis.push({
                        name: 'NPS (Net Promoter Score)',
                        target: '> 70',
                        rationale: 'Misura quanto i CEO/Manager sono disposti a raccomandare la tua soluzione.'
                     });
                     kpis.push({
                        name: 'Market Share (Segmento)',
                        target: 'Top 3',
                        rationale: 'Posizionamento rispetto ai competitor diretti che offrono servizi simili.'
                     });
                     kpis.push({
                        name: 'Brand Authority Index',
                        target: '> 8/10',
                        rationale: 'Percezione del valore del brand da parte degli stakeholder chiave.'
                     });
                     break;

                  case 'efficiency':
                     if (objectiveText.includes('cost')) {
                        kpis.push({
                           name: 'OpEx Reduction',
                           target: '- 20%',
                           rationale: 'Indicatore chiave per il risparmio sui costi operativi totali.'
                        });
                     }
                     if (objectiveText.includes('automazion') || objectiveText.includes('ai') || objectiveText.includes('manuten')) {
                        kpis.push({
                           name: 'Automation Hit Rate',
                           target: '> 85%',
                           rationale: 'Percentuale di processi/task gestiti automaticamente senza intervento umano.'
                        });
                        kpis.push({
                           name: 'Maintenance Effort Reduction',
                           target: '- 40%',
                           rationale: 'Riduzione ore uomo dedicate a task di manutenzione ripetitivi.'
                        });
                     } else {
                        kpis.push({
                           name: 'Cycle Time Reduction',
                           target: '- 30%',
                           rationale: 'Riduzione della durata media dei cicli grazie all\'eliminazione delle frizioni.'
                        });
                     }
                     kpis.push({
                        name: 'Lead Time per Strategia',
                        target: '- 25%',
                        rationale: 'Tempo recuperato nell\'execution strategica post-ottimizzazione.'
                     });
                     break;

                  case 'innovation':
                     kpis.push({
                        name: 'AI Adoption Rate',
                        target: '> 60%',
                        rationale: 'Percentuale di processi strategici gestiti tramite modelli AI dai team.'
                     });
                     kpis.push({
                        name: 'Time to Value (TtV)',
                        target: '< 15 giorni',
                        rationale: 'Tempo medio tra l\'inizio del progetto e il primo risultato tangibile.'
                     });
                     break;

                  case 'growth':
                     kpis.push({
                        name: 'MRR Growth QoQ',
                        target: '> 15%',
                        rationale: 'Crescita trimestrale dei ricavi ricorrenti, vitale per la scalabilità.'
                     });
                     kpis.push({
                        name: 'CAC Payback Period',
                        target: '< 6 mesi',
                        rationale: 'Tempo necessario per rientrare del costo di acquisizione cliente.'
                     });
                     break;

                  case 'quality':
                     kpis.push({
                        name: 'Bug Escape Rate',
                        target: '< 2%',
                        rationale: 'Percentuale di difetti che raggiungono il cliente finale (target eccellenza).'
                     });
                     kpis.push({
                        name: 'Technical Debt Ratio',
                        target: '< 5%',
                        rationale: 'Mantenimento di un codice pulito per garantire evolutività futura.'
                     });
                     break;

                  default:
                     // Fallback "Strong"
                     kpis.push({
                        name: 'ROI (Return on Investment)',
                        target: '> 120%',
                        rationale: 'Ritorno economico generato rispetto all\'investimento effettuato.'
                     });
                     kpis.push({
                        name: 'Employee Engagement',
                        target: '> 8.5/10',
                        rationale: 'Livello di coinvolgimento del team, precursore della produttività.'
                     });
               }

               // 4. Arricchimento Mix & Match e Cleanup
               if ((objectiveText.includes('ai') || objectiveText.includes('intelligence')) && primaryIntent !== 'innovation') {
                  kpis.push({
                     name: 'AI Adoption Rate',
                     target: '> 50%',
                     rationale: 'Integrazione dell\'AI nei processi core.'
                  });
               }

               const uniqueKpis = kpis.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
               resolve(uniqueKpis.slice(0, 4));

            } else if (type === 'team') {
               // Team industriale
               resolve(`Composizione del team consigliata per progetti industriali:
   
   👔 **Leadership**
   • 1 Project manager / Responsabile di progetto
   • 1 Product owner (esperto di processo)
   
   🔧 **Operazioni**
   • 1-2 Ingegneri di processo
   • 1-2 Tecnici di automazione
   • 1 Responsabile qualità
   
   📊 **Supporto**
   • 1 Analista dati / Business analyst
   • 1 Specialista IT integrazione
   • 1 Responsabile manutenzione
   
   🎓 **Formazione**
   • 1 Change manager / Formatore interno
   
   💡 Suggerimento: coinvolgere operatori di linea come "super-user" per garantire adozione e feedback dal campo.`);

            } else if (type === 'backlog') {
               // Backlog industriale - Epic legate alla produzione - LOGICA IMPACT-DRIVEN V2
               // Recuperiamo l'intento strategico dalla vision (copiamo la logica usata sopra per coerenza)
               const visionText = (prompt.vision || "").toLowerCase();
               let context = 'generic';
               if (visionText.includes('automat') || visionText.includes('cost')) context = 'efficiency';
               else if (visionText.includes('innov') || visionText.includes('ai')) context = 'innovation';
               else if (visionText.includes('leader') || visionText.includes('mercato')) context = 'leadership';

               const epics = [];

               if (context === 'efficiency') {
                  epics.push({
                     id: 1,
                     title: 'Epic: Automazione dei Processi Critici',
                     stories: [
                        { id: 101, title: 'Come COO, voglio automatizzare il data entry per ridurre gli errori manuali.', keyResult: 'Riduzione errori del 90%' },
                        { id: 102, title: 'Come operatore, voglio trigger automatici per la manutenzione.', keyResult: 'OEE +5%' }
                     ]
                  });
                  epics.push({
                     id: 2,
                     title: 'Epic: Ottimizzazione Workflow',
                     stories: [
                        { id: 201, title: 'Come manager, voglio vedere le strozzature in tempo reale.', keyResult: 'Cycle time -20%' },
                        { id: 202, title: 'Come team, voglio assegnazione task automatica basata sulla capacità.', keyResult: 'Carico lavoro bilanciato' }
                     ]
                  });
               } else if (context === 'innovation') {
                  epics.push({
                     id: 1,
                     title: 'Epic: Integrazione AI Core',
                     stories: [
                        { id: 101, title: 'Come utente, voglio suggerimenti proattivi dall\'AI durante il lavoro.', keyResult: 'Adozione feature 60%' },
                        { id: 102, title: 'Come data scientist, voglio accesso ai dati grezzi via API.', keyResult: 'Time-to-insight < 4h' }
                     ]
                  });
                  epics.push({
                     id: 2,
                     title: 'Epic: Nuova Esperienza Utente',
                     stories: [
                        { id: 201, title: 'Come cliente, voglio configurare il prodotto via linguaggio naturale.', keyResult: 'NPS +10 punti' },
                        { id: 202, title: 'Come admin, voglio dashboard predittive.', keyResult: 'Decisioni 2x più veloci' }
                     ]
                  });
               } else {
                  // Fallback / Leadership
                  epics.push({
                     id: 1,
                     title: 'Epic: Posizionamento Strategico',
                     stories: [
                        { id: 101, title: 'Come marketing, voglio analisi dei trend per anticipare il mercato.', keyResult: 'First mover advantage' },
                        { id: 102, title: 'Come vendite, voglio demo personalizzate per settore.', keyResult: 'Conversion Rate +5%' }
                     ]
                  });
                  epics.push({
                     id: 2,
                     title: 'Epic: Eccellenza Operativa',
                     stories: [
                        { id: 201, title: 'Come manager, voglio reportistica unificata.', keyResult: 'Single source of truth' },
                        { id: 202, title: 'Come IT, voglio stack scalabile per supporto global.', keyResult: 'Uptime 99.99%' }
                     ]
                  });
               }

               // Aggiunge sempre una Epic di Sicurezza/Foundation
               epics.push({
                  id: 3,
                  title: 'Epic: Fondamenta Tecniche & Sicurezza',
                  stories: [
                     { id: 301, title: 'Come CISO, voglio audit log completi di tutte le operazioni.', keyResult: 'Compliance 100%' },
                     { id: 302, title: 'Come devops, voglio pipeline CI/CD interamente automatizzata.', keyResult: 'Deploy giornalieri' }
                  ]
               });

               resolve(epics);

            } else if (type === 'roadmap_mvp') {
               // Roadmap AI Calculation - HOURS BASED
               const devCount = prompt.devCount || 1;
               const hoursPerDay = prompt.hoursPerDay || 6;
               const sprintDays = prompt.sprintDays || 10;
               const sprintDurationWeeks = prompt.sprintDurationWeeks || 2;

               // Capacity per sprint
               const teamCapacityPerSprint = devCount * hoursPerDay * sprintDays;

               // AI estimates hours for the scope (simulated)
               const scopeCount = prompt.selectedScope?.length || 0;

               // Mock logic: Average 15-25 hours per "Story/Feature" in the scope
               let totalEstimatedHours = 0;
               (prompt.selectedScope || []).forEach(() => {
                  totalEstimatedHours += Math.floor(Math.random() * 20) + 10; // 10-30 hours per story
               });

               // Adjust by totalPoints if provided as a multiplier check
               const pointMultiplier = 8; // approx 8 hours per point
               if (prompt.totalPoints && prompt.totalPoints > 0) {
                  // Weighted average between pure count and point based
                  const pointEstimate = prompt.totalPoints * pointMultiplier;
                  totalEstimatedHours = Math.floor((totalEstimatedHours + pointEstimate) / 2);
               }

               const sprintsNeeded = Math.ceil(totalEstimatedHours / teamCapacityPerSprint);

               // Date calc
               const weeksNeeded = sprintsNeeded * sprintDurationWeeks;
               const today = new Date();
               const projectedDate = new Date(today.setDate(today.getDate() + (weeksNeeded * 7)));

               const targetDateObj = new Date(prompt.targetDate);
               const achievable = projectedDate <= targetDateObj;

               const analysis = {
                  sprintsNeeded,
                  teamCapacityPerSprint,
                  totalEstimatedHours,
                  achievable,
                  projectedDate: projectedDate.toISOString().split('T')[0],
                  analysis: achievable
                     ? `Ottimo! Il team ha una capacità di ${teamCapacityPerSprint} ore/sprint. Il lavoro è stimato in circa ${totalEstimatedHours} ore. Basteranno ${sprintsNeeded} sprint per completare l'MVP entro il ${prompt.targetDate}.`
                     : `Attenzione. Con ${devCount} sviluppatori (${teamCapacityPerSprint} ore/sprint), servono ${sprintsNeeded} sprint per coprire le ${totalEstimatedHours} ore stimate. La data del ${prompt.targetDate} è a rischio. Consigliamo di ridurre lo scope o aggiungere risorse.`
               };

               resolve(analysis);

            } else if (type === 'estimates') {
               // Stima Story Points per User Stories
               const estimates = {};
               const stories = prompt.stories || [];
               stories.forEach(story => {
                  let points = 1;
                  const text = (story.title || '').toLowerCase();
                  if (text.includes('dashboard') || text.includes('report') || text.includes('analisi')) points = 8;
                  else if (text.includes('api') || text.includes('backend') || text.includes('integrazione')) points = 5;
                  else if (text.includes('form') || text.includes('login') || text.includes('ui')) points = 3;
                  else if (text.includes('setup') || text.includes('config')) points = 2;
                  else points = Math.floor(Math.random() * 5) + 1; // Random variation 1-5 for generic

                  // Fibonacci-ish adjustment
                  if (points > 13) points = 13;
                  else if (points > 8) points = 13;
                  else if (points > 5) points = 8;
                  else if (points > 3) points = 5;

                  estimates[story.id] = points;
               });
               resolve(estimates);

            } else if (type === 'sprint_planning') {
               // Generazione Task Operativi da Stories - WITH ESTIMATED HOURS
               const tasks = [];
               const stories = prompt.stories || [];
               if (!stories || stories.length === 0) {
                  resolve([]); // Handle empty stories gracefully
                  return;
               }

               let taskIdBase = Date.now();


               // Limit removed as per user request
               const targetStories = stories;

               targetStories.forEach((story, idx) => {
                  const safeTitle = story.title || "Untitled Story";
                  const storyTitle = safeTitle.substring(0, 40) + (safeTitle.length > 40 ? '...' : '');

                  // Generate Hours
                  const feHours = Math.floor(Math.random() * 4) + 2; // 2-6 hours
                  const beHours = Math.floor(Math.random() * 5) + 3; // 3-8 hours
                  const qaHours = Math.floor(Math.random() * 2) + 1; // 1-3 hours

                  // Frontend Task
                  tasks.push({
                     id: taskIdBase + (idx * 10) + 1,
                     title: `FE: Implementare UI per "${storyTitle}"`,
                     storyId: story.id,
                     status: 'backlog',
                     assignee: 'Frontend Dev',
                     estimated: feHours,
                     remaining: feHours
                  });

                  // Backend Task
                  tasks.push({
                     id: taskIdBase + (idx * 10) + 2,
                     title: `BE: API/Logica per "${storyTitle}"`,
                     storyId: story.id,
                     status: 'backlog',
                     assignee: 'Backend Dev',
                     estimated: beHours,
                     remaining: beHours
                  });

                  // QA/Test Task
                  tasks.push({
                     id: taskIdBase + (idx * 10) + 3,
                     title: `QA: Test e verifica per "${storyTitle}"`,
                     storyId: story.id,
                     status: 'backlog',
                     assignee: 'QA',
                     estimated: qaHours,
                     remaining: qaHours
                  });
               });

               resolve(tasks);

            } else if (type === 'task_estimates') {
               const estimates = {};
               const tasks = prompt.tasks || [];
               tasks.forEach(task => {
                  let hours = 2;
                  const text = (task.title || '').toLowerCase();
                  if (text.includes('fe:')) hours = 4;
                  else if (text.includes('be:')) hours = 6;
                  else if (text.includes('qa:')) hours = 3;
                  else if (text.includes('effettuare')) hours = 2;

                  hours += Math.floor(Math.random() * 3) - 1;
                  if (hours < 1) hours = 1;

                  estimates[task.id] = hours;
               });
               resolve(estimates);

            } else {
               resolve("Suggerimento generato in base al contesto industriale del tuo progetto.");
            }
         } catch (error) {
            console.error("AI Service Error:", error);
            // Resolve with fallback or empty to unblock await
            resolve([]);
         }
      }, 1500);
   });
};

// Helper per generare suggerimenti contestuali basati sulla vision
export const generateContextualSuggestion = (vision, type) => {
   // Questa funzione può essere estesa per analizzare la vision
   // e generare suggerimenti più specifici
   return generateAIResponseV2({ projectName: vision }, type);
};
