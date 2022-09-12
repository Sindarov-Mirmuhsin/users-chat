



submitButton.onclick = async () => {
    let formData = new FormData()
    formData.append("username", usernameInput.value);
    formData.append("password", passwordInput.value);
    formData.append("file", uploadInput.files[0]);

    let response = await fetch('/register', {
        method: "POST",
        body: formData
    })

    let { status, token, message } = await response.json();
    if (status == 201) {
      window.localStorage.setItem("token", token);
      window.location = "/login";
    } else {
      span.textContent = message;
    }
}

