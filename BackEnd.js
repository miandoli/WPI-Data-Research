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

function strTime() {
    return new Date().toLocaleString();
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

var myVid;
function evListener(id) {
    myVid = document.getElementById(id);
    myVid.addEventListener("ended", endEvent, false);
}

function endEvent(e) {
    var index = localStorage.getItem("vidIndex");
    localStorage.setItem("end" + index, strTime());

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
    localStorage.setItem("start" + index, strTime());
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
    localStorage.setItem("quiz" + index, strTime());

    if (nxtPage) {
        nxtPage();
    }
}

function vid1() {
    randomize();
    var name = document.getElementById("txtName").value;
    if (name != "") {
        localStorage.setItem("name", name);
        localStorage.setItem("start", strTime());
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
    var txt = "Survey " + index + "\r\n";

    var part = ["bod", "head", "hands", "feet"];
    var type = ["temp", "comf", "acc"];

    for (var i = 0; i < part.length; i++) {
        for (var j = 0; j < type.length; j++) {
            var curr = document.getElementById(type[j] + "_" + part[i]).value;
            txt += "\t" + type[j] + "_" + part[i] + ": " + curr + "\r\n";
        }
    }

    var prefer = multChoice("prefer", 3);
    var airStuff = document.getElementById("air_stuff").value;
    var odor = multChoice("odor", 6);
    var airQual = document.getElementById("air_qual").value;
    var eyes = multChoice("eyes", 6);
    var nose = multChoice("nose", 6);
    var throat = multChoice("throat", 6);
    txt += "\tprefer: " + prefer + "\r\n\tair_stuff: " + airStuff + "\r\n\todor: " + odor + "\r\n\tair_qual: " + airQual + "\r\n\teyes: " + eyes + "\r\n\tnose: " + nose + "\r\n\tthroat: " + throat + "\r\n";

    var categ = ["acous", "light", "alert", "concen", "produc"];
    for (var i = 0; i < categ.length; i++) {
        var curr = document.getElementById(categ[i]).value;
        txt += "\t" + categ[i] + ": " + curr + "\r\n";
    }

    localStorage.setItem("survey" + index, txt);
    localStorage.setItem("surveyTime" + index, strTime());

    if (localStorage.getItem("vidIndex") <= 3) {
        window.location = "Timer.html";
    } else {
        saveAll(3);
    }
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

    data += "Start time: " + localStorage.getItem("start") + "\r\n";

    var vid1 = localStorage.getItem("vid1");
    var vid2 = localStorage.getItem("vid2");
    var vid3 = localStorage.getItem("vid3");
    data += "Video order: " + vid1 + ", " + vid2 + ", " + vid3 + "\r\n\r\n";

    for (var i = 1; i <= num; i++) {
        var start = localStorage.getItem("start" + i);
        data += "Video " + i + " start: " + start + "\r\n";
        var end = localStorage.getItem("end" + i);
        data += "Video " + i + " end: " + end + "\r\n";

        var len = localStorage.getItem("numQ" + i);
        for (var j = 1; j <= len; j++) {
            var snippet = localStorage.getItem("" + i + "_" + j);
            data += "\t" + i + "_" + j + ": " + snippet + "\r\n";
        }
        var quizTime = localStorage.getItem("quiz" + i);
        data += "Quiz " + i + " finish time: " + quizTime + "\r\n";

        var txt = localStorage.getItem("survey" + i);
        data += txt;
        var surveyTime = localStorage.getItem("surveyTime" + i);
        data += "Survey " + i + " finish time: " + surveyTime + "\r\n\r\n";
    }

    data += "Finish time: " + strTime();

    download(data, fileName);
}
