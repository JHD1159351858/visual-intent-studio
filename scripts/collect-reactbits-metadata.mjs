import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Editorial Chinese summaries of the official free-component documentation.
// Columns: name | title | visible behavior | colloquial aliases | trigger | placements | stage.
const rows = `
Tech Text|鼠标拆解的科技字标|字母在鼠标下变成虚线矢量轮廓，可以拖离文字基线，松开后弹回。|字可以拖着玩,鼠标扫过文字变虚线|鼠标经过字母；拖动并松开字母|品牌字标,首页标题|effect
Text Loop|沿曲线循环的文字带|文字沿弯曲的 SVG 路径连续移动，形成首尾相接的文字跑马灯。|弯弯的字一直走,曲线文字跑马灯|页面展示后持续循环|首屏装饰,品牌口号|effect
Masked Heading|图像填充的大标题|颜色流动或图片通过字形显露，标题按单词依次揭示。|字里面有图片,标题里颜色在流动|标题出现时逐词揭示；字形内部持续流动|首页大标题,活动标题|effect
Particle Text|粒子聚散文字|漂浮的粒子汇聚成文字，并可散开后重新组成字形。|小点点拼成字,文字散成粒子|文字入场；按配置触发散开与重组|品牌开场,互动标题|effect
Split Flap Text|机械翻页文字牌|字符像车站机械翻页牌一样逐格翻动，切换到下一段文字。|火车站翻字牌,一格一格翻文字|文字内容切换时翻动|数据展示,活动口号|effect
Warp Text|鼠标扭曲文字|文字在鼠标附近弯曲、折射，形成类似透过变形玻璃的字形。|鼠标把字弄弯,文字像水里一样扭曲|鼠标在文字区域移动|互动标题,实验作品页|effect
Stroke Text|描边绘制文字|字母轮廓逐步画出，随后填充字形内部颜色。|字的轮廓慢慢画出来,先空心再实心的字|标题进入视野或组件入场|品牌标题,章节标题|effect
Depth Text|有厚度的视差文字|多层字形叠成立体挤出的厚度，随鼠标位置产生视差偏移。|很厚的立体字,字的侧面跟着鼠标动|鼠标在文字周围移动|首屏标题,海报标题|effect
Fold Text|纸张折叠展开文字|文字行像折起来的纸张一样展开，逐步摊平到阅读位置。|文字像纸折开,一行行展开的字|文字入场时展开|章节标题,品牌口号|effect
Echo Text|重影回收文字|文字后方的多层残影跟随运动，随后收拢成清晰的单一文字。|文字拖着重影,一堆字影合成一个|文字入场或切换时|首页标题,强调短句|effect
Split Text|逐字错峰入场|文字拆成单字或单词，以时间差依次进入画面。|字一个一个出现,标题错开跳出来|文字进入视野|标题,段落开头|effect
Blur Text|由模糊变清晰的文字|文字先呈模糊状态，再分批变为清晰的字形，形成柔和揭示。|文字慢慢变清楚,模糊的字浮出来|文字进入视野|首页标题,介绍文案|effect
Circular Text|圆环旋转文字|字符围绕圆周排列，可持续旋转形成文字圆环。|字围成一个圈,转圈的文字|页面展示后旋转；可配置悬停速度|徽章,滚动提示|effect
Text Type|打字机文字|文字按打字节奏逐字出现，配合闪烁光标，可循环多段内容。|像人在打字,一个字一个字敲出来|组件入场后自动打字；按配置循环|智能体欢迎语,首页副标题|effect
Shuffle|洗牌揭示文字|字母先以快速变化和错位洗牌的方式运动，再停在目标文字上。|字母乱跳后拼好,洗牌一样出字|文字入场或配置的交互触发|科技标题,活动口号|effect
Shiny Text|光泽扫过文字|亮带扫过文字，产生金属反光或发光的字面，可按配置响应悬停与滚动。|文字闪一下光,字上面有光划过去|持续扫光；可配置悬停或滚动触发|重点标题,按钮文字|effect
Text Pressure|鼠标挤压字形|鼠标接近不同字母时，字母大小或可变字形宽度等属性连续改变。|鼠标挤压文字,字会被鼠标撑开|鼠标在文字区域移动|互动标题,个人作品集|effect
Curved Loop|可拖动的弯曲文字循环|一串文字沿可调弯曲路径循环移动，可以拖动改变运动。|弯曲的文字带,可以拖的跑马灯|持续循环；拖动文字带|品牌口号,页面分隔带|effect
Fuzzy Text|抖动噪声文字|字形边缘持续产生毛糙抖动，悬停时可增强失焦和噪声幅度。|毛毛躁躁的字,鼠标上去文字抖动|持续抖动；鼠标悬停改变强度|实验标题,错误页面|effect
Gradient Text|流动渐变文字|渐变颜色在字形内部流动，可选线性扫动、网格流动或扇形旋转。|字里面颜色流动,彩色渐变字|持续渐变动画；可配置鼠标响应|首页标题,品牌口号|style
Falling Text|重力掉落文字|文字碎片受重力下落并弹跳，形成可玩的掉字效果。|文字掉下来,字掉在地上弹跳|按配置在入场、悬停、点击或滚动时触发|创意标题,互动说明|effect
Text Cursor|跟随鼠标的文字尾迹|指定文字跟随鼠标移动，并留下逐渐消失的文字副本。|鼠标后面跟着字,移动鼠标留文字|鼠标移动|创意作品页,品牌互动区域|effect
Decrypted Text|乱码解密文字|字符先轮换为随机符号，再逐个恢复为真实文字，像正在解码。|乱码慢慢变成文字,黑客解密字|按配置在入场或悬停时解密|科技标题,按钮标签|effect
True Focus|单词轮流聚焦|一组词轮流变清晰，其他词保持模糊，突出当前聚焦的词。|一句话只有一个词清楚,重点词轮流亮|自动轮换或按配置悬停聚焦|品牌口号,关键词展示|effect
Scroll Float|滚动浮现文字|滚动页面时，文字随进度浮起并从压缩状态恢复到完整字形。|往下滚文字浮起来,滚动时字慢慢展开|页面滚动经过文字|长页标题,章节过渡|effect
Scroll Reveal|滚动揭示段落|文字随着滚动从模糊、低透明度状态逐步变清晰。|滚一点看清一点文字,文字随滚动显现|页面滚动经过段落|介绍段落,故事页面|effect
ASCII Text|字符拼成的立体文字|大字由密集的 ASCII 字符组成，随指针倾斜，悬停扰乱字符，点击产生波纹。|代码字符拼成大字,用小符号组成文字|鼠标移动、悬停和点击|开发者首页,科技作品页|effect
Scrambled Text|鼠标扫过乱码文字|鼠标经过段落时，附近字符短暂变成乱码并恢复。|鼠标扫过字变乱码,文字被鼠标扰乱|鼠标在文字上移动|互动段落,科技介绍|effect
Rotating Text|翻转轮换文字|多段词语或短句轮流以三维旋转、翻页方式切换。|一句话里的词轮流换,翻转切换关键词|自动轮换或外部控制切换|首页副标题,产品能力说明|effect
Glitch Text|故障错色文字|文字出现红绿蓝错位、跳动和扭曲，形成电子故障风格。|文字像坏了的屏幕,彩色错位的字|持续故障动画；可配置悬停触发|科技标题,游戏页面|effect
Scroll Velocity|随滚动加速的文字带|横向循环文字的速度与形变随用户滚动速度变化。|滚得越快字跑得越快,跟着滚动加速的跑马灯|页面滚动速度变化|品牌分隔带,作品集过渡|effect
Variable Proximity|鼠标距离控制的字形|可变字体的粗细、宽度等属性按鼠标与字符的距离连续变化。|鼠标靠近字变粗,附近的字会变形|鼠标接近文字|可变字体展示,互动标题|effect
Count Up|数字递增计数|数字从起始值平滑增长至目标值，支持小数和格式化展示。|数字从零涨上去,会动的统计数字|计数区域进入视野或数值变化|数据统计,业绩展示|effect
Crystalized Ball|电光玻璃球|玻璃球边缘闪烁电光，内部发光尘埃随指针旋转，点击时球体震动。|里面有星尘的玻璃球,会发电光的水晶球|入场发亮；鼠标移动搅动；点击震动|首屏视觉,互动展示|effect
Electric Logo|闪电轮廓标志|图片或 SVG 的轮廓变成流动电光，边缘迸出弧线，电荷随指针移动。|标志边上有闪电,会放电的图标|持续电光动画；鼠标移动|品牌标志,活动首屏|effect
Dither Veil|鼠标擦开双色照片|照片先呈双色抖色印刷状态，鼠标经过处恢复全彩，尾迹逐格回补。|鼠标擦出彩色照片,黑白点点图变彩色|鼠标在图片上移动|作品封面,图片展示|effect
Glow Cursor|柔和发光鼠标尾迹|鼠标位置散出柔和光流，光在移动后缓慢漂移、冷却并淡去。|鼠标拖着柔光,光从鼠标散开|鼠标移动|创意首页,互动背景|effect
Scroll Expand|滚动放大的媒体框|圆角图片或视频框随滚动变大，最终铺满可视区域。|图片越滚越大,小视频滚动撑满屏幕|页面滚动经过媒体|产品介绍,作品详情|effect
Ripple Distortion|鼠标水波扭曲内容|鼠标扰动产生水波位移，内容被波纹扭曲，尾迹逐步衰减。|鼠标划过像水波,图片被水纹弄弯|鼠标在内容区域移动|主视觉图片,互动封面|effect
Elastic Mesh|果冻弹性文字与标志|文字或标志变成鼓起的弹性形状，可按压、戳动和拉伸。|标志像果冻能戳,可以拉扯的软文字|按压、拖动和松开|品牌互动,实验页面|effect
Swarm Cursor|跟随鼠标的粒子群|一群粒子追逐鼠标并相互避让，停下后逐渐散开。|一群小点追着鼠标,鼠标带着一群小虫|鼠标移动；停下时粒子散开|互动背景,创意作品页|effect
Halftone Reveal|网点照片局部揭示|照片以印刷网点呈现，鼠标附近网点变大并恢复真实照片。|鼠标把点阵图变成照片,网点里看见原图|鼠标在图片上移动|作品封面,摄影展示|effect
Pixel Swap|像素遮罩切换内容|像素碎片组成完整遮罩，替换其下方的内容，再消散露出新内容。|小方块盖上再换内容,像素拼起来切图|按配置的点击、悬停或状态切换|卡片切换,内容替换|effect
Cursor Grid|鼠标点亮网格|画布网格在鼠标周围亮起，亮度随距离衰减，点击可产生扩散脉冲。|鼠标周围格子发亮,点击网格有波纹|鼠标移动；点击脉冲|背景网格,互动区域|effect
Animated Content|滚动位移入场|容器中的内容在入场或滚动到达时，按指定方向与距离移动到位。|内容滑进来,滚到那里元素才出现|进入视野或组件挂载|内容区块,卡片列表|effect
Fade Content|渐入渐出内容|内容到达可视阈值时以透明度变化进入，可结合模糊形成柔和过渡。|内容慢慢显现,滚到那里淡入|内容进入可视区域|内容区块,图片说明|effect
Electric Border|电弧跳动边框|边框呈持续抖动的电弧与发光能量，强度可调。|边框在放电,闪电围着卡片|页面展示后持续电弧动画|重点卡片,行动按钮|effect
Orbit Images|沿轨道旋转图片|多张图片沿可定制的 SVG 路径绕行，形成轨道式图片动画。|图片绕圈飞,照片沿路线转|页面展示后沿轨道运动|品牌合作展示,作品首屏|effect
Pixel Transition|像素溶解卡片切换|像素块先覆盖卡片，内容在遮罩下替换，再清除像素显示另一面。|鼠标碰卡片变小方块,像素化翻面|鼠标悬停或触摸点击|图片卡片,双面介绍卡|effect
Glare Hover|悬停扫光表面|鼠标悬停时，一道高光从元素表面扫过，模拟亮面反射。|鼠标上去划过一道光,卡片表面反光|鼠标进入与离开元素|按钮,商品卡片|effect
Antigravity|避让鼠标的三维粒子|三维粒子场平滑运动，靠近指针的粒子被排斥，形成避让空间。|粒子躲着鼠标走,鼠标推开一群点|持续粒子运动；鼠标移动排斥|首屏背景,互动视觉|effect
Logo Loop|循环品牌图标带|品牌或技术图标首尾相接连续滚动，悬停可暂停。|一排品牌标志一直走,合作伙伴标志滚动|持续循环；悬停暂停|合作伙伴,技术栈展示|structure
Target Cursor|四角锁定鼠标|四角框跟随指针，进入指定目标后贴合其四角，形成锁定反馈。|鼠标变瞄准框,四个角贴住按钮|鼠标移动；进入可交互目标|按钮反馈,创意导航|effect
Magic Rings|发光魔法圆环|发光圆环交叠运动，颜色、尺寸与交互响应可调整。|一圈圈发光环,像魔法阵的圆环|持续圆环动画；按配置响应鼠标|首屏视觉,活动背景|effect
Laser Flow|倾泻激光光流|光束落在内容上并沿边角流动，周围伴随漂浮烟雾和尘埃。|光像水一样流下来,激光照着卡片往下流|持续光流动画|重点内容区,品牌首屏|effect
Magnet Lines|朝鼠标偏转的短线场|整齐排列的短线随鼠标位置转向，呈现磁场般的方向变化。|一排小线跟着鼠标转,鼠标吸引线条|鼠标移动|互动背景,功能区装饰|effect
Ghost Cursor|幽灵鼠标拖影|半透明光影滞后跟随真实鼠标，移动时产生柔和拖尾。|鼠标有个半透明影子,拖着幽灵尾巴的光标|鼠标移动|创意首页,互动背景|effect
Gradual Blur|渐进模糊遮罩|在内容边缘叠加逐级增强的模糊，形成从清晰到模糊的柔和过渡。|边缘越往外越模糊,底部像毛玻璃渐渐糊掉|持续覆盖指定边缘；滚动内容穿过遮罩|滚动容器边缘,固定浮层背景|style
Click Spark|点击迸出火花|在点击位置向四周发射短暂的线状火花粒子。|点一下冒小火花,鼠标点击有爆炸小线|鼠标点击|按钮区域,轻量交互反馈|effect
Magnet|磁吸鼠标元素|元素在鼠标接近时平滑向指针偏移，离开后弹回原位。|按钮被鼠标吸过去,鼠标靠近元素会跟随|鼠标接近与离开元素|行动按钮,社交图标|effect
Strands|发光编织丝带|多条发光丝带在透明画布上起伏、交织，形成流动线束。|发光丝带在缠绕,一束线条在流动|页面展示后持续流动|首屏装饰,区块背景|effect
Sticker Peel|贴纸卷角揭起|贴纸边角悬起并可被揭开，阴影和三维变换呈现纸张厚度。|鼠标把贴纸揭起来,卡片角像贴纸翘起|鼠标悬停与拖动揭起|徽章,互动卡片|effect
Pixel Trail|方块像素鼠标尾迹|鼠标移动时留下逐渐淡出的像素方块，形成复古数字尾迹。|鼠标留下一串小方块,像素鼠标拖尾|鼠标移动|复古页面,互动背景|effect
Cubes|交互立方体阵列|多枚三维立方体组成阵列，支持自动旋转或悬停响应。|一排小方块立体转动,鼠标碰到立方体会动|持续旋转或鼠标悬停|主视觉,科技装饰|effect
Metallic Paint|液态金属标志|为 SVG 或图形施加流动金属反光，使表面像液态金属油漆。|标志像流动的金属,图标上有液态银光|页面展示后持续流动反光|品牌标志,图形展示|style
Noise|动态胶片颗粒|在图片、渐变或页面上覆盖动态颗粒，可呈现胶片、纸张或电视杂讯。|画面有细小颗粒,像老电影的噪点|页面展示后持续纹理变化|图片质感,整页纹理|style
Shape Blur|鼠标失焦图形|原本清晰的图形在指针附近模糊并带有色边，模拟镜头失焦。|鼠标碰到图形就糊掉,标志像镜头失焦|鼠标在图形区域移动|品牌图形,互动封面|effect
Crosshair|坐标测量十字光标|十字线显示实时坐标，靠近链接或按钮时锁定并测量目标边界。|鼠标变十字测量线,光标会量按钮的大小|鼠标移动；进入链接或按钮|技术作品页,实验导航|effect
Image Trail|鼠标拖出图片尾迹|鼠标移动时不断出现图片，图片形成跟随方向的尾迹并退场。|鼠标后面甩出照片,移动鼠标不断冒图片|鼠标移动|作品首页,摄影展示|effect
Ribbons|丝带鼠标尾迹|柔软丝带随鼠标流动，受运动和回弹影响形成弯曲轨迹。|鼠标拖着丝带,彩带跟着鼠标飘|鼠标移动|创意页面,互动背景|effect
Splash Cursor|彩色液体鼠标|鼠标移动激起彩色液体飞溅和卷曲波纹，颜色随流体扩散。|鼠标划出彩色墨水,像在水里搅颜料|鼠标移动或触摸滑动|互动背景,活动页面|effect
Meta Balls|融合分离的液态球|液态圆球靠近时轮廓融合，分离时又恢复为独立圆球。|几个球粘在一起又分开,像液体融合的圆圈|持续运动；按配置跟随鼠标|首屏装饰,互动背景|effect
Blob Cursor|液态团块鼠标|液体团块跟随指针拉伸、晃动并分出小液滴，可呈金属或果冻质感。|鼠标变成一团果冻,流动金属跟着鼠标|鼠标移动|品牌互动,创意背景|effect
Star Border|星光绕行边框|星光沿按钮、卡片等元素的外轮廓移动，拖出光带和星尘。|星星绕着按钮跑,边框有一束光在走|页面展示后沿边框循环|行动按钮,重点卡片|effect
Holo Card|全息闪粉卡片|卡片表面呈可变全息箔纹理，倾斜时色彩与反射改变，边框出现闪粉。|像收藏卡的彩虹反光,鼠标倾斜闪闪发光的卡|鼠标移动使卡片倾斜|商品卡片,收藏展示|effect
Circular Carousel|三维圆环图片轮播|图片沿三维圆环排布，可惯性拖动、吸附定位并点击聚焦。|图片围成转盘,拖动一圈照片|拖动、滚动或点击图片|作品画廊,产品展示|structure
Flex Carousel|液态边缘图片带|无限图片横排穿过两端的液态玻璃区域，可弯曲、加速挤压并点击聚焦。|图片流过玻璃边缘,横向图片带会弯曲|持续流动；拖动或点击图片|作品画廊,横向展示|structure
Infinite Spiral|无限螺旋图片墙|图片沿三维螺旋轨道首尾循环运动，形成有纵深的图片展示。|照片沿螺旋一直转,无限转下去的图片塔|持续循环；按配置响应交互|作品首页,图片画廊|structure
Depth Carousel|纵深轨道轮播|卡片沿三维轨道向深处排列，可拖动、键盘切换或自动前进。|卡片排到屏幕深处,有前后层次的轮播|拖动、方向键或自动切换|作品画廊,产品轮播|structure
Morph Slider|液体形变图片切换|滑块切换图片时，图像通过位移扭曲像熔化一样过渡到下一张。|图片像融化一样换掉,液体切图|切换滑块图片|产品图片,作品轮播|structure
Drift Wall|漂移透视图片墙|图片块组成无限透视墙并持续飘过，悬停的图片抬起。|一面照片墙飘过,斜着流动的图片墙|持续漂移；鼠标悬停抬起|作品首页,图库展示|structure
Accordion Gallery|手风琴展开画廊|一排图片面板在悬停或聚焦时展开，露出带视差的图像和文字。|一排窄图鼠标上去变宽,手风琴照片展开|鼠标悬停或键盘聚焦|项目展示,服务分类|structure
Specular Button|玻璃高光按钮|玻璃按钮边缘出现清晰反光，高光移向距离指针最近的位置。|按钮边缘跟着鼠标发亮,有玻璃反光的按钮|鼠标在按钮附近移动|行动按钮,表单提交|effect
Option Wheel|弯曲滚轮选择器|选项沿弯曲轨道排列，滚动、拖动或方向键使其转动，非选中项倾斜淡出。|像滚轮一样选东西,弧形上下转的选项|滚动、拖动或方向键|偏好选择,参数选择|structure
Curved Input|弧形输入栏|输入框、文字光标与提交按钮沿同一弧线弯曲排列。|弯弯的输入框,文字沿弧线输入|输入文字与提交|创意搜索,聊天输入|structure
Line Sidebar|鼠标邻近偏移侧栏|静态侧栏链接在指针接近时偏移并突出附近项目。|鼠标附近的菜单会挪动,侧栏跟着鼠标起伏|鼠标在侧栏移动|侧边导航,作品目录|structure
Animated List|错峰出现的列表|列表项目按顺序以时间差进入画面，形成连贯的列表揭示。|列表一条一条出现,顺着冒出来的选项|列表入场；选择项目|消息列表,菜单列表|structure
Scroll Stack|滚动层叠卡片|卡片随页面滚动逐张重叠到前方，形成有纵深的堆叠。|往下滚卡片一张压一张,滚动时卡片叠起来|页面滚动经过卡片区|功能介绍,过程展示|structure
Bubble Menu|气泡展开菜单|圆形浮动菜单展开后，菜单项按顺序出现。|点开一堆圆圆的菜单,气泡导航|点击菜单按钮展开或收起|主导航,移动菜单|structure
Magic Bento|互动便当网格|大小不一的功能卡片组成网格，配合可配置的悬停、粒子与聚光反馈。|一格一格的互动卡片,大小不一的功能块|展示网格；鼠标悬停与点击|首页功能区,产品能力展示|structure
Circular Gallery|弧形循环画廊|图片沿弧形轨道移动，形成可循环浏览的环形画廊。|照片排成弯弯一圈,弧线上的图片画廊|拖动或滚动画廊|作品集,摄影展示|structure
Reflective Card|实时倒影卡片|卡片以摄像头画面形成动态反射，并随鼠标方向改变眩光。|卡片像镜子照出自己,有实时倒影的卡片|允许摄像头后反射；鼠标移动改变眩光|创意互动卡片,实验作品页|effect
Card Nav|卡片式展开导航|导航栏展开成多个卡片面板，每个面板包含一组相关链接。|导航点开是一排卡片,菜单按块展开|点击导航按钮展开或收起|网站主导航,分类菜单|structure
Stack|可拖拽卡片堆|卡片层叠成一堆，可拖、甩或点击切换，移出的卡片收回到堆底。|一叠卡片可以扔开,像翻照片一样翻卡片|拖动、甩动或点击|作品预览,评价卡片|structure
Fluid Glass|流体折射玻璃|玻璃容器产生流动扭曲与折射，使后面的内容像通过液态镜片观看。|流动的玻璃透镜,背景透过玻璃会变形|玻璃持续显示；按配置移动透镜|首屏主视觉,导航容器|style
Pill Nav|胶囊导航|导航项置于胶囊形容器，活动高亮在不同项目间平滑滑动。|圆角胶囊菜单,选中底色滑过去|选择导航项目或悬停|顶部导航,分组切换|structure
Masonry|瀑布流图片布局|不同高度的图片以紧密瀑布流排列，窗口变化时动画重排以优化空隙。|长短照片排得满满的,不规则瀑布流图片墙|页面展示；容器尺寸变化重排|作品集,图片资源库|structure
Dome Gallery|三维穹顶图片展厅|图片映射到半球表面，拖动视角可以浏览沉浸式穹顶画廊。|照片贴在一个大球里,穹顶里的图片墙|拖动视角；选择图片|沉浸式画廊,创意作品集|structure
Chroma Grid|局部显色网格|网格图片先呈灰度，鼠标附近恢复色彩，形成局部彩色窗口。|黑白照片鼠标上去变彩色,照片墙局部显色|鼠标在图片网格移动|团队卡片,作品列表|structure
Folder|展开文件夹卡片|文件夹悬停或交互时打开，内部内容以平滑运动显露出来。|点开文件夹露出内容,会打开的资料夹|鼠标悬停或操作文件夹|资料入口,项目分类|structure
Staggered Menu|错峰滑入大菜单|菜单展开和关闭时，背景面板与菜单文字分批错峰运动。|一层层滑开的菜单,菜单文字依次飞入|点击菜单开关|主导航,移动导航|structure
Model Viewer|可旋转三维模型|展示三维模型，提供环绕查看与可调灯光预设。|可以转着看的3D模型,拖动查看产品的立体图|拖动旋转、缩放；切换灯光|产品展示,三维作品页|structure
Lanyard|可拉扯三维吊牌|三维吊牌挂在弹性织带上，可拖拽、拉伸、甩动或点击翻面。|能拉着晃的工作牌,可以甩的挂绳卡片|拖动、拉伸、松开或点击翻面|个人介绍,品牌互动|effect
Profile Card|立体高光个人卡|个人资料卡随鼠标三维倾斜，表面眩光和色彩响应角度变化。|鼠标一动个人卡就倾斜,会反光的名片|鼠标悬停与移动|个人介绍,团队成员|effect
Dock|放大式底部图标栏|一排应用图标像桌面 Dock 一样在鼠标靠近时放大，可带启动弹跳和角标。|像苹果底部那排图标,鼠标靠近图标变大|鼠标悬停与点击；按配置弹出菜单|快捷导航,工具栏|structure
Gooey Nav|粘液高亮导航|活动导航指示器以融化、拉伸的液态形变在项目之间移动。|导航底色像粘液滑过去,会融化的菜单高亮|点击导航项目|顶部导航,标签切换|structure
Pixel Card|像素展开卡片|悬停卡片时像素块扩散和变化，突出内容与边缘。|卡片冒出一堆小方块,像素会动的卡片|鼠标悬停或聚焦|功能卡片,游戏卡片|effect
Carousel|可滑动功能轮播|卡片可滑动浏览，可选多种过渡与自动播放计时。|左右滑动看卡片,一张张切换的功能介绍|拖动、切换按钮或自动播放|功能介绍,故事卡片|structure
Border Glow|沿方向显现的边缘光|网格渐变光沿边框随指针方向移动，在接近边缘时更亮。|鼠标靠近边缘就发亮,卡片边上流动彩光|鼠标在卡片附近移动|重点卡片,服务列表|effect
Flying Posters|滚动飞行海报|海报在无限纵向画廊中随滚动或拖动产生三维扭转与翻转。|海报像飞过去一样,滚动时照片扭来扭去|滚动或拖动画廊|作品集,海报展示|structure
Card Swap|轮流换位的卡片|一叠卡片通过平滑的位移和层级切换交换前后位置。|卡片一张张轮到前面,一叠卡片自动换位|自动按间隔换位|功能展示,内容预览|structure
Glass Icons|折射玻璃图标|图标呈液态玻璃质感，折射背后的颜色与光线。|图标像透明玻璃,小按钮有液态玻璃质感|持续显示；鼠标悬停反馈|应用入口,社交链接|style
Decay Card|鼠标撕裂融化图片|图片卡片随指针运动出现撕扯、融化和位移，随后恢复完整。|鼠标把照片扯开,卡片像融化后又复原|鼠标在图片上移动|作品封面,实验展示|effect
Flowing Menu|流动预览菜单|悬停菜单项时出现横向流动的文字与图片带，形成动态预览。|鼠标上去菜单里图片一直走,菜单展开流动的图片带|鼠标进入与离开菜单项|作品导航,案例目录|structure
Elastic Slider|弹性滑动条|拖动滑块时把手与轨道产生弹性拉伸，松开后以弹簧运动回位。|滑块拉起来像橡皮筋,会回弹的调节条|拖动滑块与松开|音量控制,参数调节|effect
Counter|滚动数字计数器|数字变化时，各数位分别滚动切换到新值，形成机械计数器感觉。|数字像滚轮一样跳,个位十位分别滚动|数值更新|数据面板,价格展示|effect
Infinite Menu|球面无限图片菜单|图片块覆盖可拖动球体，最近的项目吸附到前方并显示名称、说明与链接。|拖动一个贴满照片的球,球面照片菜单|拖动球面；项目吸附到前方|作品导航,产品菜单|structure
Stepper|分步流程面板|用步骤指示器和动画状态切换组织多步内容，并显示当前进度。|一步一步填的页面,带进度的分步表单|点击下一步、上一步或步骤|引导流程,多步表单|structure
Bounce Cards|弹入扇形照片卡|照片卡片呈扇形弹入，悬停时周围卡片散开，当前卡片扶正。|照片像扇子弹出来,鼠标选中一张照片其他让开|入场弹跳；鼠标悬停|作品预览,个人首页|structure
Flux Lines|发光磁流线背景|彩色发光线纹沿指定方向流动，指针产生局部磁力扭曲，点击可激起旋涡。|背景光线被鼠标吸动,点击发光线条出现旋涡|入场揭示；持续流动；鼠标移动与点击|首屏背景,科技内容区|style
Pattern Waves|图案波浪背景|点、线、十字或字形铺成起伏表面，波浪像丝绸展开，鼠标可激起涟漪。|图案像布一样起伏,点阵铺成一片波浪|持续波浪；鼠标移动产生涟漪|首屏背景,图形展示|style
Micro Slats|微型条片海面|密集细条在透视中起伏成海面，波峰反光，指针可搅动流体。|一排排细条变成波浪,小条片像海水起伏|入场从地平线展开；持续起伏与鼠标搅动|首屏背景,产品主视觉|style
Shape Waves|几何波浪场|三角、圆或方块随波浪变亮、变大，可绕过可选的文字镂空。|小图形一波波亮起来,几何图案像海浪|页面展示后持续波浪|首屏背景,活动视觉|style
Aero Shards|风中金属碎片|折叠金属薄片组成风动雕塑，片面反光细节随运动变化并响应指针。|很多薄片在风里飘,金属碎片随着鼠标动|持续风动；鼠标移动|首屏背景,产品主视觉|style
Ghost Fibers|深蓝发光纤维场|深蓝纤维层层递归，发光色带向径向扭转，周围带柔和辉光。|深蓝色光丝在旋转,一层层发光的纤维|页面展示后持续动画|科技背景,品牌首屏|style
CRT Warp|弯曲老电视光场|画面呈 CRT 曲面扭曲、扫描线与辉光，等离子色彩铺满背景并响应指针。|像老电视的弯曲屏幕,有扫描线的彩色背景|持续光场动画；鼠标移动|复古科技背景,游戏页面|style
Molten Metal|熔融金属光丝|盘旋的焦散光丝带有白热核心，形成像熔化金属的高亮流动纹理。|发亮的金属在流动,像熔岩一样的银色光丝|页面展示后持续流动|品牌主视觉,质感背景|style
Gradient Waves|渐变地平线波浪|渐变正弦波向柔和、雾状地平线滚动，呈现有深度的波浪场。|彩色波浪向远处滚,有雾气地平线的背景|页面展示后持续波浪|首屏背景,活动视觉|style
Web Threads|汇聚光点的编织光丝|发光正弦丝线织向明亮的汇聚点，形成有方向的线束背景。|一束光线织到一个点,发光的丝线汇聚|页面展示后持续线丝运动|科技首屏,数据主题背景|style
Topography|发光等高线地图|等高线随表面高低变化，线条带辉光与按高度变化的颜色。|像地形图的线条在动,发光等高线背景|页面展示后持续地形变化|数据主题背景,科技首页|style
Light Tunnel|光纤纵深隧道|径向光纤形成隧道，光脉冲沿线条快速深入远处。|像钻进发光隧道,光线往屏幕深处跑|页面展示后持续光脉冲|首屏背景,沉浸式开场|style
Sliced Waves|切片彩色光浪|彩色波浪切成发光条带，在透视空间中起伏，焦点随指针移动。|一条条彩光像海浪,被切成条的彩色波浪|持续起伏；鼠标移动调整焦点|首屏背景,活动视觉|style
Acid Squares|层叠方形光廊|多层方形组成晶体走廊，光圈沿纵深朝观看者移动。|很多方框往眼前飞,发光方形隧道|页面展示后持续推进|首屏背景,音乐活动页|style
Scanner|示波器扫描条纹|平静的干涉条带持续横扫画面，形成类似示波器的扫描纹理。|背景有扫描条纹,像示波器一样扫过去|页面展示后持续扫描|科技背景,监测主题页|style
Ferrofluid|磁性流体等高线|磁性流体持续翻涌，发光轮廓勾出液面，指针像磁铁一样牵引流体。|液体被鼠标吸起来,发光线条勾出的磁流体|持续翻涌；鼠标移动牵引|首屏背景,实验视觉|style
Lightfall|隧道落下的光雨|彩色光条沿发光隧道落下，指针附近增加局部光亮。|彩色光雨落下来,发光隧道里的雨|持续光雨；鼠标移动|首屏背景,活动视觉|style
Liquid Ether|互动彩色液体|可定制色彩的液体随着流动与指针扰动产生涡流和形变。|鼠标搅动彩色液体,像颜料融合的背景|持续流动；鼠标或触摸扰动|首屏背景,品牌主视觉|style
Prism|旋转发光棱镜|棱镜随时间旋转，光强、尺寸与颜色可调整，形成几何光学主视觉。|一个发光三角棱镜在转,像水晶棱镜的背景|页面展示后持续旋转|首屏视觉,科技背景|style
Dark Veil|深色流动幕布|深色纹理以平滑动画和后期辉光变化，形成低干扰的动态背景。|暗色背景轻轻流动,低调的深色光幕|页面展示后持续动画|深色首页,产品背景|style
Light Pillar|发光垂直光柱|垂直光柱带柔和辉光，光线强弱与表面纹理形成动态照明感。|一道竖着的光柱,背景里有发光柱子|页面展示后持续光柱动画|首屏背景,品牌视觉|style
Silk|柔光丝绸背景|柔和灯光照在起伏波面上，呈现丝绸般流动褶皱。|背景像丝绸在动,柔软布料一样的光影|页面展示后持续波动|品牌首页,产品背景|style
Floating Lines|漂浮三维线带|多条有纵深的线带悬浮运动，随指针移动改变形态。|线条漂在空中,有前后层次的曲线|持续线带运动；鼠标移动|首屏背景,科技主视觉|style
Side Rays|侧面射入光线|彩色光束从画面侧边射入并动态变化，颜色和速度可调整。|光从旁边照进来,侧边射出的彩色光束|页面展示后持续光线运动|首屏背景,标题衬底|style
Light Rays|体积光束背景|可调方向的光束铺在背景中，形成空气里可见的照明射线。|背景有一束束光,像聚光灯照出光路|页面展示后持续光线变化|首屏背景,重点区块|style
Pixel Blast|像素爆发背景|像素颗粒形成爆发式波动，可配合液体后期形变。|很多小方块一波波炸开,像素粒子爆发|持续像素波动；按配置响应点击与指针|首屏背景,游戏活动页|style
Color Bends|弯曲流动色带|高饱和色带平滑弯曲与流动，形成层次分明的抽象渐变背景。|彩色色带绕来绕去,弯曲流动的渐变|页面展示后持续流动|首屏背景,品牌页面|style
Line Waves|彩色线条波浪|线条组成连续波面，在彩色扭曲中动态起伏。|一排彩线像波浪一样动,弯来弯去的彩色线条|页面展示后持续波动|首屏背景,科技视觉|style
Radar|余辉雷达扫描|雷达扫线绕圆面转动，留下荧光余辉并捕捉运动目标，可呈平面或透视。|雷达一圈圈扫描,扫描过后还有余光|页面展示后持续扫描与目标运动|科技背景,监测展示|style
Soft Aurora|柔和极光背景|三维噪声与柔和彩色渐变组成缓慢变化的极光幕。|柔柔的极光颜色,轻微流动的彩色云幕|页面展示后持续极光变化|首屏背景,品牌页面|style
Aurora|流动极光色幕|渐变色幕起伏、流动，形成极光般的彩色背景。|像北极光的背景,彩色光幕在飘|页面展示后持续流动|首屏背景,活动页面|style
Plasma|暗处缎面光褶|明亮高光穿过暗处的缎面光褶，缓慢扭转并随指针改变方向。|暗背景里绸缎一样的光,发光褶皱缓缓转|持续光褶动画；鼠标移动|首屏背景,品牌主视觉|style
Plasma Wave|交织等离子光带|两条发光等离子丝带互相卷绕，白热核心周围带柔光，指针可搅动。|两条发光带互相绕,鼠标搅动的光波|持续光带动画；鼠标移动|首屏背景,音乐活动页|style
Particles|漂浮粒子背景|粒子在空间中漂浮，数量、尺寸和运动等参数可定制。|背景有很多漂浮小点,星星一样的粒子|页面展示后持续粒子运动|首屏背景,科技页面|style
Gradient Blinds|渐变百叶光带|渐变分层成百叶状条带，聚光与噪声形变让表面呈现动态光感。|彩色百叶窗背景,一条条渐变光带|持续渐变；鼠标位置控制聚光|首屏背景,活动视觉|style
Grainient|颗粒流动渐变|带细颗粒的渐变漩涡随柔和波动扭曲，形成有印刷质感的色面。|有颗粒的渐变背景,彩色噪点慢慢流动|页面展示后持续色面运动|品牌背景,海报页面|style
Grid Scan|三维网格扫描室|网格构成三维房间，扫描光带移动经过格线，产生纵深空间感。|像进入网格房间,立体网格被光扫描|页面展示后持续扫描|科技首屏,沉浸式背景|style
Beams|交错发光条带|发光条带交错穿过画面，光照与材质细节形成立体动态背景。|几束光条交叉移动,发光带子从背景穿过|页面展示后持续条带运动|首屏背景,品牌主视觉|style
Pixel Snow|像素雪花背景|多层像素雪花带柔光飘落，风影响方向，指针可拨开附近雪花。|像素雪一片片落下,鼠标拨开小方块雪花|持续飘雪；鼠标移动|节日背景,复古页面|style
Lightning|分叉闪电背景|程序生成的闪电分支带辉光闪烁，呈现电流突然出现的效果。|背景里闪电在闪,分叉的发光雷电|页面展示后持续闪电动画|游戏页面,活动首屏|style
Prismatic Burst|棱彩射线爆发|彩色光线从中心向外爆发，数量、颜色与扭曲可调整。|中心放出很多彩光,彩虹射线向外散开|页面展示后持续光线动画|首屏背景,音乐活动页|style
Galaxy|视差星河背景|星点组成有纵深的星河，随指针产生视差移动。|背景是会动的星空,鼠标一动星河跟着偏|持续星点动画；鼠标移动|首屏背景,宇宙主题页|style
Dither|复古抖色纹理|噪声与波动转为离散像素抖色，形成老式印刷或低色数画面的质感。|背景像黑白网点,老电脑一样的抖色纹理|页面展示后持续噪声动画|复古背景,实验视觉|style
Faulty Terminal|故障终端格纹|方格、扫描线、闪烁和噪声组成类似故障 CRT 终端的动态背景。|像坏掉的电脑终端,格子屏幕闪来闪去|页面展示后持续闪烁与噪声|科技背景,游戏页面|style
Ripple Grid|涟漪网格背景|规则网格随连续涟漪起伏，线条的形变呈现波纹向外传播。|网格像水面一样波动,格线一圈圈起伏|页面展示后持续涟漪动画|首屏背景,科技页面|style
Dot Field|互动凸起点阵|点阵在指针附近凸起、发光或闪烁，并可形成波浪反馈。|鼠标经过点阵鼓起来,一片小点有波浪|鼠标移动；按配置产生波动|首屏背景,互动区域|style
Threads|鼠标拨开丝线|流动细线可呈丝绸或等高线质感，指针靠近时线条散开、让出空间。|鼠标拨开一束细线,光丝会给鼠标让路|持续线丝运动；鼠标移动|首屏背景,品牌主视觉|style
Hyperspeed|高速公路光轨|发光车道与车辆尾迹沿弯曲道路前进，按住时进入高速穿梭状态。|像开车冲进时光隧道,按住鼠标光轨加速|持续光轨；按住鼠标或触摸加速|沉浸式开场,游戏首页|style
Iridescence|虹彩液态表面|表面褶皱不断折射虹彩，鼠标移动可搅动流动纹理。|像彩色油膜在流动,鼠标搅动虹彩液体|持续纹理变化；鼠标移动|品牌背景,产品主视觉|style
Waves|分层曲线波浪|分层线条持续组成平滑波浪，并可随指针产生扰动。|很多细线像海浪,线条一层层起伏|持续波浪；按配置响应鼠标|首屏背景,页面装饰|style
Grid Distortion|鼠标扭曲图片网格|图片在鼠标附近分成位移格块，离开后格块回到原位。|鼠标把图片推成小格子,照片局部像素错位|鼠标在图片区域移动|首屏图片,作品封面|style
Ballpit|彩色弹跳球池|多枚彩色三维球体以物理方式碰撞、弹跳，形成可以互动的球池。|一堆彩球互相撞,彩色弹力球铺满背景|持续物理模拟；按配置指针推动|互动背景,儿童活动页|style
Orb|漂浮能量光球|发光能量球在中心漂浮，悬停时可改变旋转或强度。|一个发光能量球,鼠标碰到光球会变化|持续光球动画；鼠标悬停|首屏视觉,科技页面|style
Letter Glitch|字符故障矩阵|密集字符不断换字和换色，形成类似矩阵终端的随机跳动背景。|整屏代码字符乱跳,像黑客矩阵的字墙|页面展示后持续字符更新|科技背景,开发者首页|style
Grid Motion|倾斜流动内容墙|照片、文字或内容块组成倾斜墙面，随指针滑动，停留处亮起。|斜着的卡片墙跟着鼠标走,一格格内容缓慢漂移|持续漂移；鼠标移动与停留|作品背景,内容展示墙|style
Shape Grid|移动几何网格|正方、六边、圆或三角网格按设定方向连续移动，形成几何铺底。|很多几何格子一直移动,可以换形状的网格背景|页面展示后持续移动|首屏背景,科技页面|style
Liquid Chrome|液态铬反光背景|金属铬般的表面不断流动，反光与褶皱形成液态质感。|流动的银色金属背景,像液体镜面的纹理|页面展示后持续流动|品牌背景,产品主视觉|style
Balatro|旋涡扑克牌风格背景|红蓝等色彩在圆形漩涡中旋转流动，形成 Balatro 风格的像素化光场。|红蓝漩涡一直转,像扑克牌游戏的旋转背景|持续旋涡动画；按配置响应鼠标|游戏背景,活动主视觉|style
Evil Eye|火光眼瞳背景|眼虹膜动态变化，狭长瞳孔周围带有火焰般的外层辉光。|背景里一只发光眼睛,有火光的猫眼瞳孔|页面展示后持续虹膜与辉光动画|游戏背景,神秘主题页|style
Bell Toggle|铃铛标签切换|点击胶囊按钮时铃铛摇响，标签以模糊交叉过渡切换，按钮随文字长度伸展。|点按钮铃铛会摇,开关文字会软软地变长|点击切换开关状态|通知开关,偏好设置|effect
Branched Menu|树枝展开菜单|分组菜单展开成树干与弯曲枝线，强调线沿分支移动到选中项目。|像树枝分叉的菜单,选中路径沿线跑过去|展开分组；点击子项|侧边目录,分组导航|structure
Call Chip|工具调用状态胶囊|工具执行时填色扫过胶囊并显示耗时，成功变绿，失败停住、变红抖动并显示重试。|工具执行有进度小条,调用失败胶囊会抖一下|工具状态与耗时更新；点击重试|智能体工具调用,任务状态行|effect
Code Slots|弹性验证码格|验证码各格的数字弹入、底色从中心膨胀，错误时依次清空，成功时合成统一强调色。|验证码一格格弹出来,输错验证码从后面清空|输入、粘贴或自动填充；验证结果变化|登录验证,一次性代码输入|effect
Comet Dial|彗星刻度旋钮|旋钮沿角度拨动，读数以弹簧跟随，高亮头部拖出随速度变化的彗星尾迹。|转旋钮后面拖着光,带彗星尾巴的刻度盘|拖动或甩动旋钮|参数控制,创意仪表盘|effect
Dodge Field|躲避鼠标的元素|容器中的元素在有限区域内躲开指针，多次接近后不再躲避并滑回原位。|按钮会躲着鼠标,追几次元素就不跑了|指针接近元素|趣味提示,互动演示|effect
Flip Card|弹簧双面翻转卡|卡片可点击、拖动或甩动来三维翻面，松手速度影响回弹，可带指针倾斜与高光。|可以甩着翻面的卡片,点一下看卡片背面|点击、拖动或甩动|双面介绍卡,商品卡片|effect
Folder Float|浮出笔记的文件夹|悬停或按下文件夹后盖板前倾，笔记从背后弹成可选择的浮动云，关闭时收回。|文件夹打开笔记飞出来,纸片从文件夹里漂起来|鼠标悬停或按下；选择笔记|笔记入口,资源分类|structure
Fuse Button|带倒计时撤销的按钮|操作完成后标签切为撤销，细线燃尽表示撤销窗口，点击撤销或 Escape 可退回。|做完后按钮可以撤销,撤销按钮有一条快烧完的线|点击操作；点击撤销或按 Escape|可撤销操作,收藏管理|effect
Glide Select|滑动高亮下拉菜单|选择菜单从芯片角部展开，统一高亮在行之间滑动，再进入时从上次位置续接。|下拉选项的底色会滑动,菜单从按钮角上弹出来|展开菜单；悬停与选择项目|筛选器,偏好选择|structure
Hold Button|长按蓄满确认按钮|按住按钮时液体填色上升，提前松开回退，蓄满后标签通过模糊过渡变为完成。|按住才确认的按钮,按钮里面液体慢慢装满|按住、提前松开或长按完成|重要确认,提交动作|effect
Jelly Radio|果冻单选芯片|选中的芯片先变宽再变高，并以连续弹簧运动把相邻项目推开。|选项像果冻鼓起来,点一个其他选项会被挤开|选择单选项目|偏好设置,类型选择|effect
Lattice Loader|网格任务状态行|小网格单元按相位波动依次亮起，旁边显示任务与计时，完成后变为勾或叉。|一小块网格表示正在处理,任务结束网格变成勾|任务运行、成功或失败状态变化|智能体任务状态,处理进度|effect
Paper Crumple|可抓揉纸张图片|按住图像时纸张折成立体皱褶并跟随抓取点，可松成纸球、展开或保留折痕。|图片可以揉成纸团,拖着图片像抓一张纸|按住、拖动、松开或展开|创意图片展示,互动作品页|effect
Peek Rating|预览波浪星级评分|指针扫过星星时逐颗抬起，提示标签跟随移动，点击后弹跳确认评分。|打分星星像波浪抬起来,先滑过看看再选评分|悬停预览；点击确认|用户评价,反馈表单|effect
Prompt Bar|多入口智能体输入栏|输入栏可显示来源、命令和模型选择菜单，以及附件与语音入口；发送图标在忙碌时变成停止。|带模型选择的聊天输入框,发送按钮会变成停止|输入文字；打开菜单；发送或停止|智能体对话,搜索助手|structure
Pulse Heart|收缩回弹点赞按钮|爱心先收缩成点，在最小处变色，再弹回新状态，同时替换计数字符。|点赞爱心缩一下再弹大,点心心数字一起变|点击点赞或取消|内容点赞,作品收藏|effect
Refine Frame|生成进度媒体框|媒体框固定比例，排队、生成、优化与完成阶段用模糊、饱和度和缩放过渡；错误显示重试。|图片生成时不用来回跳布局,图片一边生成一边变清晰|媒体生成状态更新；点击重试|智能体图片结果,生成任务预览|effect
Rubber Segment|橡皮滑块分段选择|选择滑块跨越间距时拉长并在目标处压缩，也可拖拽和甩动切换选项。|选项底色像橡皮拉过去,可拖的分段开关|点击、拖动或甩动|视图切换,偏好设置|effect
Scrub Field|可拖动数值芯片|横向拖动直接调节数值，超出范围时产生橡皮回弹，单击可改为输入。|拖数字就能调大小,数值可以拉着改|拖动调节；单击输入|参数面板,设计属性编辑|effect
Shredder|拖入碎纸机的列表|把列表行拖入底部缝隙后，滚轴将其拉入并切成卷曲纸条，其他项目弹性补位。|把条目拖进碎纸机删除,列表像纸一样被碎掉|拖动列表行进入缝隙|创意删除交互,任务列表|effect
Slide Commit|滑动确认进度按钮|把手滑到末端后显示运行转圈，成功时展开完成标签，失败时抖动并弹回。|向右滑才执行,滑动确认后显示处理结果|拖动把手确认；动作成功或失败|确认操作,提交动作|effect
Sling Button|弹弓拉动发送按钮|发送按钮像弹弓一样向后拉伸，力度弧线显示蓄力，释放后触发动作。|拉开按钮再发出去,像弹弓一样的发送键|向后拖动并释放|趣味发送,活动互动|effect
Slosh Gauge|晃动液位仪表|液体以惯性追随数值，随速度倾斜，充满时拍打顶部，也可配置为竖向滑块。|液位像水一样晃,进度装满时水会溅起来|数值变化；可选竖向拖动|进度显示,参数仪表|effect
Spring Check|弹簧勾选待办|一次勾选同步填充方框、画出勾、划掉文字并淡化标签。|勾选待办一气呵成,打勾和划线一起动|点击复选框|待办清单,检查步骤|effect
Squish Switch|挤压拖动开关|开关滑块随速度拉伸，过中点翻转，快速甩动后在轨道末端压缩回弹。|开关像软糖被挤扁,可以甩动的开关|拖动、点击或甩动|设置开关,偏好控制|effect
Status Mark|就地变形任务图标|小状态图标从虚线待机环变为旋转或真实进度弧，结束时在原位画勾或叉。|任务图标原地变成勾,圆圈处理完变状态符号|任务状态或进度更新|智能体任务列表,工作流步骤|effect
Swipe Row|滑动露出操作列表行|列表行左右滑动显露操作，快速甩动吸附，完整滑动以操作色铺满并移除条目。|左滑露出删除按钮,划到底直接删除一行|拖动或甩动列表行|消息列表,任务管理|effect
Swipe Toast|可滑走的倒计时提示|提示从底部升起，细线显示剩余时间，悬停暂停，可向下甩动关闭。|通知可以往下甩走,提示有一条倒计时线|提示出现；悬停；向下滑动|操作提示,状态通知|effect
Tear Ticket|手撕票根卡片|拖动票根时纸纤维逐根拉断，锯齿边缘形成撕口，票根悬落，主体盖上已使用印记。|可以把票根撕下来,鼠标手撕优惠券|拖动票根撕开；悬停产生视差|活动票券,创意领取卡|effect
Thought Line|思考过程折叠标题|思考时图标与标题呼吸，计时与步骤展开，结束后淡变为耗时并收拢过程。|智能体思考完把过程收起来,思考标题显示用时|思考开始、步骤更新与完成|智能体推理过程,任务详情|structure
Voice Pill|语音电平胶囊按钮|麦克风按钮在按住或切换时伸为胶囊，显示电平条和计时，结束后缩回；默认使用模拟语音。|语音按钮展开成音量条,按住麦克风显示说话波形|按住或切换录音状态；真实麦克风需单独启用|智能体语音输入,聊天输入栏|effect
Wake Slider|尾波条形滑动条|细条组成无传统把手的滑块，拖动速度激起滞后的尾波，静止时重新铺平。|滑块后面拖着波浪,一排竖条跟着拖动起伏|拖动滑动条|音量控制,参数调节|effect
Warm Tooltip|连续温热提示组|首个悬停提示稍候弹出，同组下一项即时出现，可带随移动速度变化的倾斜。|看过一个提示其他马上出现,连续划过图标看提示|首次悬停延迟；同组相邻悬停即时提示|图标工具栏,辅助说明|effect
`.trim();

