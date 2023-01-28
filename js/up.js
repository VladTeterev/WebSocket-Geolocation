function pageLoaded() {
  // Находим элементы страницы
  const infoOutput = document.querySelector(".info_output");
  const chatOutput = document.querySelector(".chat_output");
  const input = document.querySelector("input");
  const sendBtn = document.querySelector(".btn_send");
  const btnGetGeo = document.querySelector(".get_geo");

  //   Работаем с WebSocket
  const wsUri = "wss://echo-ws-service.herokuapp.com";
  let socket = new WebSocket(wsUri);

  socket.onopen = () => {
    infoOutput.innerText = "Соединение установлено";
  };

  socket.onmessage = (event) => {
    writeToChat(event.data, true);
  };

  socket.onerror = () => {
    infoOutput.innerText = "При передаче данных произошла ошибка";
  };

  // Отправить сообщение
  sendBtn.addEventListener("click", sendMessage);

  function sendMessage() {
    if (!input.value) return;
    socket.send(input.value);
    writeToChat(input.value, false);
    input.value = "";
  }
  // Вывод сообщений в  чат
  function writeToChat(message, isRecieved) {
    let messageHTML = `<div class="${
      isRecieved ? "recieved" : "sent"
    }">${message}</div>`;
    chatOutput.innerHTML += messageHTML;
  }

  //  Определение геолокации
  btnGetGeo.addEventListener("click", () => getLocation());
  function getLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    } else {
      writeToChat("Ваш браузер не поддерживает определение местоположения");
    }
  }
  // При успешном выполнении
  function locationSuccess(data) {
    let link = `https://www.openstreetmap.org/#map=18/${data.coords.latitude}/${data.coords.longitude}`;
    writeToChat(`<a href="${link}" target="_blank">Вы находитесь здесь</a>`);
  }
  // При ошибке
  function locationError() {
    writeToChat("Произошла ошибка при определении местоположения");
  }
}

// Обработчик на запуск кода при загрузке страницы
document.addEventListener("DOMContentLoaded", pageLoaded);
