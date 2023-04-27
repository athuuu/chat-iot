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
    publish(msg);
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
  socket.on("init_messages", (msg) => {
    let data = JSON.parse(msg.messages);
    if (data != []) {
      data.forEach((donnees) => {
        publish(donnees);
      });
    }
  });
  document.querySelector("#message").addEventListener("input", () => {
    const name = document.querySelector("#username").value;

    const room = document.querySelector("#tabs li.active").dataset.room;

    socket.emit("en train d'ecrire", {
      username: username,
      room: room,
    });
  });
  socket.on("quelqu'un ecrit", (msg) => {
    const writing = document.querySelector("#writing");

    writing.innerHTML = `${msg.username} est en train d'ecrire`;

    setTimeout(function () {
      writing.innerHtml = "";
    }, 3000);
  });
};

function publish(msg) {
  let created = new Date(msg.createdAt);
  let texte = `<div><p>${
    msg.name
  } <small>${created.toLocaleDateString()}</small></p><p>${
    msg.message
  }</p></div>`;

  document.querySelector("#messages").innerHTML += texte;
}
