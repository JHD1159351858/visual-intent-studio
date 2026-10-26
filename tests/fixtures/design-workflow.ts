type AuthorFetch = (url: string, init: RequestInit) => Promise<Response>;

export function withPassingDesignWorkflow(authorFetch: AuthorFetch): AuthorFetch {
  return async (url, init) => {
    const body = JSON.parse(String(init.body));
    const context = JSON.parse(body.messages.find((message: { role: string }) => message.role === 'user').content);
    let value: unknown;
    if (context.task === 'plan_design') value = {
      subject: context.brief,
      userTask: '输入问题、查看资料，并阅读清楚标注来源的结果。',
      concept: '以当前页面主题的可辨识实体组织视觉空间，功能入口清楚可用。',
      composition: '首屏主视觉与问题输入并列，导航连接资料查看和结果阅读区域。',
      primaryVisual: { subject: '与页面需求相关的主题实体及资料', visibleScale: '首屏中清晰可辨的主体', material: '轮廓清楚、层次分明的主题材质', motion: '主体有可见变化，输入与阅读区域保持稳定，并提供暂停。' },
      navigation: '提问、资料与结果使用明确入口，并保留共享输入状态。',
      readingArea: '问题、答案与资料出处使用稳定的独立阅读面。',
      style: { palette: ['高对比正文与背景', '主题强调色'], typography: '系统字体，标题与正文层级清楚。' },
      assets: [{ name: '主题主视觉', acquisition: '根据需求选择真实素材或独立绘制', quality: '主体清晰且适配首屏尺寸', fallback: '保留静态主题图形' }],
      searches: [],
      acceptance: ['主题主体可辨识且符合用户需求。', '问题输入、资料查看与结果阅读可实际操作。', '手机可阅读，暂停与减少动态模式有效。'],
    };
    else if (context.task === 'review_design_prompt') value = { verdict: 'pass', summary: '文字审查通过；未渲染页面。', issues: [] };
    else return authorFetch(url, init);
    return new Response(JSON.stringify({ choices: [{ message: { role: 'assistant', content: JSON.stringify(value), reasoning_content: 'DO_NOT_SHOW_THINKING' }, finish_reason: 'stop' }] }), { headers: { 'Content-Type': 'application/json' } });
  };
}
