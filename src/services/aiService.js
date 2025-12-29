// AI Service per Industria - Risposte in Italiano
// Orientato a settori industriali: manifattura, produzione, logistica, automazione
// In produzione, questo si collegherà a OpenAI/Gemini API

export const generateAIResponseV2 = async (prompt, type) => {
   return new Promise((resolve) => {
      setTimeout(() => {
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
            const problem = prompt.problem || 'il problema principale';

            // Return valid JSON array logic for the "fake" AI
            // In a real LLM, we'd parse the response. Here we construct it.
            const objectives = [
               `🎯 Diventare la soluzione N.1 per ${prompt.targetAudience || 'il mercato'}, risolvendo ${prompt.problem || 'il problema principale'}.`,
               `🚀 Eliminare "${prompt.problem || 'inefficienze'}" e ridurre i costi operativi del 20%.`,
               `⭐ Raggiungere un NPS > 60 offrendo con ${prompt.projectName || 'il prodotto'} un'esperienza unica.`
            ];

            resolve(objectives);

         } else if (type === 'kpi') {
            // KPI industriali
            resolve(`KPI suggeriti per il settore industriale:

📊 **Efficienza produttiva**
• OEE (Overall Equipment Effectiveness)
• Tempo di ciclo medio
• Tasso di utilizzo impianti
• Lead time di produzione

📈 **Qualità**
• Tasso di difettosità (PPM - Parti Per Milione)
• First Pass Yield (FPY)
• Costo della non-qualità
• Reclami cliente

💰 **Costi**
• Costo per unità prodotta
• Consumo energetico per unità
• Valore del magazzino (giorni di copertura)
• Costo manutenzione per asset

🚚 **Logistica e consegne**
• On-Time Delivery (OTD)
• Tasso di evasione ordini
• Tempo medio di consegna
• Precisione dell'inventario`);

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
            // Roadmap AI Calculation
            const velocity = prompt.velocity || 20;
            const totalPoints = prompt.totalPoints || 0;
            const sprintsNeeded = Math.ceil(totalPoints / velocity);

            // Simple date calc
            const weeksNeeded = sprintsNeeded * 2;
            const today = new Date();
            const projectedDate = new Date(today.setDate(today.getDate() + (weeksNeeded * 7)));

            const targetDateObj = new Date(prompt.targetDate);
            const achievable = projectedDate <= targetDateObj;

            const analysis = {
               sprintsNeeded,
               achievable,
               projectedDate: projectedDate.toISOString().split('T')[0],
               analysis: achievable
                  ? `Ottimo! Con una velocity di ${velocity} pt/sprint, puoi completare i ${totalPoints} punti in ${sprintsNeeded} sprint, arrivando prima del ${prompt.targetDate}. Hai un margine di sicurezza.`
                  : `Attenzione. Servono ${sprintsNeeded} sprint (${weeksNeeded} settimane) per completare il lavoro. La data target ${prompt.targetDate} è troppo vicina. Consigliamo di ridurre lo scope (rimuovere feature non essenziali) o aumentare il team.`
            };

            resolve(analysis);

         } else if (type === 'estimates') {
            // Stima Story Points per User Stories
            const estimates = {};
            const stories = prompt.stories || [];
            stories.forEach(story => {
               // Logic to vary estimates based on keywords/length
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
            // Generazione Task Operativi da Stories
            const tasks = [];
            const stories = prompt.stories || [];
            let taskIdBase = Date.now();

            // Take top priority stories (first 5-6) or all
            const targetStories = stories.slice(0, 8);

            targetStories.forEach((story, idx) => {
               const storyTitle = story.title.substring(0, 40) + (story.title.length > 40 ? '...' : '');

               // Frontend Task
               tasks.push({
                  id: taskIdBase + (idx * 10) + 1,
                  title: `FE: Implementare UI per "${storyTitle}"`,
                  storyId: story.id,
                  status: 'backlog', // In "Operational Backlog"
                  assignee: 'Frontend Dev',
                  estimated: 0,
                  remaining: 0
               });

               // Backend Task
               tasks.push({
                  id: taskIdBase + (idx * 10) + 2,
                  title: `BE: API/Logica per "${storyTitle}"`,
                  storyId: story.id,
                  status: 'backlog',
                  assignee: 'Backend Dev',
                  estimated: 0,
                  remaining: 0
               });

               // QA/Test Task
               if (idx % 2 === 0) { // Add test task for every other story to vary
                  tasks.push({
                     id: taskIdBase + (idx * 10) + 3,
                     title: `QA: Test e verifica per "${storyTitle}"`,
                     storyId: story.id,
                     status: 'backlog',
                     assignee: 'QA',
                     estimated: 0,
                     remaining: 0
                  });
               }
            });

            // Ensure ~20 tasks max
            resolve(tasks.slice(0, 25));

         } else if (type === 'task_estimates') {
            // Stima Ore per Task Tecnici
            const estimates = {};
            const tasks = prompt.tasks || [];
            tasks.forEach(task => {
               let hours = 2;
               const text = (task.title || '').toLowerCase();
               if (text.includes('fe:')) hours = 4;
               else if (text.includes('be:')) hours = 6;
               else if (text.includes('qa:')) hours = 3;
               else if (text.includes('effettuare')) hours = 2;

               // Randomize slightly
               hours += Math.floor(Math.random() * 3) - 1; // +/- 1
               if (hours < 1) hours = 1;

               estimates[task.id] = hours;
            });
            resolve(estimates);

         } else {
            resolve("Suggerimento generato in base al contesto industriale del tuo progetto.");
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
