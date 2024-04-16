import { getRandom_update_time } from "./getRandom.js";

function update_view_time(data) {
  const timeElement = document.getElementById("time");
  timeElement.textContent = data.time_usec;
}

function update_time() {
  const simulatedData = getRandom_update_time();
  update_view_time(simulatedData);
  console.log(`Time: ${simulatedData.time_usec}`);
}

update_time();
setInterval(update_time, 2000);
