

submitButton.onclick = async () => {
    let response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }),
    });

    let {status, token, message} = await response.json()
    if(status == 200){
        window.localStorage.setItem('token', token)
        window.location = '/'
    }else{
        span.textContent = message
    }
};
