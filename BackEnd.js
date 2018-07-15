var myVid;
function evListener(id) {
    myVid = document.getElementById(id);
    myVid.addEventListener("ended", endEvent, false);
}

function endEvent(e) {
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
}

function saveQ(index, numQuestions, nxtPage = 0) {
    localStorage.setItem("numQ" + index, numQuestions);
    for (var i = 1; i <= numQuestions; i++) {
        var name = "" + index + "_" + i;
        var elName = "q" + i;
        var value = multChoice(elName, 4);
        localStorage.setItem(name, value);
    }
    if (nxtPage) {
        nxtPage();
    }
}

function vid1() {
    var name = document.getElementById("txtName").value;
    if (name != "") {
        localStorage.setItem("name", name);
        var time = Date.now() / 1000;
        localStorage.setItem("start", time);
        window.location = "Ariely_Video.html";
    } else {
        window.alert("Please enter a name!");
    }
}

function vid2() {
    window.location = "Pinker_Video.html";
}

function vid3() {
    window.location = "Krznaric_Video.html";
}

function endQ() {
    window.location = "Questions_End.html";
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
    for (var i = 1; i <= num; i++) {
        var len = localStorage.getItem("numQ" + i);
        for (var j = 1; j <= len; j++) {
            var snippet = localStorage.getItem("" + i + "_" + j);
            data += "" + i + "_" + j + ": " + snippet + "\r\n";
        }
    }

    var comf = multChoice("comf", 4);
    data += "Comfort level: " + comf + "\r\n";

    var total = (Date.now() / 1000) - localStorage.getItem("start");
    data += "Total time: " + total.toFixed(2);

    download(data, fileName);
}
