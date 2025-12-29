
import { describe, it, expect, vi } from 'vitest';
import { generateAIResponseV2 } from './aiService';

describe('aiService', () => {
    it('should generate vision based on prompt inputs', async () => {
        const prompt = {
            projectName: 'TestProject',
            targetAudience: 'Startups',
            problem: 'Chaos',
            differentiation: 'AI Automation'
        };

        const response = await generateAIResponseV2(prompt, 'vision');
        expect(response).toContain('TestProject');
        expect(response).toContain('Startups');
        expect(response).toContain('AI Automation');
    });

    it('should generate objectives based on prompt inputs (and show v1.2 tag)', async () => {
        const prompt = {
            projectName: 'TestProject',
            targetAudience: 'Startups',
            problem: 'Chaos'
        };

        const response = await generateAIResponse(prompt, 'objectives');
        expect(Array.isArray(response)).toBe(true);
        expect(response.length).toBe(3);
        // Verify v1.2 tag exists (proof of fix)
        expect(response[0]).toContain('[v1.2]');
        // Verify context usage
        expect(response[0]).toContain('Startups'); // Target
        expect(response[1]).toContain('Chaos'); // Problem
    });
});
