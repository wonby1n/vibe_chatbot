// 초록색 확대 버튼 기능
const expandChat = document.getElementById('expand-chat');
let isExpanded = false;
expandChat.addEventListener('click', function() {
    if (!isExpanded) {
        chatContainer.classList.add('expanded');
        isExpanded = true;
        expandChat.title = '원래대로';
    } else {
        chatContainer.classList.remove('expanded');
        isExpanded = false;
        expandChat.title = '확대';
    }
});
// DALL-E 3 사진 생성 기능
const imageBtn = document.getElementById('image-btn');
imageBtn.addEventListener('click', async function() {
    const prompt = userInput.value.trim();
    if (!prompt) {
        alert('생성할 이미지를 설명해 주세요!');
        userInput.focus();
        return;
    }
    appendMessage('user', prompt);
    userInput.value = '';
    // 로딩 메시지
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'message bot';
    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'bubble';
    loadingBubble.textContent = '이미지 생성 중...';
    loadingMsg.appendChild(loadingBubble);
    chatBox.appendChild(loadingMsg);
    setTimeout(() => { chatBox.scrollTop = chatBox.scrollHeight; }, 0);
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: '1024x1024'
            })
        });
        if (!response.ok) throw new Error('이미지 생성 오류');
        const data = await response.json();
        const url = data.data?.[0]?.url;
        if (url) {
            loadingBubble.textContent = '';
            const img = document.createElement('img');
            img.src = url;
            img.alt = prompt;
            img.className = 'dalle-image';
            loadingBubble.appendChild(img);
        } else {
            loadingBubble.textContent = '이미지 생성 실패';
        }
    } catch (err) {
        loadingBubble.textContent = '⚠️ 이미지 생성 중 오류가 발생했습니다.';
    }
});
// 말풍선 색상 선택 기능
const colorBtns = document.querySelectorAll('.bubble-color-btn');
const colorClassMap = {
    '#007aff': 'bubble-blue',
    '#34c759': 'bubble-green',
    '#ff9500': 'bubble-orange',
    '#ff2d55': 'bubble-pink',
    '#8e8e93': 'bubble-gray'
};
colorBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        colorBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        // 기존 색상 클래스 제거
        Object.values(colorClassMap).forEach(cls => document.body.classList.remove(cls));
        // 새 색상 클래스 추가
        document.body.classList.add(colorClassMap[btn.dataset.color]);
    });
});
// 기본값
document.body.classList.add('bubble-blue');
colorBtns[0].classList.add('selected');
// iMessage 아이콘 클릭 시 챗봇 대화방으로 이동
const imessageIcon = document.getElementById('imessage-icon');
if (imessageIcon) {
    imessageIcon.addEventListener('click', function() {
        if (typeof openChatbot !== 'undefined') openChatbot.click();
    });
}
// 사용자 이름 및 이모티콘 관련 변수/함수
let userName = null;
let messages = [];
const emojiList = [
    '😀','😁','😂','🤣','😊','😍','😎','😭','😡','👍','🙏','👏','💡','🔥','🎉','🥳','😅','😇','😜','🤔','😱','😴','😏','😬','😢','😆','😋','😃','😄','😉','😚','😘','🥰','😗','😙','😛','😝','😤','😮','😲','😳','😵','😡','😠','😷','🤒','🤕','🤑','🤠','😈','👻','💩','🤖','👽','👾','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🦄','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦓','🦍','🦧','🐢','🐍','🦎','🦂','🦀','🦞','🦐','🦑','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦏','🦛','🐪','🐫','🦙','🦒','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦌','🐐','🦙','🦘','🦥','🦦','🦨','🦡','🐁','🐀','🐇','🐿️','🦔'
];

function showEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    picker.innerHTML = '';
    emojiList.forEach(emoji => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = emoji;
        btn.onclick = () => {
            userInput.value += emoji;
            picker.style.display = 'none';
            userInput.focus();
        };
        picker.appendChild(btn);
    });
    picker.style.display = 'flex';
}

document.getElementById('emoji-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const picker = document.getElementById('emoji-picker');
    if (picker.style.display === 'flex') {
        picker.style.display = 'none';
    } else {
        showEmojiPicker();
    }
});

document.addEventListener('click', function(e) {
    const picker = document.getElementById('emoji-picker');
    if (picker && !picker.contains(e.target) && e.target.id !== 'emoji-btn') {
        picker.style.display = 'none';
    }
});

