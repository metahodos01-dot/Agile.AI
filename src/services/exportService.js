/**
 * Export Service for Agile.AI
 * Handles exporting project data to various formats including Google Docs
 */

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
        if (project.sprint.items && project.sprint.items.length > 0) {
            sections.push({
                type: 'heading',
                level: 2,
                content: 'Sprint Backlog'
            });
            project.sprint.items.forEach(item => {
                sections.push({
                    type: 'bullet',
                    content: `${item.title || item.name || item.description || 'Item'}${item.points ? ` (${item.points} pts)` : ''}`
                });
            });
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
            case 'heading':
                const prefix = '#'.repeat(section.level);
                text += `\n${prefix} ${section.content}\n\n`;
                break;
            case 'paragraph':
                text += `${section.content}\n\n`;
                break;
            case 'bullet':
                text += `• ${section.content}\n`;
                break;
            case 'table':
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
            default:
                text += `${section.content || ''}\n`;
        }
    });

    return text;
};

/**
 * Converts sections to HTML format
 * @param {Array} sections - Document sections
 * @returns {string} HTML document
 */
export const sectionsToHTML = (sections) => {
    let html = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Progetto Agile - Export</title>
    <style>
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px 20px; 
            line-height: 1.6;
            color: #333;
        }
        h1 { color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; margin-top: 40px; }
        h2 { color: #6366F1; margin-top: 30px; }
        h3 { color: #818CF8; margin-top: 20px; }
        .title { font-size: 2em; text-align: center; margin-bottom: 10px; }
        .subtitle { text-align: center; color: #666; margin-bottom: 40px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #4F46E5; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        ul { padding-left: 20px; }
        li { margin: 8px 0; }
        strong { color: #4F46E5; }
    </style>
</head>
<body>
`;

    sections.forEach(section => {
        switch (section.type) {
            case 'title':
                html += `<h1 class="title">${escapeHtml(section.content)}</h1>\n`;
                break;
            case 'subtitle':
                html += `<p class="subtitle">${escapeHtml(section.content)}</p>\n`;
                break;
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
                html += '<table>\n<thead><tr>\n';
                section.headers.forEach(h => html += `<th>${escapeHtml(h)}</th>\n`);
                html += '</tr></thead>\n<tbody>\n';
                section.rows.forEach(row => {
                    html += '<tr>\n';
                    row.forEach(cell => html += `<td>${escapeHtml(cell || '')}</td>\n`);
                    html += '</tr>\n';
                });
                html += '</tbody></table>\n';
                break;
        }
    });

    html += '</body></html>';
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
