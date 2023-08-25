let adBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textArea = document.querySelector(".textarea-cont");
let AllpriorityColor = document.querySelectorAll(".priority-color");

let colors = ["lightred", "lightblue", "lightgreen", "lightyellow"];
let modalPriorityColor = colors[0];

let toolboxColors = document.querySelectorAll(".color");
let ticketArr = [];

let addFlag;
let removeFlag;

if (localStorage.getItem("jiraTickets")) {
  ticketArr = JSON.parse(localStorage.getItem("jiraTickets"));
  ticketArr.forEach((ticketObj) => {
    createTicket(
      ticketObj.ticketColor,
      ticketObj.ticketTask,
      ticketObj.ticketID,
      false
    );
  });
}

//handling toolbox color functionality
toolboxColors.forEach((Col) => {
  Col.addEventListener("click", (e) => {
    currToolBoxColor = Col.classList[0];
    let tkts = document.querySelectorAll(".ticket-cont");
    tkts.forEach((tkt) => {
      let tktColor = tkt.children[0].classList[1];
      if (tktColor == currToolBoxColor) tkt.style.display = "block";
      else tkt.style.display = "none";
    });
  });
  Col.addEventListener("dblclick", (e) => {
    displayAll();
  });
});
function displayAll() {
  let tkts = document.querySelectorAll(".ticket-cont");
  tkts.forEach((tkt) => {
    tkt.style.display = "block";
  });
}


// event listener for modal priority coloring
// here we are applying event listener so that we can achieve 
//toogle functionality in our border which means whichever color 
//we will select border will come on that color
AllpriorityColor.forEach((color) => {
  color.addEventListener("click", (e) => {
    AllpriorityColor.forEach((colorE) => {
      colorE.classList.remove("border");
    });
    color.classList.add("border");
    modalPriorityColor = color.classList[0];
  });
});

 //display modal and generate tickets
adBtn.addEventListener("click", (e) => {
  addFlag = !addFlag;
  removeFlag = false;
  if (addFlag) {
    modalCont.style.display = "flex";
    setBorderToDefault();
  } else {
    modalCont.style.display = "none";
  }
});

//function to remove tickets
removeBtn.addEventListener("click", (e) => {
  removeFlag = !removeFlag;
  adBtn = false;
  let allElem = document.querySelectorAll(".ticket-cont");
  allElem.forEach((ticket) => {
    ticket.addEventListener("click", (e) => {
      let id = ticket.querySelector(".ticket-id").innerText.split("#")[1];
      console.log(id);
      handleRemover(ticket, id);
    });
  });
});

//that whenever we write about our tickets in modal cont and when we pressed enter key then generate that
//ticket and make the modal cont and its inner text to invisible
modalCont.addEventListener("keydown", (e) => {
  let key = e.key;
  if (key === "Enter") {
    createTicket(modalPriorityColor, textArea.value, shortid(), true);
    modalCont.style.display = "none";
    textArea.value = "";
    addFlag = false;
    displayAll();
  }
});

// this function to create tickets and it is called when, user write something in modal cont and press
//enter key then at that tym this function is called
function createTicket(ticketColor, ticketTask, ticketID, flag) {
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `
            <div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">#${ticketID}</div>
            <div class="task-area">
                ${ticketTask}
            </div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>
    `;
  mainCont.appendChild(ticketCont);
  //flag used in order to remove the problem of duplicacy of tickets
  if (flag) {
    ticketArr.push({ ticketColor, ticketID, ticketTask });
    localStorage.setItem("jiraTickets", JSON.stringify(ticketArr));
  }
  handleLock(ticketCont, ticketID);
  handleColor(ticketCont, ticketID);

  // allLocks=document.querySelectorAll(".fa-solid");
  // lockingSystem();
}

//function to handle color of generated tickets
function handleColor(ticket, id) {
  let ticketColor = ticket.querySelector(".ticket-color");
  
  ticketColor.addEventListener("click", (e) => {
    // get ticketIdx form ticketArr
    let TIdx = getTicketIdx(id);

    let currColor = ticketColor.classList[1];
    // get idx of current color
    let currColIdx = colors.findIndex((color) => {
      return currColor === color;
    });

    let nextColIdx = (currColIdx + 1) % 4;
    let newColor = colors[nextColIdx];
    ticketColor.classList.remove(currColor);
    ticketColor.classList.add(newColor);

    // modify data in local storage
    ticketArr[TIdx].ticketColor = newColor;
    // console.log(ticketArr[TIdx].ticketColor)
    localStorage.setItem("jiraTickets", JSON.stringify(ticketArr));
  });
}

function getTicketIdx(id) {
  let ticketIdx = ticketArr.findIndex((ticketObj) => {
    // console.log(id===ticketObj.ticketID,ticketObj.ticketID===id)
    return ticketObj.ticketID === id;
  });
  return ticketIdx;
}

//function to remove tickets
function handleRemover(ticket, id) {
  // removeFlag -> true -> remove
  if (removeFlag) {
    // to get the index of ticket arr to be removed
    let TIdx = getTicketIdx(id);
    ticketArr.splice(TIdx, 1);
    // updating the local storage with the updated ticketArr after removal
    localStorage.setItem("jiraTickets", JSON.stringify(ticketArr));
    ticket.remove();
    // removeFlag=false;
  }
}

//handling lock functionality of our tickets
function handleLock(ticket, id) {
  let ticketLockElem = ticket.querySelector(".ticket-lock");
  let ticketLock = ticketLockElem.children[0];
  let ticketTaskArea = ticket.querySelector(".task-area");
  ticketLock.addEventListener("click", (e) => {
    // get ticket index where the task is to be modified
    let TIdx = getTicketIdx(id);
    if (ticketLock.classList.contains("fa-lock")) {
      ticketLock.classList.remove("fa-lock");
      ticketLock.classList.add("fa-lock-open");
      ticketTaskArea.setAttribute("contenteditable", "true");
     
    } else {
      ticketLock.classList.remove("fa-lock-open");
      ticketLock.classList.add("fa-lock");
      ticketTaskArea.setAttribute("contenteditable", "false");
      // modify data in lock storage(Task)
      ticketArr[TIdx].ticketTask = ticketTaskArea.innerText;
      localStorage.setItem("jiraTickets", JSON.stringify(ticketArr));
    }
  });
}

//setting border color to default
function setBorderToDefault() {
  AllpriorityColor.forEach((colorE) => {
    colorE.classList.remove("border");
  });
  AllpriorityColor[0].classList.add("border");
}
