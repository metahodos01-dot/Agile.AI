/**
 * Export Service for Agile.AI
 * Handles exporting project data to various formats including Google Docs
 */

import { supabase } from './supabaseClient';

/**
 * Formats the project data into a structured document
 * @param {Object} project - The project data from context
 * @returns {Object} Formatted document structure
 */
export const formatProjectDocument = (project) => {
    const sections = [];

    // Header
    sections.push({
        type: 'title',
        content: `📋 ${project.name || 'Progetto Agile'} - Documentazione Completa`
    });

    sections.push({
        type: 'subtitle',
        content: `Generato il ${new Date().toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`
    });

    // Vision Section
    if (project.vision) {
        sections.push({
            type: 'heading',
            level: 1,
            content: '🎯 Product Vision'
        });
        sections.push({
            type: 'paragraph',
            content: project.vision
        });
    }

    // Objectives Section
    if (project.objectives && project.objectives.length > 0) {
        sections.push({
            type: 'heading',
            level: 1,
            content: '📌 Obiettivi di Prodotto'
        });
        project.objectives.forEach((obj, index) => {
            sections.push({
                type: 'heading',
                level: 2,
                content: `Obiettivo ${index + 1}: ${obj.title || obj.name || 'Senza titolo'}`
            });
            if (obj.description) {
                sections.push({
                    type: 'paragraph',
                    content: obj.description
                });
            }
            if (obj.priority) {
                sections.push({
                    type: 'paragraph',
                    content: `**Priorità:** ${obj.priority}`
                });
            }
        });
    }

    // KPIs Section
    if (project.kpis && project.kpis.length > 0) {
        sections.push({
            type: 'heading',
            level: 1,
            content: '📊 KPI - Key Performance Indicators'
        });
        project.kpis.forEach((kpi, index) => {
            sections.push({
                type: 'heading',
                level: 2,
                content: `KPI ${index + 1}: ${kpi.name || kpi.title || 'Senza nome'}`
            });
            if (kpi.description) {
                sections.push({
                    type: 'paragraph',
                    content: kpi.description
                });
            }
            if (kpi.target || kpi.targetValue) {
                sections.push({
                    type: 'paragraph',
                    content: `**Target:** ${kpi.target || kpi.targetValue}`
                });
            }
            if (kpi.currentValue !== undefined) {
                sections.push({
                    type: 'paragraph',
                    content: `**Valore Attuale:** ${kpi.currentValue}`
                });
            }
        });
    }

    // Team Section
    if (project.team && project.team.length > 0) {
        sections.push({
            type: 'heading',
            level: 1,
            content: '👥 Team di Progetto'
        });

        sections.push({
            type: 'table',
            headers: ['Nome', 'Ruolo', 'Email'],
            rows: project.team.map(member => [
                member.name || '-',
                member.role || '-',
                member.email || '-'
            ])
        });
    }

    // Obeya Section
    if (project.obeya && Object.keys(project.obeya).length > 0) {
        sections.push({
            type: 'heading',
            level: 1,
            content: '🏠 Obeya Room - Configurazione'
        });

        if (project.obeya.ceremonies && project.obeya.ceremonies.length > 0) {
            sections.push({
                type: 'heading',
                level: 2,
                content: 'Cerimonie Agile'
            });
            project.obeya.ceremonies.forEach(ceremony => {
                sections.push({
                    type: 'bullet',
                    content: `**${ceremony.name || ceremony.type}**: ${ceremony.frequency || ''} ${ceremony.duration ? `(${ceremony.duration})` : ''}`
                });
            });
        }

        if (project.obeya.tools && project.obeya.tools.length > 0) {
            sections.push({
                type: 'heading',
                level: 2,
                content: 'Strumenti'
            });
            project.obeya.tools.forEach(tool => {
                sections.push({
                    type: 'bullet',
                    content: `${tool.name || tool}: ${tool.purpose || ''}`
                });
            });
        }
    }

    // Backlog Section
    if (project.backlog && project.backlog.length > 0) {
        sections.push({
            type: 'heading',
            level: 1,
            content: '📝 Product Backlog'
        });

        project.backlog.forEach((epic, epicIndex) => {
            sections.push({
                type: 'heading',
                level: 2,
                content: `Epic ${epicIndex + 1}: ${epic.title || epic.name || 'Senza titolo'}`
            });
            if (epic.description) {
                sections.push({
                    type: 'paragraph',
                    content: epic.description
                });
            }
            if (epic.stories && epic.stories.length > 0) {
                sections.push({
                    type: 'heading',
                    level: 3,
                    content: 'User Stories'
                });
                epic.stories.forEach((story, storyIndex) => {
                    sections.push({
                        type: 'bullet',
                        content: `**US${epicIndex + 1}.${storyIndex + 1}**: ${story.title || story.name || story.description || 'Senza titolo'}${story.points ? ` (${story.points} pts)` : ''}`
                    });
                });
            }
        });
    }

    // Estimates Section
    if (project.estimates && Object.keys(project.estimates).length > 0) {
        sections.push({
            type: 'heading',
            level: 1,
            content: '⏱️ Stime di Progetto'
        });

        if (project.estimates.totalHours || project.estimates.totalPoints) {
            sections.push({
                type: 'paragraph',
                content: `**Ore Totali Stimate:** ${project.estimates.totalHours || '-'}`
            });
            sections.push({
                type: 'paragraph',
                content: `**Story Points Totali:** ${project.estimates.totalPoints || '-'}`
            });
        }

        if (project.estimates.velocity) {
            sections.push({
                type: 'paragraph',
                content: `**Velocity Team:** ${project.estimates.velocity} pts/sprint`
            });
        }
    }

    // Roadmap Section
    if (project.roadmap && project.roadmap.length > 0) {
        sections.push({
            type: 'heading',
            level: 1,
            content: '🗺️ Roadmap'
        });

        project.roadmap.forEach((release, index) => {
            sections.push({
                type: 'heading',
                level: 2,
                content: `Release ${index + 1}: ${release.name || release.title || 'Senza nome'}`
            });
            if (release.date || release.targetDate) {
                sections.push({
                    type: 'paragraph',
                    content: `**Data Target:** ${release.date || release.targetDate}`
                });
            }
            if (release.description || release.goals) {
                sections.push({
                    type: 'paragraph',
                    content: release.description || release.goals
                });
            }
            if (release.features && release.features.length > 0) {
                sections.push({
                    type: 'heading',
                    level: 3,
                    content: 'Features Incluse'
                });
                release.features.forEach(feature => {
                    sections.push({
                        type: 'bullet',
                        content: typeof feature === 'string' ? feature : (feature.name || feature.title || '')
                    });
                });
            }
        });
    }

    // Sprint Section
    if (project.sprint && Object.keys(project.sprint).length > 0) {
        sections.push({
            type: 'heading',
            level: 1,
            content: '🏃 Sprint Planning'
        });

        if (project.sprint.duration) {
            sections.push({
                type: 'paragraph',
                content: `**Durata Sprint:** ${project.sprint.duration}`
            });
        }
        if (project.sprint.goal) {
            sections.push({
                type: 'paragraph',
                content: `**Sprint Goal:** ${project.sprint.goal}`
            });
        }
    }

    // Kanban Section
    if (project.sprint.kanban && project.sprint.kanban.length > 0) {
        sections.push({
            type: 'heading',
            level: 2,
            content: '📌 Kanban Board Status'
        });

        const columns = [
            { key: 'todo', label: 'Da Fare (To Do)' },
            { key: 'doing', label: 'In Corso (Doing)' },
            { key: 'done', label: 'Fatto (Done)' }
        ];

        columns.forEach(col => {
            const tasks = project.sprint.kanban.filter(t => t.status === col.key);
            if (tasks.length > 0) {
                sections.push({
                    type: 'heading',
                    level: 3,
                    content: col.label
                });
                tasks.forEach(task => {
                    sections.push({
                        type: 'bullet',
                        content: `**${task.title}** ${task.assignee ? `(Assegnato a: ${task.assignee})` : ''}`
                    });
                });
            }
        });

        // Handle any tasks with unknown status
        const unknownTasks = project.sprint.kanban.filter(t => !['todo', 'doing', 'done'].includes(t.status));
        if (unknownTasks.length > 0) {
            sections.push({
                type: 'heading',
                level: 3,
                content: 'Altri Task'
            });
            unknownTasks.forEach(task => {
                sections.push({
                    type: 'bullet',
                    content: `[${task.status}] **${task.title}** ${task.assignee ? `(Assegnato a: ${task.assignee})` : ''}`
                });
            });
        }
    }

    // Calendar Section
    if (project.sprint.calendar && project.sprint.calendar.length > 0) {
        sections.push({
            type: 'heading',
            level: 2,
            content: '📅 Calendario Eventi'
        });

        // Sort events by date
        const sortedEvents = [...project.sprint.calendar].sort((a, b) => new Date(a.date) - new Date(b.date));

        sortedEvents.forEach(event => {
            sections.push({
                type: 'bullet',
                content: `**${event.date}**: ${event.title}`
            });
        });
    }

    // Notes Section
    if (project.sprint.notes) {
        sections.push({
            type: 'heading',
            level: 2,
            content: '📝 Note Daily Standup'
        });
        sections.push({
            type: 'paragraph',
            content: project.sprint.notes
        });
    }

    // Retro Section
    if (project.sprint.start || project.sprint.stop || project.sprint.continue) {
        sections.push({
            type: 'heading',
            level: 2,
            content: '🔄 Retrospettiva'
        });
        if (project.sprint.start && project.sprint.start.some(s => s)) {
            sections.push({ type: 'heading', level: 3, content: 'Iniziare a Fare' });
            project.sprint.start.forEach(s => s && sections.push({ type: 'bullet', content: s }));
        }
        if (project.sprint.stop && project.sprint.stop.some(s => s)) {
            sections.push({ type: 'heading', level: 3, content: 'Smettere di Fare' });
            project.sprint.stop.forEach(s => s && sections.push({ type: 'bullet', content: s }));
        }
        if (project.sprint.continue && project.sprint.continue.some(s => s)) {
            sections.push({ type: 'heading', level: 3, content: 'Continuare a Fare' });
            project.sprint.continue.forEach(s => s && sections.push({ type: 'bullet', content: s }));
        }
    }


    return sections;
};

