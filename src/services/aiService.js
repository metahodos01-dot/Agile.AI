// AI Service per Industria - Risposte in Italiano
// Orientato a settori industriali: manifattura, produzione, logistica, automazione
// In produzione, questo si collegherà a OpenAI/Gemini API

export const generateAIResponse = async (prompt, type) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (type === 'vision') {
                // Vision orientata all'industria
                const productName = prompt.projectName || 'Il prodotto';
                const target = prompt.targetAudience || 'le aziende manifatturiere';
                const problem = prompt.problem || 'l\'efficienza dei processi produttivi';
                const currentSolution = prompt.currentSolution || 'processi manuali e strumenti non integrati';
                const differentiation = prompt.differentiation || 'automazione intelligente e integrazione completa';

                resolve(`PER ${target}, CHE hanno bisogno di risolvere ${problem}, ${productName} È una soluzione industriale CHE offre ${differentiation}. 

A DIFFERENZA delle soluzioni attuali (${currentSolution}), IL NOSTRO PRODOTTO garantisce riduzione dei costi operativi, maggiore efficienza e controllo completo della catena del valore.

🎯 Proposta di valore chiave:
• Riduzione tempi di ciclo e sprechi
• Miglioramento della qualità e tracciabilità
• Integrazione con i sistemi esistenti (ERP, MES, SCADA)
• ROI misurabile entro 12 mesi`);

            } else if (type === 'objectives') {
                // Obiettivi industriali legati alla vision
                const productName = prompt.projectName || 'del progetto';

                resolve(`Basandomi sulla vision di ${productName}, ecco gli obiettivi strategici:

1. **Obiettivo**: Ottimizzare l'efficienza produttiva
   - KR1: Ridurre i tempi di ciclo del 20%
   - KR2: Diminuire gli scarti di produzione del 15%
   - KR3: Aumentare l'OEE (Overall Equipment Effectiveness) all'85%

2. **Obiettivo**: Migliorare la qualità del prodotto
   - KR1: Ridurre i difetti a meno di 50 PPM
   - KR2: Implementare controllo qualità in-line al 100%
   - KR3: Ottenere certificazione di settore entro 6 mesi

3. **Obiettivo**: Ridurre i costi operativi
   - KR1: Tagliare i costi energetici del 10%
   - KR2: Ottimizzare il magazzino riducendo le scorte del 25%
   - KR3: Diminuire i fermi macchina non pianificati del 30%

4. **Obiettivo**: Accelerare il time-to-market
   - KR1: Ridurre il lead time di produzione del 25%
   - KR2: Implementare cambio formato rapido (SMED) in 4 linee
   - KR3: Digitalizzare il 100% della documentazione di processo`);

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
    return generateAIResponse({ projectName: vision }, type);
};
