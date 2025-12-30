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
               // Obiettivi allineati alla vision
               console.log("AI Service: Generating objectives with context:", prompt);

               const productName = prompt.projectName || 'Il Prodotto';
               const target = prompt.targetAudience || 'il target';

               // Return valid JSON array logic for the "fake" AI
               // In a real LLM, we'd parse the response. Here we construct it.
               const objectives = [
                  `🎯 Diventare la soluzione N.1 per ${prompt.targetAudience || 'il mercato'}, risolvendo ${prompt.problem || 'il problema principale'}.`,
                  `🚀 Eliminare "${prompt.problem || 'inefficienze'}" e ridurre i costi operativi del 20%.`,
                  `⭐ Raggiungere un NPS > 60 offrendo con ${prompt.projectName || 'il prodotto'} un'esperienza unica.`
               ];

               resolve(objectives);

            } else if (type === 'kpi') {
               // KPI Generati contestualmente all'obiettivo - LOGICA AVANZATA
               const objectiveText = (prompt.objective || "").toLowerCase();
               const kpis = [];

               // 1. Estrazione Parametri Numerici (es. "aumentare del 20%")
               const numberMatch = objectiveText.match(/(\d+)(%|k|m)?/);
               const extractedTarget = numberMatch ? (objectiveText.includes('ridur') || objectiveText.includes('diminuir') ? `< ${numberMatch[0]}` : `> ${numberMatch[0]}`) : null;

               // 2. Mappa Keywords -> KPI Categories
               const keywords = {
                  commerciale: ['vendit', 'fatturat', 'revenue', 'profitt', 'economic', 'commercial', 'money', 'euro', 'margin'],
                  marketing: ['lead', 'campagn', 'traffico', 'visit', 'conversion', 'tasso', 'funnel', 'marketing', 'sito'],
                  prodotto: ['utent', 'attiv', 'adozion', 'feature', 'funzionalit', 'prodotto', 'app', 'mobile', 'software'],
                  tecnico: ['performance', 'velocit', 'caricamento', 'scalab', 'infrastruttur', 'cloud', 'devops', 'api', 'latenza', 'uptime'],
                  qualita: ['bug', 'difett', 'error', 'qualit', 'test', 'affidabil', 'incident', 'stabil'],
                  processo: ['team', 'agile', 'scrum', 'velocit', 'sprint', 'produttivit', 'efficienz', 'costi', 'process'],
                  cliente: ['nps', 'soddisfa', 'ticket', 'support', 'assistenz', 'customer', 'feedback', 'retention', 'churn'],
                  produzione: ['scarti', 'oee', 'fermi', 'macchina', 'manutenzion', 'magazzino', 'sicurezza']
               };

               let detectedContext = 'generico';

               // Rilevamento contesto dominante
               for (const [context, terms] of Object.entries(keywords)) {
                  if (terms.some(term => objectiveText.includes(term))) {
                     detectedContext = context;
                     break; // Prendi il primo match forte
                  }
               }

               // 3. Generazione KPI basata sul contesto
               console.log(`AI KPI Logic: Detected context '${detectedContext}' for objective '${objectiveText}'`);

               switch (detectedContext) {
                  case 'commerciale':
                     kpis.push({ name: 'MRR (Monthly Recurring Revenue)', target: extractedTarget || '> 50k €' });
                     kpis.push({ name: 'CAC (Customer Acquisition Cost)', target: '< 150 €' });
                     break;
                  case 'marketing':
                     kpis.push({ name: 'Conversion Rate', target: extractedTarget || '> 3.5%' });
                     kpis.push({ name: 'Cost Per Lead (CPL)', target: '< 25 €' });
                     break;
                  case 'prodotto':
                     kpis.push({ name: 'MAU (Monthly Active Users)', target: extractedTarget || '> 1000' });
                     kpis.push({ name: 'Adoption Rate', target: '> 60%' });
                     break;
                  case 'tecnico':
                     kpis.push({ name: 'Server Response Time', target: '< 200 ms' });
                     kpis.push({ name: 'System Uptime', target: '> 99.9%' });
                     break;
                  case 'qualita':
                     kpis.push({ name: 'Bug Escape Rate', target: extractedTarget || '< 2%' });
                     kpis.push({ name: 'MTZ (Mean Time to Zero Bugs)', target: '< 48h' });
                     break;
                  case 'processo':
                     kpis.push({ name: 'Cycle Time', target: extractedTarget || '< 5 giorni' });
                     kpis.push({ name: 'Planned vs Actual', target: '> 90%' });
                     break;
                  case 'cliente':
                     kpis.push({ name: 'NPS (Net Promoter Score)', target: extractedTarget || '> 50' });
                     kpis.push({ name: 'Churn Rate', target: '< 5%' });
                     break;
                  case 'produzione':
                     kpis.push({ name: 'OEE (Equipment Effectiveness)', target: extractedTarget || '> 85%' });
                     kpis.push({ name: 'PPM (Parti difettose per milione)', target: '< 50' });
                     break;
                  default:
                     // Fallback intelligente se non matchano keyword specifiche ma sembra software
                     if (objectiveText.includes('software') || objectiveText.includes('app')) {
                        kpis.push({ name: 'Release Frequency', target: 'Bi-settimanale' });
                        kpis.push({ name: 'Change Failure Rate', target: '< 10%' });
                     } else {
                        // Fallback generico business
                        kpis.push({ name: 'Completion Rate', target: '100%' });
                        kpis.push({ name: 'ROI', target: '> 15%' });
                     }
               }

               resolve(kpis);

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
               // Backlog industriale - Epic legate alla produzione
               // Dynamic Backlog Generation
               const epics = [
                  {
                     id: 1,
                     title: `Core: Risoluzione di ${prompt.problem || 'problema principale'}`,
                     stories: [
                        {
                           id: 101,
                           title: `Come ${prompt.targetAudience || 'utente'}, voglio una dashboard intuitiva per monitorare i KPI critici.`,
                           keyResult: "Riduzione tempi di analisi del 30%"
                        },
                        {
                           id: 102,
                           title: `Come amministratore, voglio configurare i parametri chiave per adattarli al mio processo.`,
                           keyResult: "Setup iniziale in < 1 ora"
                        },
                        {
                           id: 103,
                           title: `Come utente operativo, voglio ricevere notifiche automatiche su anomalie.`,
                           keyResult: "Tempi di reazione ridotti del 50%"
                        }
                     ]
                  },
                  {
                     id: 2,
                     title: `Innovation: ${prompt.differentiation || 'Funzionalità distintive'}`,
                     stories: [
                        {
                           id: 201,
                           title: `Come ${prompt.targetAudience || 'utente'}, voglio utilizzare algoritmi predittivi per anticipare i problemi.`,
                           keyResult: "Prevenzione errori del 25%"
                        },
                        {
                           id: 202,
                           title: `Come analista, voglio report automatici generati dall'AI.`,
                           keyResult: "Risparmio 4 ore/settimana per report"
                        }
                     ]
                  },
                  {
                     id: 3,
                     title: `Scale & Security per ${prompt.projectName || 'il progetto'}`,
                     stories: [
                        {
                           id: 301,
                           title: `Come CTO, voglio garantire la sicurezza dei dati sensibili con crittografia end-to-end.`,
                           keyResult: "Compliance GDPR 100%"
                        },
                        {
                           id: 302,
                           title: `Come utente, voglio accedere da mobile con le stesse funzionalità desktop.`,
                           keyResult: "Adozione mobile > 40%"
                        }
                     ]
                  }
               ];
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