function askName() {
    setTimeout(() => {
        appendMessage('bot', '안녕하세요! 성함이 어떻게 되세요?');
    }, 300);
}

function saveName(name) {
    userName = name;
}
// 여기에 본인의 OpenAI API 키를 입력하세요
const OPENAI_API_KEY = "당신의 api 키를 입력하세요";
const chatList = document.getElementById('chat-list');
const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const openChatbot = document.getElementById('open-chatbot');
const closeChat = document.getElementById('close-chat');
const minimizeChat = document.getElementById('minimize-chat');
const themeBtn = document.getElementById('toggle-theme');
const themeBtn2 = document.getElementById('toggle-theme2');

function showChat() {
    // 목록은 항상 보이고, 대화창만 오른쪽에 표시
    chatContainer.classList.add('active');
}

function showList() {
    chatContainer.classList.remove('active');
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    msgDiv.appendChild(bubble);
    // 시간 표시
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const timeDiv = document.createElement('div');
    timeDiv.className = 'msg-time';
    timeDiv.textContent = `${hh}:${mm}`;
    msgDiv.appendChild(timeDiv);
    chatBox.appendChild(msgDiv);
    // 항상 최신 메시지로 스크롤
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 0);
}


async function botReply(userText) {
    // 로딩 메시지 표시
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'message bot';
    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'bubble';
    loadingBubble.textContent = '...';
    loadingMsg.appendChild(loadingBubble);
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 대화 내역에 사용자 메시지 추가
    if (messages.length === 0) {
        let systemPrompt = 'You are a helpful assistant.';
        if (userName) {
            systemPrompt += ` 사용자의 이름은 ${userName}입니다. 답변할 때 ${userName}님이라고 불러주세요.`;
        }
        messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userText });

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                max_tokens: 1024,
                temperature: 0.7
            })
        });
        if (!response.ok) throw new Error('API 오류');
        const data = await response.json();
        let reply = data.choices?.[0]?.message?.content?.trim() || '답변을 불러올 수 없습니다.';
        loadingBubble.textContent = reply;
        messages.push({ role: 'assistant', content: reply });
    } catch (err) {
        loadingBubble.textContent = '⚠️ 답변 중 오류가 발생했습니다.';
    }
}
let waitingForName = false;

chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage('user', text);
    userInput.value = '';
    if (waitingForName) {
        saveName(text);
        waitingForName = false;
        botReply(`사용자 이름은 ${userName}입니다. 앞으로 ${userName}님이라고 부를게요.`);
        return;
    }
    botReply(text);
});

openChatbot.addEventListener('click', function() {
    showChat();
    // 대화방 입장 시 이름 물어보기
    if (!userName) {
        waitingForName = true;
        askName();
    }
    // 대화방 입장 시 messages 초기화
    messages = [];
});
closeChat.addEventListener('click', showList);
// 빨간 close 버튼 클릭 시 전체 상태 초기화 (대화, 이름, 입력 등)
closeChat.addEventListener('click', function() {
    chatBox.innerHTML = '';
    messages = [];
    userName = null;
    waitingForName = false;
    userInput.value = '';
    // 챗봇 헤더/이모지/타이틀 초기화
    const emoji = document.querySelector('.chat-emoji');
    const title = document.querySelector('.chat-title');
    emoji.textContent = '🤖';
    title.textContent = '챗봇';
    showList();
});

// 노란 minimize 버튼 클릭 시 최소화/복원
let isMinimized = false;
minimizeChat.addEventListener('click', function() {
    if (!isMinimized) {
        chatContainer.style.height = '60px';
        chatContainer.style.overflow = 'hidden';
        chatBox.style.display = 'none';
        chatForm.style.display = 'none';
        minimizeChat.title = '복원';
        isMinimized = true;
    } else {
        chatContainer.style.height = '';
        chatContainer.style.overflow = '';
        chatBox.style.display = '';
        chatForm.style.display = '';
        minimizeChat.title = '최소화';
        isMinimized = false;
    }
});
// 중복 이벤트 및 함수 제거, 테마 토글만 남김
function toggleTheme() {
    document.body.classList.toggle('dark');
}
themeBtn.addEventListener('click', toggleTheme);
themeBtn2.addEventListener('click', toggleTheme);
