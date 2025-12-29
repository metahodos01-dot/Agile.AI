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
               `🎯 [v1.2] Diventare la soluzione N.1 per ${target}, conquistando il mercato in 12 mesi.`,
               `🚀 [v1.2] Eliminare il problema "${problem}" tagliando i costi del 30%.`,
               `⭐ [v1.2] NPS > 60: Offrire un'esperienza utente senza precedenti con ${productName}.`
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
            resolve(`Epic principali per progetti industriali:

🏭 **1. Digitalizzazione del processo produttivo**
   • Mappatura flussi AS-IS
   • Definizione processo TO-BE
   • Integrazione sensori e IoT

📊 **2. Dashboard di monitoraggio real-time**
   • Visualizzazione KPI di linea
   • Alert e notifiche automatiche
   • Report giornalieri/settimanali

🔧 **3. Gestione manutenzione**
   • Pianificazione manutenzione preventiva
   • Storico interventi e ricambi
   • Analisi predittiva guasti

📦 **4. Ottimizzazione logistica interna**
   • Gestione flussi materiali
   • Tracciabilità lotti
   • Integrazione con magazzino

✅ **5. Controllo qualità integrato**
   • Checklist digitali
   • Registrazione difetti
   • Analisi cause radice

📋 **6. Documentazione e compliance**
   • Istruzioni operative digitali
   • Gestione non conformità
   • Audit trail completo`);

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
