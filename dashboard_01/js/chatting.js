// Mock data for chat rooms
const chatRooms = [
    {
        id: 9852,
        user1: {
            name: '우리두리 알콩달콩',
            avatar: './imges/avatar/Avatar=13.png',
            memo: '인상이 참 좋으싶습니다. 저는 서울에사는 공무원 입니다. 대화하고 싶어요'
        },
        user2: {
            name: '해피바이러스',
            avatar: './imges/avatar/Avatar=1.png'
        },
        lastMessage: '안녕하세요.. 님과대화하고 싶습니다.',
        date: '24/04/01',
        time: '16:44:62',
        messages: [
            {
                type: 'date',
                content: '2024년 5월 10일 금요일'
            },
            {
                type: 'user1',
                content: '안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요',
                time: '오전 4:12'
            },
            {
                type: 'user2',
                content: '안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요',
                time: '오전 4:12'
            }
        ]
    }
    // Add more mock data as needed
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderChatRooms();
    setupPagination();
    setupEventListeners();
});

// Handle logout
function handleLogout() {
    window.location.href = 'login.html';
}

// Handle search
function handleSearch(event) {
    event.preventDefault();
    const searchInput = event.target.querySelector('input[type="search"]');
    // Implement search logic
    return false;
}

// Handle chat search
function handleChatSearch() {
    const searchInput = document.querySelector('.input-search');
    // Implement chat search logic
}

// Handle select all checkbox
function handleSelectAll(checkbox) {
    const checkboxes = document.querySelectorAll('.one-check');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

// Handle sorting
function handleSort(column) {
    // Implement sorting logic
}

// Render chat rooms
function renderChatRooms() {
    const tbody = document.getElementById('chatTableBody');
    tbody.innerHTML = chatRooms.map(room => `
        <tr onclick="loadChatRoom(${room.id})">
            <td><input type="checkbox" class="one-check"></td>
            <td class="table-num">${room.id}</td>
            <td class="user-1">
                <img src="${room.user1.avatar}">
                <p>${room.user1.name}</p>
            </td>
            <td>
                <img src="./imges/icon/icons8-love-arrow.gif" class="icon-heart">
            </td>
            <td class="user-2">
                <img src="${room.user2.avatar}">
                <p>${room.user2.name}</p>
            </td>
            <td class="memo">${room.lastMessage}</td>
            <td><span class="date">${room.date}</span> 
                <span class="time">${room.time}</span>
            </td>
            <td class="chatting-btn">
                <div class="status completed" onclick="handleWarning(${room.id})">경고</div>
                <div class="status process" onclick="handleDeleteRoom(${room.id})">방삭제</div>
            </td>
        </tr>
    `).join('');
}

// Load chat room
function loadChatRoom(roomId) {
    const room = chatRooms.find(r => r.id === roomId);
    if (room) {
        document.getElementById('currentChatNumber').textContent = room.id;
        document.getElementById('currentUser1Name').textContent = room.user1.name;
        document.getElementById('currentUser1Memo').textContent = room.user1.memo;
        renderChatMessages(room.messages);
    }
}

// Render chat messages
function renderChatMessages(messages) {
    const chatPanel = document.getElementById('chatPanel');
    chatPanel.innerHTML = messages.map(msg => {
        switch (msg.type) {
            case 'date':
                return `
                    <div class="date-chat">
                        <div class="wrap">
                            <div class="item">
                                <i class='bx bx-calendar'></i>
                                <span>${msg.content}</span>
                            </div>
                        </div>
                    </div>
                `;
            case 'user1':
                return `
                    <div class="user-1-chat">
                        <img class="profile-image user-1" src="./imges/avatar/Avatar=12.png" alt="">
                        <div class="chat-wrap-left">
                            <div class="user-1-name">우리두리 알콩달콩</div>
                            <div class="bubble-wrap">
                                <div class="chat-bubble">${msg.content}</div>
                                <div class="user-1-time">${msg.time}</div>
                            </div>
                        </div>
                    </div>
                `;
            case 'user2':
                return `
                    <div class="user-2-chat">
                        <div class="chat-wrap-right">
                            <div class="user-2-name">쵸콜릿처럼 달콤함</div>
                            <div class="bubble-wrap">
                                <div class="user-2-time">${msg.time}</div>
                                <div class="chat-bubble">${msg.content}</div>
                            </div>
                        </div>
                        <img class="profile-image user-2" src="./imges/avatar/Avatar=2.png" alt="">
                    </div>
                `;
            default:
                return '';
        }
    }).join('');
}

// Handle message input
function handleMessageInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send message
function sendMessage() {
    const input = document.querySelector('.chat-box-tray input');
    const message = input.value.trim();
    if (message) {
        // Implement message sending logic
        input.value = '';
    }
}

// Handle warning
function handleWarning(roomId) {
    // Implement warning logic
}

// Handle delete room
function handleDeleteRoom(roomId) {
    // Implement room deletion logic
}

// Refresh chat
function refreshChat() {
    // Implement chat refresh logic
}

// Toggle chat view
function toggleChatView() {
    // Implement chat view toggle logic
}

// Show chat menu
function showChatMenu() {
    // Implement chat menu logic
}

// Setup pagination
function setupPagination() {
    const pagination = document.getElementById('pagination');
    // Implement pagination logic
}

// Setup event listeners
function setupEventListeners() {
    // Add any additional event listeners
} 