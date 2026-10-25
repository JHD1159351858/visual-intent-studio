import { describe, expect, it } from 'vitest';
import { motionIntensity } from '../shared/motion';

describe('requested motion intensity', () => {
  it('lets the latest explicit strong request override an earlier clean or static brief', () => {
    expect(motionIntensity({ brief: '课程资料查询，纯静态页面', messages: [{ role: 'user', content: '动态效果不够，我想要那种动效特别强的' }] })).toBe('expressive');
  });
  it('retains the last explicit preference when a subsequent message only changes content', () => {
    expect(motionIntensity({ brief: '清爽的课程资料台', messages: [{ role: 'user', content: '要强动效和大面积动态背景' }, { role: 'assistant', content: '建议完全静态' }, { role: 'user', content: '标题换成课程探索' }] })).toBe('expressive');
  });
  it('honors a later explicit stop or reduction instead of matching older strong words', () => {
    expect(motionIntensity({ brief: '强动效知识问答', changeRequest: '关闭所有动画，其他功能保留' })).toBe('still');
    expect(motionIntensity({ brief: '特别强的动效', messages: [{ role: 'user', content: '不要太强，动效克制一点' }] })).toBe('balanced');
  });
  it('keeps ordinary clean interfaces balanced and distinguishes reading protection from no animation', () => {
    expect(motionIntensity({ brief: '清爽的课程资料查询台' })).toBe('balanced');
    expect(motionIntensity({ brief: '背景动画要非常强，但是不要让正文乱动' })).toBe('expressive');
  });
});
