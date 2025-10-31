// src/utils/strings.ts
import type { IntroTemplateVars, MatchScore } from '../types/domain';

export function oneLineReason(reasons: MatchScore['reasons']): string {
  // Sort by contribution and take top contributors
  const topReasons = reasons
    .filter(r => r.contribution > 5) // Only include meaningful contributors
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 2);

  if (topReasons.length === 0) {
    return 'Good overall compatibility';
  }

  if (topReasons.length === 1) {
    return `${topReasons[0].key} alignment`;
  }

  return `${topReasons[0].key} & ${topReasons[1].key} aligned`;
}

export function renderTemplate(template: string, vars: IntroTemplateVars): string {
  let result = template;
  
  Object.entries(vars).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replaceAll(placeholder, value || '');
  });

  // Clean up any remaining placeholders or extra spaces
  result = result.replace(/\{\{[^}]*\}\}/g, '');
  result = result.replace(/\s{2,}/g, ' ');
  result = result.trim();

  return result;
}

export function exportToCsv(data: any[], filename: string): void {
  if (data.length === 0) return;

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}