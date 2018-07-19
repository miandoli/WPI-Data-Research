function randomize() {
    var lst = ["Ariely_Video.html", "Pinker_Video.html", "Krznaric_Video.html"];
    var rnd1 = Math.floor(Math.random() * 3);
    [lst[rnd1], lst[2]] = [lst[2], lst[rnd1]];
    var rnd2 = Math.floor(Math.random() * 2);
    [lst[rnd2], lst[1]] = [lst[1], lst[rnd2]];
    localStorage.setItem("vid1", lst[0]);
    localStorage.setItem("vid2", lst[1]);
    localStorage.setItem("vid3", lst[2]);
    localStorage.setItem("vidIndex", 1);
}

var myVid;
function evListener(id) {
    myVid = document.getElementById(id);
    myVid.addEventListener("ended", endEvent, false);
}

function endEvent(e) {
    var index = localStorage.getItem("vidIndex");
    var start = localStorage.getItem("start");
    var time = Date.now() / 1000;
    localStorage.setItem("end" + index, time - start);

    if (e.target.id == "ariely") {
        window.location = "Ariely_Questions.html";
    } else if (e.target.id == "pinker") {
        window.location = "Pinker_Questions.html";
    } else if (e.target.id == "krznaric") {
        window.location = "Krznaric_Questions.html";
    }
}

function startVideo() {
    myVid.play();
    var sound = new Audio("Resources\\ding.mp3");
    sound.play();
    var elem = document.getElementById("btnStart");
    elem.parentNode.removeChild(elem);
    document.getElementById("lblDescr").innerHTML = "";

    var index = localStorage.getItem("vidIndex");
    var start = localStorage.getItem("start");
    var time = Date.now() / 1000;
    localStorage.setItem("start" + index, time - start);
}

function saveQ(numQuestions, nxtPage = 0) {
    var index = localStorage.getItem("vidIndex");
    localStorage.setItem("numQ" + index, numQuestions);
    for (var i = 1; i <= numQuestions; i++) {
        var name = "" + index + "_" + i;
        var elName = "q" + i;
        var value = multChoice(elName, 4);
        localStorage.setItem(name, value);
    }

    var start = localStorage.getItem("start");
    var time = Date.now() / 1000;
    localStorage.setItem("quiz" + index, time - start);

    if (nxtPage) {
        nxtPage();
    }
}

function vid1() {
    randomize();
    var name = document.getElementById("txtName").value;
    if (name != "") {
        localStorage.setItem("name", name);
        var time = Date.now() / 1000;
        localStorage.setItem("start", time);
        window.location = localStorage.getItem("vid1");
    } else {
        window.alert("Please enter a name!");
    }
}

function setTimer() {
    const length = 0.05; // Time for break (minutes)
    var time = length * 60;
    var x = setInterval(function() {
        if (time == 0) {
            var nxtVid = "vid" + localStorage.getItem("vidIndex");
            window.location = localStorage.getItem(nxtVid);
        }
        var minutes = Math.floor(time / 60);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        var seconds = Math.floor(time % 60);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var clock = "" + minutes + ":" + seconds;
        document.getElementById("timer").innerHTML = clock;
        time += -1;
    }, 1000);
}

function quizTimer() {
    const length = 0.2; // Time for quiz (minutes)
    var time = length * 60;
    var x = setInterval(function() {
        if (time == 0) {
            saveQ(6, comfQ);
        }
        time += -1;
    }, 1000);
}

function comfQ() {
    var index = localStorage.getItem("vidIndex");
    index++;
    localStorage.setItem("vidIndex", index);
    window.location = "Comfort_Questions.html";
}

function determineNxt() {
    var index = localStorage.getItem("vidIndex") - 1;
    var temp = document.getElementById("temp").value;
    var comf = document.getElementById("comf").value;
    var txt = "Survey " + index + "(Temp: " + temp + ", Comf: " + comf + ")";
    localStorage.setItem("survey" + index, txt);

    var start = localStorage.getItem("start");
    var time = Date.now() / 1000;
    localStorage.setItem("surveyTime" + index, time - start);

    if (localStorage.getItem("vidIndex") <= 3) {
        window.location = "Timer.html";
    } else {
        saveAll(3);
    }
}

function multChoice(name, num) {
    var value = "no answer";
    for (var i = 1; i <= num; i++) {
        var el = document.getElementById(name + "_" + i);
        if (el.checked) {
            value = i;
        }
    }
    return value;
}

function download(data, fileName) {
    var file = new Blob([data]);
    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, fileName);
    else {
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function saveAll(num) {
    var name = localStorage.getItem("name");
    var fileName = name + ".txt";
    var data = "";

    var vid1 = localStorage.getItem("vid1");
    var vid2 = localStorage.getItem("vid2");
    var vid3 = localStorage.getItem("vid3");
    data += "Video order: " + vid1 + ", " + vid2 + ", " + vid3 + "\r\n";

    for (var i = 1; i <= num; i++) {
        var start = parseFloat(localStorage.getItem("start" + i));
        data += "Video start: " + start.toFixed(2) + "s\r\n";
        var end = parseFloat(localStorage.getItem("end" + i));
        data += "Video end: " + end.toFixed(2) + "s\r\n";

        var len = localStorage.getItem("numQ" + i);
        for (var j = 1; j <= len; j++) {
            var snippet = localStorage.getItem("" + i + "_" + j);
            data += "" + i + "_" + j + ": " + snippet + "\r\n";
        }
        var quizTime = parseFloat(localStorage.getItem("quiz" + i));
        data += "Quiz " + i + " finish time: " + quizTime.toFixed(2) + "s\r\n";

        var txt = localStorage.getItem("survey" + i);
        data += txt + "\r\n";
        var surveyTime = parseFloat(localStorage.getItem("surveyTime" + i));
        data += "Survey " + i + " finish time: " + surveyTime.toFixed(2) + "s\r\n";
    }

    var total = (Date.now() / 1000) - localStorage.getItem("start");
    data += "Total time: " + total.toFixed(2) + "s";

    download(data, fileName);
}