const normalized = value => {
  const url = new URL(value);
  url.hostname = url.hostname.replace(/^www\./, '');
  url.hash = '';
  url.pathname = url.pathname.replace(/\/$/, '');
  return url.href;
};
const hash = value => createHash('sha256').update(value).digest('hex');
const json = async url => {
  const response = await fetch(url, { headers: { 'User-Agent': 'visual-intent-catalog-curation' } });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response.json();
};
const catalogue = JSON.parse(await readFile('data/catalog.json', 'utf8')).filter(entry => entry.sourceId === 'reactbits');
const originalCount = catalogue.length;
const translations = new Map(rows.split('\n').map(row => {
  const [name, title, description, aliases, trigger, placements, stage] = row.split('|');
  return [name, { name, title, description, aliases: aliases?.split(','), trigger, placements: placements?.split(','), stage }];
}));
const commit = await json('https://api.github.com/repos/DavidHDev/react-bits/commits/main');
const tree = await json(`https://api.github.com/repos/DavidHDev/react-bits/git/trees/${commit.sha}?recursive=1`);
const collectedFrom = `https://raw.githubusercontent.com/DavidHDev/react-bits/${commit.sha}/public/llms.txt`;
const docResponse = await fetch(collectedFrom);
if (!docResponse.ok) throw new Error(`${docResponse.status}: ${collectedFrom}`);
const officialDoc = await docResponse.text();
const official = new Map();
for (const [index, line] of officialDoc.split('\n').entries()) {
  const match = line.match(/^- \[(.+?)\]\((https:\/\/(?:www\.)?reactbits\.dev\/[^)]+)\): (.+?) CLI: `([^`]+)`\./);
  if (match) official.set(normalized(match[2]), { name: match[1], description: match[3], cli: match[4], line: index + 1 });
}
const fluxPath = 'src/content/Backgrounds/FluxLines/FluxLines.jsx';
const fluxUrl = `https://raw.githubusercontent.com/DavidHDev/react-bits/${commit.sha}/${fluxPath}`;
const fluxResponse = await fetch(fluxUrl);
if (!fluxResponse.ok) throw new Error(`${fluxResponse.status}: ${fluxUrl}`);
const fluxSource = await fluxResponse.text();
official.set('https://reactbits.dev/backgrounds/flux-lines', { name: 'Flux Lines', cli: 'FluxLines', description: null, basisUrl: fluxUrl, sourceSha256: hash(fluxSource) });
const knownUrls = new Set(catalogue.map(entry => normalized(entry.sourceUrl)));
for (const [sourceUrl, item] of official) {
  if (!knownUrls.has(sourceUrl)) catalogue.push({ name: item.name, sourceUrl, status: 'draft', aliases: [] });
}
for (const [sourceUrl, path] of [
  ['https://reactbits.dev/animations/gradual-blur', 'src/content/Animations/GradualBlur/GradualBlur.jsx'],
  ['https://reactbits.dev/components/flowing-menu', 'src/content/Components/FlowingMenu/FlowingMenu.jsx'],
]) {
  const basisUrl = `https://raw.githubusercontent.com/DavidHDev/react-bits/${commit.sha}/${path}`;
  const response = await fetch(basisUrl);
  if (!response.ok) throw new Error(`${response.status}: ${basisUrl}`);
  Object.assign(official.get(sourceUrl), { basisUrl, sourceSha256: hash(await response.text()) });
}
const entries = {};
const issues = [];
const verifiedAt = new Date().toISOString();
for (const existing of catalogue) {
  const sourceUrl = normalized(existing.sourceUrl);
  const description = official.get(sourceUrl);
  let translation = translations.get(existing.name);
  if (existing.status === 'ready' && existing.aliases.length >= 2) {
    translation = Object.fromEntries(['name', 'title', 'description', 'aliases', 'trigger', 'placements', 'stage'].map(field => [field, existing[field]]));
  }
  if (!description || !translation) {
    issues.push({ sourceUrl, name: existing.name, issue: !description ? '官方结构化说明缺失' : '中文整理缺失' });
    continue;
  }
  const sourceFile = tree.tree.find(file => file.type === 'blob' && file.path.startsWith('src/content/') && file.path.endsWith(`/${description.cli}/${description.cli}.jsx`));
  if (!sourceFile) issues.push({ sourceUrl, name: existing.name, issue: '未找到官方默认实现文件' });
  const category = new URL(sourceUrl).pathname.split('/')[1];
  const implementationUrl = sourceFile ? `https://github.com/DavidHDev/react-bits/blob/${commit.sha}/${sourceFile.path}` : sourceUrl;
  entries[sourceUrl] = {
    ...translation,
    sourceUrl,
    tags: [...new Set([category, existing.name, ...translation.aliases])],
    implementationUrl,
    collectedFrom: description.basisUrl || collectedFrom,
    evidenceUrl: description.basisUrl || `${collectedFrom}#L${description.line}`,
    verifiedAt,
    evidence: { url: description.basisUrl || collectedFrom, sourceLine: description.basisUrl ? undefined : description.line, documentSourceLine: description.line, officialDescription: description.description, docSha256: hash(officialDoc), implementationPath: sourceFile?.path, gitBlobSha: sourceFile?.sha, sourceSha256: description.sourceSha256 },
  };
}
// Editorial summary corrected after reading the implementation: this is an edge blur,
// not a one-off text entrance. The official llms sentence is currently imprecise.
const blur = entries['https://reactbits.dev/animations/gradual-blur'];
if (blur) blur.evidence.note = '中文行为以官方 GradualBlur 实现的多层边缘模糊遮罩为准。';
const flowing = entries['https://reactbits.dev/components/flowing-menu'];
if (flowing) flowing.evidence.note = '中文行为以官方 FlowingMenu 实现的悬停图片文字 marquee 为准，而非 llms.txt 的 active indicator 描述。';
for (const [sourceUrl, entry] of Object.entries(entries)) {
  if (!entry.title || !entry.description || !entry.trigger || entry.aliases.length < 2 || !entry.placements.length || !entry.tags.length || !['structure', 'style', 'effect'].includes(entry.stage)) {
    throw new Error(`整理字段不完整: ${sourceUrl}`);
  }
}
if (Object.keys(entries).length !== catalogue.length) throw new Error(`覆盖不足: ${Object.keys(entries).length}/${catalogue.length}; ${JSON.stringify(issues)}`);
await mkdir('data/enrichment', { recursive: true });
await writeFile('data/enrichment/reactbits.zh.json', `${JSON.stringify({ sourceId: 'reactbits', collectedFrom, verifiedAt, upstreamCommit: commit.sha, originalCount, addedCount: catalogue.length - originalCount, method: '逐条译写官方公开 llms.txt 行为说明；实现链接由官方 Git tree 核验；适用位置与口语别名为编辑整理建议。四条已录制案例保留现有中文说明。Flux Lines 与 Gradual Blur、Flowing Menu 另读源码核实。', entries, issues }, null, 2)}\n`);
console.log(JSON.stringify({ coverage: Object.keys(entries).length, originalCount, addedCount: catalogue.length - originalCount, issues, upstreamCommit: commit.sha }, null, 2));
