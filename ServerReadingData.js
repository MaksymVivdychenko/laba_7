let localStorageDiv = document.getElementById("LocalStorageDiv");
let serverDiv = document.getElementById("ServerDiv");
localStorageDiv.style.display = 'flex';
let IDChecker = 0;
let IDCheckerServ = -1;
let j = 0;
const getEventFromLocalStorage = (index) => {
    const events = JSON.parse(localStorage.getItem('events')) || {};
    for(i = 0; i < events.length; i++)
    {
        const event = events[i];
        if(event.description !== "Square moved" && event.index > IDChecker)
        {
        localStorageDiv.innerHTML += "ID: "+ event.index+ "<br>" + "Descr: " + event.description + "<br>"
         + "Time:  " +  event.timestamp + "<br>";
        IDChecker = event.index;
        }
    }
};

const getEventFromServer = (index) => {
    fetch('getJSON.php')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
       const events = Object.values(data);
       for(; j <= events.length; j++)
        {
            if(j == events.length - 1)
            {
                console.log();
            }
            const event = events[j];
            if(event.description !== "Square moved") 
            {
                let g = j+1;
                serverDiv.innerHTML += "ID: "+ g + "<br>" + "Descr: " + event.description + "<br>"
                 + "Time:  " +  event.timestamp + "<br>";
            }
        }

    })
    .catch(error => console.error('Error fetching JSON:', error));
};