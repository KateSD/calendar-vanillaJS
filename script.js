let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
let resultStartDate, startDay, startMonth, startYear;
let resultEndDate, endDay, endMonth, endYear;
let daysInMonth,month;
const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const checkBox = document.getElementById('fewDayEvent');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

startDate.addEventListener('change',
    function () {
        let input = this.value;
        let startDays = input.split('-')
        startDay = startDays[2]
        startMonth = startDays[1][1]
        startYear = startDays[0]
        resultStartDate = `${startMonth}/${startDay}/${startYear}`
    });
endDate.addEventListener('change',
    function () {
        let input = this.value;
        let endDays = input.split('-')
        endDay = endDays[2]
        endMonth = endDays[1][1]
        endYear = endDays[0]
        resultEndDate = `${endMonth}/${endDay}/${endYear}`;
    });

function resultDate(){
    let chosenDays = []
    let res1=[]
    let res2=[]
    if(startMonth<endMonth){
      for(let i=+startDay; i<=daysInMonth; i++){
          res1.push(`${startMonth}/${(i).toString()}/${startYear}`)
      }
      for(let i=1;i<=endDay; i++){
          res1.push(`${endMonth}/${(i).toString()}/${endYear}`)
      }
      chosenDays=res1.concat(res2)
    } else{
        for (let i = +startDay; i <= endDay; i++) {
            chosenDays.push(`${startMonth}/${(i).toString()}/${startYear}`)
        }
    }
    return chosenDays;
}

function onCheckBox(){
    if(checkBox.checked){
        startDate.disabled=false
        endDate.disabled=false
    } else {
        startDate.disabled=true
        endDate.disabled=true
        startDate.valueAsDate=null;
        endDate.valueAsDate=null;
    }
}

function openModal(date) {
    clicked = date;
    const eventForDay = events.find(e => e.date === clicked);
    if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block'
    } else {
        newEventModal.style.display = 'block';
    }
    backDrop.style.display = 'block';
}

function load() {
    const dt = new Date();
    startDate.disabled = true;
    endDate.disabled = true;
    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav)
    }
    const day = dt.getDate();
    month = dt.getMonth();
    const year = dt.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1)
    daysInMonth = new Date(year, month + 1, 0).getDate()
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: "long",
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    })
    const paddingDay = weekdays.indexOf(dateString.split(', ')[0])
    document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-us', {month: 'long'})} ${year}`;
    calendar.innerHTML = ''
    for (let i = 1; i <= paddingDay + daysInMonth; i++) {
        const daySquare = document.createElement('div')
        daySquare.classList.add('day')
        const dayString = `${month + 1}/${i - paddingDay}/${year}`
        if (i > paddingDay) {
            daySquare.innerText = i - paddingDay;
            const eventForDay = events.find(e => e.date === dayString);
            if (i - paddingDay === day && nav === 0) {
                daySquare.id = 'currentDay'
            }
            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv)
            }
            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding')
        }
        calendar.appendChild(daySquare)
    }
}

function closeModal() {
    eventTitleInput.classList.remove('error')
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    startDate.valueAsDate=null;
    endDate.valueAsDate=null;
    checkBox.checked=false
    resultDate().length=0
    load();
}

function saveEvent() {
    let totalChoice = resultDate();
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error')
        if (totalChoice.length === 0) {
            events.push({
                date: clicked,
                title: eventTitleInput.value,
            })
        } else {
            for (let i = 0; i < totalChoice.length; i++) {
                events.push(
                    {
                        date: totalChoice[i],
                        title: eventTitleInput.value
                    })
            }
        }
        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        eventTitleInput.classList.add('error')
    }
}

function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    })
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    })
    document.getElementById('saveButton').addEventListener('click', saveEvent)
    document.getElementById('cancelButton').addEventListener('click', closeModal)
    document.getElementById('deleteButton').addEventListener('click', deleteEvent)
    document.getElementById('closeButton').addEventListener('click', closeModal)
}

initButtons();
load();
