window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

const hasOnscreenKeyboard = window.mobileAndTabletCheck();
// const debug = location.hostname !== "berganza.live";
const debug = false;

const elementDots = document.getElementById("dots");
const messageContainer = document.getElementById("messageContainer")
const mainContainer = document.getElementById("chat");
const elementIndicator = document.getElementById("indicator");

const sendButton = document.getElementById("sendButton");
const printButton = document.getElementById("printButton");

const audio = new Audio("assets/625498__abhisheky948__animal-dog-bark-01.mp3");
const onlineStatus = document.getElementById("status");
const newMessage = document.getElementById("newMessage");
const avatar = document.getElementById("avatar");
const headertext = document.getElementById("headertext");
const canVibrate = window.navigator.vibrate;

const header = document.getElementById("completeHeader");
const mainInfo = document.getElementById("mainInfo");
const mainChat = document.getElementById("mainChat");

const elementMessage = document.getElementById("messageInput");


var block = false;
var showsInformation = false;
var autoScroll = true;
var mainHeight = -1;
var scrollInfo = false;

var touchLastX, touchLastY, touchMoveX, touchMoveY;
var touchLastTime;


function checkHeightChange(trigger) {
  const computedStyle = getComputedStyle(mainContainer);
  const height = parseFloat(computedStyle.height);
  if (mainHeight < 0) {
    mainHeight = height;

  } else if (height != mainHeight) {
    trigger(height - mainHeight);
    mainHeight = height;
  }
}

function startHeightListener(trigger) {
  setTimeout(function() {
    checkHeightChange(trigger);
    startHeightListener(trigger);
  }, 100);
}

function onInput(event) {
  const computedStyle = getComputedStyle(this);
  const padding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
  
  this.style.height = 'auto';
  //this.style.height = 'min(' + (this.scrollHeight - padding) + 'px, 128px)';

  this.style.height = Math.min(this.scrollHeight - padding, 128) + 'px';

  console.log(this.style.height);

  // height = 2 * padding + no_rows * line-height * font-size
}

function checkScrolledDown(event) {
  autoScroll = this.scrollHeight - this.scrollTop - this.clientHeight < 10;
  if (autoScroll && !showsInformation) {
    indicateNewMessage(false)
  }
}

async function onKey(event) {
  const message = this.value;
  if (event.key === "Enter" && !event.shiftKey && message.length >= 1) {
    await sendMessage(message);

    event.preventDefault();

    this.value = "";
    this.style.height = 'auto';
  }
}

async function onClick(event) {
  elementMessage.focus();
  const message = elementMessage.value;
  if (message.length >= 1) {
    await sendMessage(message);
    elementMessage.value = "";
    elementMessage.style.height = 'auto';
  }
}

function toggleInformation() {
  mainInfo.classList.toggle("active");
  printButton.hidden = !showsInformation;

  elementMessage.blur()

  if (showsInformation) {
    if (autoScroll) {
      indicateNewMessage(false);
    }
    showsInformation = false;
    console.log("hide information");

  } else {
    showsInformation = true;
    console.log("show information");
  }
  
}

function touchStart(event) {
  scrollInfo = mainInfo.scrollHeight - mainInfo.scrollTop - mainInfo.clientHeight >= 10;

  const finger = event.changedTouches[0];
    
  touchMoveX = 0;
  touchLastX = finger.clientX;

  touchMoveY = 0;
  touchLastY = finger.clientY;

  touchLastTime = new Date().getTime();
}

