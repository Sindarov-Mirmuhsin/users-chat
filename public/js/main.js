
let socket  = io({auth: {token: window.localStorage.getItem('token')}})


let lastUserId
async function renderUser () {
    let response = await (await fetch("/users")).json();
    let { userId } = await renderProfile()
    for(let user of response.data){
        if(userId != user.userId){
        let li = document.createElement('li')
        li.classList.add("chats-item");
        li.innerHTML = `
            <img src="${user.avatar}" alt="profile-picture">
            <p>${user.username}</p>
            <span data-id="${user.userId}" class="${user.socketId ? "user-online" : ""}"></span>
        `;
            chatList.append(li)
            li.onclick = () => {
                chatMain.innerHTML = null
                lastUserId = user.userId
                renderPrivate(user)
                getMessages(user.userId)
            }
        }
    }
}


async function getMessages (clickUserId) {
    let response = await (await fetch("/messages?userId=" + clickUserId, {
        method: "GET",
        headers: {'Content-Type': 'application/json',token: window.localStorage.getItem('token')}
    } )).json();
    renderMessage(response.data)
}   


async function renderPrivate (user) {
    imgProfile.src = user.avatar
    userProfile.textContent = user.username
}

async function renderMessage (messages) {
    let { userId } = await renderProfile()
    for(let message of messages){
        let div = document.createElement('div')
        div.classList.add("msg-wrapper", message.from.userId == userId ? "msg-from" : null);
        div.innerHTML = `
            <img src="${message.from.avatar}" alt="profile-picture">
                <div class="msg-text">
                    <p class="msg-author">${message.from.username}</p>
                    <p class="msg">${message.text}</p>
                    <p class="time">${message.created_at}</p>
                </div>
        `;
        chatMain.append(div)
        chatMain.scrollTo({top: 100000000})
    }
}   


async function renderProfile () {
    let response = await (await fetch('/users/' + token)).json()
    profileDiv.innerHTML = `
        <img src="${response.data.avatar}" alt="profile-avatar" class="profile-avatar">
        <p class="profile-name">${response.data.username}</p>
    `;
    return response.data
}

renderProfile()
renderUser()

let lastTimeId
textInput.onkeyup = async e => {
    if(e.keyCode == 13){
        socket.emit('new-message', {to: lastUserId, text: textInput.value})
        renderMessage([{ to: lastUserId, from: await renderProfile(), text: textInput.value, created_at: "15:00"}]);
        socket.emit("stop", { to: lastUserId });
        textInput.value = null 
    }

    if(lastTimeId) return
    socket.emit("typing", { to: lastUserId });


    lastTimeId = setTimeout(() => {
        lastTimeId = undefined
        socket.emit("stop", { to: lastUserId });
    },2000)

}

socket.on('typing', () => {
    typing.textContent = 'is typing...'
})


socket.on("stop", () => {
  typing.textContent = null
});


socket.on('send-message', (messages) => {
    setTimeout(() => {
        renderMessage([messages]);
    },300)
})

socket.on('exit', () => {
    window.localStorage.clear()
    window.location = '/login'
})

socket.on("user-connect", (userId) => {
    let span = document.querySelector(`.chats-item span[data-id="${userId}"]`);
    span.classList.add("user-online");
});

socket.on("user-disconnect", (userId) => {
  let span = document.querySelector(`.chats-item span[data-id="${userId}"]`);
  span.classList.remove("user-online");
});