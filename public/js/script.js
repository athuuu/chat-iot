const socket = io();

socket.on("connect", () => {
  socket.emit("enter_room", "accueil");
});

window.onload = () => {
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector("#username");
    const messages = document.querySelector("#message");

    const room = document.querySelector("#tabs li.active").dataset.room;
    const createdAt = new Date();

    socket.emit("chat_message", {
      name: name.value,
      message: messages.value,
      room: room,
      createdAt: createdAt,
    });

    document.querySelector("#message").value = "";
  });

  socket.on("chat_message", (msg) => {
    document.querySelector(
      "#messages"
    ).innerHTML += `<p>${msg.name} a dit ${msg.message}</p>`;
  });

  document.querySelectorAll("#tabs li").forEach((tab) => {
    tab.addEventListener("click", function () {
      if (!this.classList.contains("active")) {
        const actif = document.querySelector("#tabs li.active");
        actif.classList.remove("active");
        this.classList.add("active");
        document.querySelector("#messages").innerHTML = "";
        socket.emit("leave_room", actif.dataset.room);
        socket.emit("enter_room", this.dataset.room);
      }
    });
  });
};