function touchMove(event) {
  if (scrollInfo && showsInformation) {
    return;
  }
  const finger = event.touches[0];

  const touchDeltaX = finger.clientX - touchLastX;
  touchMoveX += touchDeltaX;
  touchLastX = finger.clientX;

  const touchDeltaY = finger.clientY - touchLastY;
  touchMoveY += touchDeltaY;
  touchLastY = finger.clientY;

  if (header.isEqualNode(this)) {
    if (!showsInformation) {
      if (touchMoveY < 0) {
        mainInfo.style.top = "max(0, calc(-100% - " + Math.abs(Math.round(touchMoveY)) + "px))";
        console.log("swipe up");

      } else {
        mainInfo.style.top = "calc(-100% + " + Math.round(touchMoveY + header.clientHeight) + "px)";
        console.log("swipe down");
      }
    }
  } else if (mainInfo.isEqualNode(this)) {
    if (touchMoveY < 0) {
      mainInfo.style.top = "calc(-100% - " + Math.abs(Math.round(touchMoveY)) + "px)";
      console.log("swipe up");

    } else {
      mainInfo.style.top = "min(-100%, calc(-100% + " + Math.round(touchMoveY) + "px))";
      console.log("swipe down");
    }
  } else {
    console.log("wrong element", this);
  }
}

function touchEnd(event) {
  const touchDuration = new Date().getTime() - touchLastTime;
  const touchSpeedY = touchMoveY / touchDuration;
  
  if (header.isEqualNode(this)) {
    if (!showsInformation) {
      mainInfo.style.top = "-100%";
      if (touchSpeedY >= 1.0 || touchMoveY >= mainInfo.clientHeight / 2) {
        mainInfo.style.transitionDuration = "0.0s";
        mainInfo.style.mozTransitionDuration = "0.0s";
        mainInfo.style.oTransitionDuration = "0.0s";
        mainInfo.style.msTransitionDuration = "0.0s";
        console.log("swipe down");
        toggleInformation();
        setTimeout(function() {
          mainInfo.style.transitionDuration = "0.25s";
          mainInfo.style.mozTransitionDuration = "0.25s";
          mainInfo.style.oTransitionDuration = "0.25s";
          mainInfo.style.msTransitionDuration = "0.25s";
        }, 250);

      } else {
        console.log("reset");
      }
    }

  } else if (mainInfo.isEqualNode(this)) {
    mainInfo.style.top = "-100%";
    if (touchSpeedY < -1.0 || touchMoveY < -mainInfo.clientHeight / 2) {
      console.log("swipe up");
      mainInfo.style.transitionDuration = "0.0s";
      mainInfo.style.mozTransitionDuration = "0.0s";
      mainInfo.style.oTransitionDuration = "0.0s";
      mainInfo.style.msTransitionDuration = "0.0s";
    toggleInformation();
      setTimeout(function() {
          mainInfo.style.transitionDuration = "0.25s";
          mainInfo.style.mozTransitionDuration = "0.25s";
          mainInfo.style.oTransitionDuration = "0.25s";
          mainInfo.style.msTransitionDuration = "0.25s";
      }, 250);

    } else {
      console.log("reset");
    }

  } else {
    console.log("wrong element", this);
  }
}


function addListeners() {
  if (!hasOnscreenKeyboard) {
    elementMessage.addEventListener("keypress", onKey, false);
    elementMessage.addEventListener("keydown", onKey, false);
  }
  
  startHeightListener(scrollDown);

  mainInfo.addEventListener("touchstart", touchStart, false);
  mainInfo.addEventListener("touchmove", touchMove, false);
  mainInfo.addEventListener("touchend", touchEnd, false);

  header.addEventListener("touchstart", touchStart, false);
  header.addEventListener("touchmove", touchMove, false);
  header.addEventListener("touchend", touchEnd, false);

  mainContainer.addEventListener("scroll", checkScrolledDown);
  elementMessage.addEventListener("input", onInput, false);
  
  sendButton.addEventListener("click", onClick);
  printButton.addEventListener("click", printDialog);
  
  avatar.addEventListener("click", function(event){
    if (showsInformation) {
      toggleInformation();
    }
    autoScroll = true;
    scrollDown();   
  });

  headertext.addEventListener("click", function(event){
    toggleInformation();
  });

  /*
  elementMessage.addEventListener("focus", function() {
    setTimeout(function() {
      scrollDown();
    }, 1000);
  });
  */

};

