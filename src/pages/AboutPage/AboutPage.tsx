import { useState } from 'react';
import { Image } from '@/components/ui/image';
import { Card, CardContent } from '@/components/ui/card';
import { SITE } from '@/config/site';
import wechatQr from '@/assets/wechat-qr.png';

export default function AboutPage() {
  const [showQr, setShowQr] = useState(false);
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">关于{SITE.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{SITE.tagline}</p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div>
            <h2 className="font-semibold">关于本站</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                VERITY 是一个人格测评与个人生活规划平台。我们相信，认识自己是一切选择的起点——但工具本身不能替代你的判断。
              </p>
              <p>
                本站目前收录 26 套测评与规划工具，分为三个层级：
              </p>
              <ul className="ml-4 list-disc space-y-1.5">
                <li>
                  <span className="font-medium text-foreground">标准化量表</span>
                  ：具备心理学实证基础，如大五人格、16PF、HEXACO、成人依恋等，用于深度自我觉察；
                </li>
                <li>
                  <span className="font-medium text-foreground">人格类型</span>
                  ：网络流行人格框架，如 MBTI、DISC 等，提供对话性的自我描述参考；
                </li>
                <li>
                  <span className="font-medium text-foreground">行为探索</span>
                  ：轻松向的趣味测评，用于社交与自我探索；
                </li>
                <li>
                  <span className="font-medium text-foreground">财务规划工具</span>
                  ：财务自由计算器，基于你输入的生活目标与财务数据做情景模拟与长期现金流规划。
                </li>
              </ul>
              <p>
                所有测评均在浏览器本地完成计算，你的答案与财务数据不会上传至任何服务器。界面采用克制的编辑式设计，结果报告逐维度给出解读，并保留你自己思考的空间。
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold">免责声明</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                本站所有测评与规划工具仅供自我探索与教育参考，不能替代心理咨询师、精神科医生、持牌理财顾问或其他专业人士的评估与建议。
              </p>
              <p>
                心理学测评的结果受作答状态、文化背景、施测环境等多种因素影响，不应作为婚恋匹配、招聘录用、升学选拔、临床诊断、投资决策、保险配置或任何重大人生选择的唯一依据。
              </p>
              <p>
                财务自由计算器的所有结果均为基于你输入参数与假设情景的模拟，不构成任何投资建议、收益承诺或税务规划方案。收益率、通胀率、提款率等参数为可编辑假设，实际市场表现可能显著偏离。自住房产、养老金、社会保险等未单独配置的项目不会被自动计入。
              </p>
              <p>
                如果你正在经历持续的情绪困扰、心理危机或财务困难，请及时联系当地专业机构或合格的专业人士。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent
          className="flex cursor-pointer items-center justify-between gap-3 p-6 transition-colors hover:bg-accent/50"
          onClick={() => setShowQr(true)}
        >
          <div>
            <div className="text-lg font-bold">广告位招租</div>
            <p className="mt-1 text-sm text-muted-foreground">
              位置可指定 · 长期稳定运营 · 价格超低，欢迎扫码洽谈
            </p>
          </div>
          <span aria-hidden className="text-muted-foreground">→</span>
        </CardContent>
      </Card>

      {showQr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowQr(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl border bg-background p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={wechatQr} alt="扫码添加微信洽谈广告" className="mx-auto w-full max-w-[240px] rounded-xl" />
            <p className="mt-3 text-sm text-muted-foreground">扫二维码，添加我为朋友，洽谈广告合作</p>
            <button
              className="mt-3 inline-flex rounded-full border px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setShowQr(false)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