/**
 * Converts sections to plain text format
 * @param {Array} sections - Document sections
 * @returns {string} Plain text document
 */
export const sectionsToPlainText = (sections) => {
    let text = '';

    sections.forEach(section => {
        switch (section.type) {
            case 'title':
                text += `${'='.repeat(60)}\n`;
                text += `${section.content}\n`;
                text += `${'='.repeat(60)}\n\n`;
                break;
            case 'subtitle':
                text += `${section.content}\n\n`;
                break;
            case 'heading': {
                const prefix = '#'.repeat(section.level);
                text += `\n${prefix} ${section.content}\n\n`;
                break;
            }
            case 'paragraph':
                text += `${section.content}\n\n`;
                break;
            case 'bullet':
                text += `• ${section.content}\n`;
                break;
            case 'table': {
                // Simple table formatting
                const colWidths = section.headers.map((h, i) =>
                    Math.max(h.length, ...section.rows.map(r => (r[i] || '').length))
                );
                const separator = colWidths.map(w => '-'.repeat(w + 2)).join('+');

                text += separator + '\n';
                text += '| ' + section.headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ') + ' |\n';
                text += separator + '\n';
                section.rows.forEach(row => {
                    text += '| ' + row.map((cell, i) => (cell || '').padEnd(colWidths[i])).join(' | ') + ' |\n';
                });
                text += separator + '\n\n';
                break;
            }
            default:
                text += `${section.content || ''}\n`;
        }
    });

    return text;
};