function animateDots() {
  setTimeout(function() {
    elementDots.textContent += ".";
    if (elementDots.textContent.length >= 4) {
      elementDots.textContent = ".";
    }
    animateDots();
  }, 500);
}

function scrollDown() {
  if (autoScroll) {
    mainContainer.scrollTop = mainContainer.scrollHeight;
    mainContainer.scrollTo(0, mainContainer.scrollHeight);
  }
}

function berganzaTypes(isTyping) {
  if (isTyping) {
    elementIndicator.hidden = false;
    scrollDown();
  } else {
    elementIndicator.hidden = true;
  }

}

function isQuestion(text) {
  return text.slice(0).toLowerCase() === "w" || text.slice(-1) === "?";
}

function addToHistory(author, message) {
  const elementMessage = document.createElement("div");
  elementMessage.className = "message " + author;
  messageContainer.appendChild(elementMessage);

  const elementText = document.createElement("span");
  elementText.className = "text";
  elementText.innerHTML = message.replace(/(?:\r\n|\r|\n)/g, '<br>');
  elementMessage.appendChild(elementText);

  const elementInfo = document.createElement("div");
  elementInfo.className = "info";
  elementMessage.appendChild(elementInfo);

  const elementTime = document.createElement("span");
  elementTime.className = "time";
  elementTime.textContent = new Date().toLocaleTimeString();
  elementInfo.appendChild(elementTime);
  
  scrollDown();

  if (author !== "me") {
    indicateNewMessage(true);
    audio.play();
    if (canVibrate) {
      navigator.vibrate([500]);
    }
  }

  return elementMessage;
}

function indicateNewMessage(indicate) {
  if (!indicate) {
    newMessage.hidden = true;

  } else if (!autoScroll || showsInformation) {
    newMessage.hidden = false;
  }
}

function printDialog(){
  window.print();
}

function getHistory(lastN) {
  var messages = [];
  var prompt = "";

  for (const eachChild of messageContainer.children) {
    // todo: maybe adapt subprompts to isQuestion?
    if (eachChild.classList.contains("me")) {
      // if all caps: "Ich brülle"
      prompt = "\n##Ich sage:## ";

    } else if (eachChild.classList.contains("berganza")) {
      prompt = "\n##Der Hund Berganza sagt:## ";

    } else {
      console.log("unknown class");
      continue;
    }

    for (const everyChild of eachChild.children) {
      if (everyChild.classList.contains("text")) {
        messages.push(prompt + everyChild.textContent.trim());
        break;
      }
    }
  }
  var text = messages.join("");
  return text.substring(Math.max(text.length - lastN, 0), text.length);
}

async function requestReply() {
  /* todo: refactor! */
  var prompt = getHistory(1000);

  if (isQuestion(prompt)){
    prompt += "\n##Der Hund Berganza antwortet:## ";
  
  } else {
    prompt += "\n##Der Hund Berganza fragt:## ";
  }

  console.log("[prompt]" + prompt);

  var response;
  try {
    response = await fetch("http://localhost:8000/ask/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: prompt
      })
    });

  } catch (error) {
    berganzaTypes(false);
    addToHistory("berganza", "Uhhm... häh?");
    console.log(error);
    console.log(error.message)
    return;
  }

  if (response.status === 429) {
    berganzaTypes(false);
    addToHistory("berganza", "Ich muss Dir leider sagen, dass ich der Konversation müde geworden bin. Aber ich denke, in einem Tage werde ich mich wieder erholt haben.");
    return;
  }

  const data = await response.json();
  if (data.reply === undefined) {
    berganzaTypes(false);
    addToHistory("berganza", "Das habe ich nicht richtig verstehen können.");
    console.log(response);
    return;
  }
  const answer = data.reply.trim();
  // todo: after backend update: get data.info.trim() for console.log() backend exceptions
  // todo: receive remaining questions and display somewhere

  console.log("[completion]", answer);

  if (answer.slice(-1) === ":") {
    berganzaTypes(false);
    addToHistory("berganza", answer.slice(0, -1) + ".");
    
  } else {
    berganzaTypes(false);
    addToHistory("berganza", answer);
  }
}

