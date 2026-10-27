import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { loadDesignLibrary, readDesignExample, selectDesignBasis } from '../server/design-library';

const ids = ['physics-phase-lab', 'chemistry-molecule-studio', 'poetry-reading-room'];
describe('frontend-design generated page cases', () => {
  it.each(ids)('%s is a complete, source-honest offline case and can be selected', async id => {
    const root = process.cwd();
    const library = await loadDesignLibrary(root);
    const page = library.pages.find(item => item.id === id)!;
    expect(page.designMethod).toBe('frontend-design');
    expect(page.aliases).toContain('frontend-design');
    const example = await readDesignExample(root, 'page', id);
    expect(example.developerPrompt).toContain('并非 Skill 官方附带模板');
    expect(example.html.length).toBeLessThan(24000);
    for (const section of page.sections) expect(example.html).toMatch(new RegExp(`id=(?:["']${section.id}["']|${section.id}(?=[\\s>]))`));
    expect(example.html).not.toMatch(/<(?:script|link)[^>]+(?:src|href)=["']https?:|\b(?:fetch|XMLHttpRequest|localStorage)\s*[.(]/i);
    const image = await readFile(page.posterPath);
    expect(image.subarray(1, 4).toString()).toBe('PNG');
    const basis = await selectDesignBasis(root, { task: 'generate_demo', brief: `参考《${page.title}》制作课程知识学习页面`, selections: [] }, []);
    expect(basis.selectedRecipe?.id).toBe(id);
    expect(basis.selectedRecipe?.html).toBe(example.html);
  });
});
