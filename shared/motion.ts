export type MotionIntensity = 'still' | 'balanced' | 'expressive';

export function motionIntensity(request: { brief: string; messages?: { role: string; content: string }[]; changeRequest?: string }): MotionIntensity {
  const latest = [request.changeRequest || '', ...(request.messages || []).filter(message => message.role === 'user').map(message => message.content).reverse(), request.brief];
  for (const content of latest) {
    if (/不(?:要|需)(?:任何|所有)?(?:动效|动画)|(?:关闭|取消|禁用|停用)(?:所有)?(?:动画|动效)|(?:完全|纯)静态|保持静态|no animations?/i.test(content)) return 'still';
    if (/不要(?:太|过于)(?:强|花|炫)|动效克制|(?:减少|降低).{0,6}(?:动画|动效)|轻微(?:的)?(?:动态|动效|动画)/.test(content)) return 'balanced';
    if (/动(?:态)?效(?:果)?(?:要)?(?:特别|很|更|非常)?(?:强|明显)|强(?:烈)?(?:的)?动效|(?:动画|动效|动态).{0,8}(?:非常强|特别强|更强|丰富|炫酷|明显)|大面积动态|视觉冲击|酷炫|炫酷|high[- ]?motion|motion[- ]?heavy/i.test(content)) return 'expressive';
  }
  return 'balanced';
}
