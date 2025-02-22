const getCalendar = (initialDate) => {
  document.querySelector("#calendarview")?.remove();
  document.querySelector("bdv-time-tracker-list")?.remove();

  const calendarView = document.createElement("div");
  calendarView.className = "calendar-view";
  calendarView.id = "calendarview";

  document.querySelector(".open-hours-panel").appendChild(calendarView);

  const calendarEl = document.getElementById("calendarview");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: false,
    initialDate
  });
  calendar.render();
  return calendar;
};

chrome.runtime.onMessage.addListener((media, sender, sendResponse) => {
  if (media.event === "mountdatacalendar") {
    const dates = Object.keys(media.data);

    const initialDate = dates[0].split("T").shift();
    const calendar = getCalendar(initialDate);

    for (day of dates) {
      const data = day.split("T").shift();
      let daySum = 0;
      media.data[day].forEach((event) => {
        calendar.addEvent({
          title: event.hours + "h - " + event.descriptionName,
          start: data,
          allDay: true,
          color: "grey",
        });
        daySum += event.hours;
      });

      calendar.addEvent({
        title: "Total: " + daySum + "h ",
        start: data,
        allDay: true,
        color: "blue",
      });
    }
  }
});
