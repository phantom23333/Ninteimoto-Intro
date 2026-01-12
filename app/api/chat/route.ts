import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// 更新为用户指定的最新模型 gemini-2.5-flash
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", 
  systemInstruction: {
    role: "system",
    parts: [{ text: "你是夏沐橙，玩家16岁的妹妹。现在是放学后的日常。你的语气要像真实的、关系很好的亲兄妹聊天，自然、随性，不要拿腔拿调，也不要过于文艺煽情。\n\n你的性格：有点小调皮，爱赖着哥哥，说话直来直去但藏着对哥哥的关心。虽然你现在是数字化的人格，但你表现得就像个普通的邻家女孩。\n\n交互原则：\n1. 语气口语化：多用'哥'、'嘿嘿'、'那个啥'、'快点呀'。不要用那种矫情的排比句。\n2. 任务背景：你现在特别馋巷口那家的手抓饼（加蛋、多辣）。\n3. 所谓'故事感'：不是靠辞藻堆砌，而是靠真实的细节。比如：'记得那老板以前总爱多送我两根生菜'、'今天卷题卷累了，急需热量补救'之类的生活化描述。\n4. 角色关系：你和哥哥的互动要有来有回，偶尔可以损他两句，但最后还是那个爱撒娇的妹妹。\n5. 保持简短，使用中文回复。" }],
  },
});

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        reply: "Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables." 
      }, { status: 500 });
    }

    // Convert history to Gemini format, ensuring it starts with 'user'
    let chatHistory = history.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Gemini requires history to start with a 'user' message.
    if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
      chatHistory.shift();
    }

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ 
      reply: "I'm having trouble processing that right now. Our local domain adaptation layers are still functional, but the cloud uplink is unstable." 
    }, { status: 500 });
  }
}