/**
 * Converts sections to Professional HTML format
 * @param {Array} sections - Document sections
 * @returns {string} HTML document
 */
export const sectionsToHTML = (sections) => {
    const today = new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });

    let html = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agile.AI Project Report</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #4F46E5;
            --secondary: #10B981;
            --bg: #F9FAFB;
            --surface: #FFFFFF;
            --text-main: #111827;
            --text-muted: #6B7280;
            --border: #E5E7EB;
        }
        @media (prefers-color-scheme: dark) {
            :root {
                --primary: #818CF8;
                --secondary: #34D399;
                --bg: #111827;
                --surface: #1F2937;
                --text-main: #F9FAFB;
                --text-muted: #9CA3AF;
                --border: #374151;
            }
        }
        body { 
            font-family: 'Inter', sans-serif; 
            background-color: var(--bg);
            color: var(--text-main);
            margin: 0;
            padding: 0;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: var(--surface);
            min-height: 100vh;
            box-shadow: 0 0 20px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .header-banner {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            padding: 60px 40px;
            text-align: center;
        }
        .header-brand {
            font-size: 0.8em;
            text-transform: uppercase;
            letter-spacing: 2px;
            opacity: 0.8;
            margin-bottom: 10px;
        }
        .report-title {
            font-size: 2.5em;
            font-weight: 700;
            margin: 0;
            line-height: 1.2;
        }
        .report-meta {
            margin-top: 20px;
            font-size: 0.9em;
            opacity: 0.9;
            display: flex;
            justify-content: center;
            gap: 20px;
        }
        .content {
            padding: 60px 50px;
        }
        h1 { 
            color: var(--primary); 
            font-size: 1.8em; 
            border-bottom: 2px solid var(--border); 
            padding-bottom: 15px; 
            margin-top: 50px; 
            margin-bottom: 25px;
        }
        h1:first-of-type { margin-top: 0; }
        h2 { 
            font-size: 1.4em; 
            margin-top: 35px; 
            margin-bottom: 15px; 
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        h3 { 
            font-size: 1.1em; 
            color: var(--text-muted); 
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 25px;
        }
        p { margin-bottom: 1.5em; color: var(--text-muted); }
        strong { color: var(--text-main); font-weight: 600; }
        
        .card {
            background: var(--bg);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid var(--border);
        }
        
        table { 
            width: 100%; 
            border-collapse: separate; 
            border-spacing: 0; 
            margin: 25px 0; 
            font-size: 0.95em;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--border);
        }
        th { 
            background-color: var(--bg); 
            color: var(--text-muted); 
            text-transform: uppercase;
            font-size: 0.75em;
            letter-spacing: 1px;
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }
        td { 
            padding: 15px; 
            border-bottom: 1px solid var(--border);
            color: var(--text-main);
        }
        tr:last-child td { border-bottom: none; }
        
        ul { padding-left: 20px; color: var(--text-muted); }
        li { margin-bottom: 8px; position: relative; }
        
        .tag {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: 500;
            background: var(--bg);
            border: 1px solid var(--border);
        }
        
        .footer {
            text-align: center;
            padding: 40px;
            background: var(--bg);
            color: var(--text-muted);
            font-size: 0.8em;
            border-top: 1px solid var(--border);
        }

        @media print {
            body { background: white; color: black; }
            .container { box-shadow: none; max-width: 100%; }
            .header-banner { background: white; color: black; border-bottom: 2px solid #000; padding: 20px 0; }
            .header-banner * { color: black !important; }
            h1 { border-bottom: 1px solid #000; }
            .card { border: 1px solid #ccc; }
        }
    </style>
</head>
<body>
    <div class="container">
`;

    // Process sections to find title for header
    const titleSection = sections.find(s => s.type === 'title');
    const projectTitle = titleSection ? escapeHtml(titleSection.content.replace('📋 ', '').split(' - ')[0]) : 'Project Report';

    html += `
        <div class="header-banner">
            <div class="header-brand">Agile.AI Platform</div>
            <h1 class="report-title">${projectTitle}</h1>
            <div class="report-meta">
                <span>📅 ${today}</span>
                <span>📑 Professional Export</span>
            </div>
        </div>
        <div class="content">
    `;

    sections.forEach(section => {
        if (section.type === 'title' || section.type === 'subtitle') return; // Handled in header

        switch (section.type) {
            case 'heading':
                html += `<h${section.level}>${escapeHtml(section.content)}</h${section.level}>\n`;
                break;
            case 'paragraph':
                html += `<p>${formatMarkdownInline(section.content)}</p>\n`;
                break;
            case 'bullet':
                html += `<ul><li>${formatMarkdownInline(section.content)}</li></ul>\n`;
                break;
            case 'table':
                html += '<div class="card" style="padding:0; border:none; background:transparent;">';
                html += '<table>\n<thead><tr>\n';
                section.headers.forEach(h => html += `<th>${escapeHtml(h)}</th>\n`);
                html += '</tr></thead>\n<tbody>\n';
                section.rows.forEach(row => {
                    html += '<tr>\n';
                    row.forEach(cell => html += `<td>${escapeHtml(cell || '')}</td>\n`);
                    html += '</tr>\n';
                });
                html += '</tbody></table></div>\n';
                break;
            default:
                // Fallback
                if (section.content) html += `<p>${escapeHtml(section.content)}</p>`;
        }
    });

    html += `
        </div>
        <div class="footer">
            <p>Generated by Agile.AI • Empowering Teams with Intelligence</p>
        </div>
    </div>
</body>
</html>`;

    return html;
};

/**
 * Helper function to escape HTML
 */
const escapeHtml = (text) => {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

/**
 * Helper function to format inline markdown (bold)
 */
const formatMarkdownInline = (text) => {
    if (!text) return '';
    return escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

/**
 * Opens Google Docs with the document content
 * Uses Google Docs URL with content parameter
 * @param {Object} project - Project data
 */
export const exportToGoogleDocs = async (project) => {
    const sections = formatProjectDocument(project);
    const plainText = sectionsToPlainText(sections);

    // Create a temporary HTML file and copy content to clipboard
    const html = sectionsToHTML(sections);

    // Create a blob and download as HTML (can be opened in Google Docs)
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Copy plain text to clipboard for pasting into Google Docs
    try {
        await navigator.clipboard.writeText(plainText);
    } catch (err) {
        console.warn('Could not copy to clipboard:', err);
    }

    // Open Google Docs in a new tab
    const googleDocsUrl = 'https://docs.google.com/document/create';

    return {
        success: true,
        htmlBlob: blob,
        htmlUrl: url,
        plainText: plainText,
        googleDocsUrl: googleDocsUrl,
        message: 'Il contenuto è stato copiato negli appunti. Apri Google Docs e incolla (Ctrl+V / Cmd+V).'
    };
};

/**
 * Downloads the project as an HTML file
 * @param {Object} project - Project data
 */
export const downloadAsHTML = (project) => {
    const sections = formatProjectDocument(project);
    const html = sectionsToHTML(sections);

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name || 'progetto-agile'}-export.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * Downloads the project as a plain text file
 * @param {Object} project - Project data
 */
export const downloadAsText = (project) => {
    const sections = formatProjectDocument(project);
    const text = sectionsToPlainText(sections);

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name || 'progetto-agile'}-export.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * Publishes the project report to the web via Supabase Storage
 * @param {Object} project - Project data
 * @returns {Promise<Object>} Result with public URL
 */
export const publishToWeb = async (project) => {
    try {
        const sections = formatProjectDocument(project);
        const html = sectionsToHTML(sections);
        const blob = new Blob([html], { type: 'text/html' });

        const safeName = (project.name || 'project').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safeName}-${Date.now()}.html`;
        const filePath = `${filename}`;

        const { error } = await supabase.storage
            .from('public-exports')
            .upload(filePath, blob, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'text/html; charset=utf-8'
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('public-exports')
            .getPublicUrl(filePath);

        return {
            success: true,
            url: publicUrl,
            message: 'Report pubblicato con successo!'
        };
    } catch (error) {
        console.error('Publish error:', error);
        return {
            success: false,
            message: 'Errore durante la pubblicazione: ' + error.message
        };
    }
};