async function sendMessage(message) {
  addToHistory("me", message);

  if (block) {
    console.log("Berganza is not done typing! Wait!");
    return;
  }

  block = true;
  if (message.length < 5) {
    setTimeout(async function() {
      berganzaTypes(true);
      setTimeout(async function() {
        berganzaTypes(false);
        addToHistory("berganza", "Bist Du wohl auf den Mund gefallen?");
        block = false;
      }, Math.random() * 1000 + 2000);
    }, Math.random() * 1000 + 2000);

  } else if (debug) {
    setTimeout(async function() {
      berganzaTypes(true);
      setTimeout(async function() {
        berganzaTypes(false);
        addToHistory("berganza", "Ich bin eigentlich gar kein Hund, sondern eine künstliche Intelligenz. Aber erzähl's keinem...");
        block = false;
      }, Math.random() * 1000 + 2000);
    }, Math.random() * 1000 + 2000);

  } else {  
    setTimeout(async function() {
      berganzaTypes(true);
      await requestReply();
      block = false;
    }, Math.random() * 1000 + 2000);
  }
}


function main() {
  if (location.hostname.length < 1) {
    onlineStatus.innerHTML = "local";
  } else if (location.hostname === "berganza.live") {
    onlineStatus.innerHTML = "live";
  } else {
    onlineStatus.innerHTML = location.hostname;
  } 

  if (hasOnscreenKeyboard) {
    elementMessage.enterKeyHint = "enter";
  } else {
    elementMessage.enterKeyHint = "send";
  }

  addListeners();
  animateDots();

  if (debug) {
    /*
    es gibt zwei arten von menschen. die einen wollen hauptsächlich ihre annahme bewiesen sehen, dass alles nur eine illusion sei. die anderen geben sich der situation hin, und suchen nach erfahrungen, die sie anders vermutlich nie hätten machen können. wozu denkst du gehörst du?
    */

    
    addToHistory("me", "verstehe! sag mal, was ist eigentlich dein lieblingsessen?");
    berganzaTypes(true);

    setTimeout(async function() {
      addToHistory("berganza", "Mein lieblingsessen? – O bester Freund! ich kann Dir nicht sagen, wie herzlich mich der Gedanke an eine Bratwurst mit Senf und Salz erfreut.");
      berganzaTypes(false);
  
      setTimeout(async function() {
        addToHistory("me", "eine coburger bratwurst?");
        berganzaTypes(true);
  
        setTimeout(async function() {
          addToHistory("berganza", "Eine coburger Bratwurst!  – O Freund! wie Du sprichst, und dabei so ganz ohne alle Begeisterung. Wenn die Coburgerinnen nur einmal den Mund auftun könnten, um zu sagen: Eine Bratwurst; da würde der Himmel sich öffnen, und tausend Seraphinen schreien: Lobet den Herrn in seinem Heiligthum.");
          berganzaTypes(false);
      
        }, Math.random() * 1000 + 2000);
      }, Math.random() * 1000 + 2000);
    }, Math.random() * 1000 + 2000);

    //berganzaTypes(false);
    block = false;
    elementMessage.disabled = false;
    sendButton.disabled = false;

  } else {
    setTimeout(async function() {
      berganzaTypes(true);
      setTimeout(async function() {
        berganzaTypes(false);
        addToHistory("berganza", "So wisse denn, daß ich jener Hund Berganza bin, der vor länger als hundert Jahren in Valladolid im Hospital zur Auferstehung das Licht der Welt erblickt hat. Welchen Schwank aus meinem Leben bekämst Du gerne zu hören?");
        block = false;
        elementMessage.disabled = false;
        sendButton.disabled = false;
      }, Math.random() * 3000 + 5000);
    }, Math.random() * 1000 + 2000);
  }
}

main();

/*
refactor js
use localstorage for message history
modify backend: return exchanges left, display somewhere small
*/