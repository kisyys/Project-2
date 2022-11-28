window.onload = () => {
    getDate();
    getTheatre();
    getSynopsis();
}

// Local Storages
if (!localStorage.getItem("synopsislist")) {
    var synopsis_list = [];
}
else {
    var synopsis_list = JSON.parse(localStorage.getItem("synopsislist"));
}

searchMovie = () => {
    var input = document.getElementById("search_list");
    var filter = input.value.toUpperCase();
    var mov1 = document.getElementsByClassName('movie1');
    var mov2 = document.getElementsByClassName('movie2');
    var mov3 = document.getElementsByClassName('movie3');
    var title_search = document.getElementsByClassName('b1');

    for (i = 0; i < title_search.length; i++) {
        var txtValue = title_search[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            mov1[i].style.display = "";
            mov2[i].style.display = "";
            mov3[i].style.display = "";
        } else {
            mov1[i].style.display = "none";
            mov2[i].style.display = "none";
            mov3[i].style.display = "none";
        }
    }
}

getDate = () => {
    // Create AJAX object
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType('application/xml');

    // Specify the data / url to be fetched
    var URL2 = "https://www.finnkino.fi/xml/ScheduleDates/";
    xmlhttp.open("GET", URL2, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // find myDiv and insert results there
            document.getElementById("date_list").innerHTML = "";
            var date_selection = document.getElementById("date_list");
            for (var i = 0; i < xmlhttp.responseXML.getElementsByTagName("dateTime").length; i++) {
                var YearMonthDay = xmlhttp.responseXML.getElementsByTagName("dateTime")[i].innerHTML.split("T");
                var YearMonthDaySplit = YearMonthDay[0].split("-");
                var opt = document.createElement('option');
                opt.innerHTML = YearMonthDaySplit[2] + "." + YearMonthDaySplit[1] + "." + YearMonthDaySplit[0];
                opt.value = YearMonthDaySplit[2] + "." + YearMonthDaySplit[1] + "." + YearMonthDaySplit[0];
                date_selection.appendChild(opt);
            }
        }
    }
}

getTheatre = () => {
    // Create AJAX object
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType('application/xml');

    // Specify the data / url to be fetched
    var URL2 = "https://www.finnkino.fi/xml/TheatreAreas/";
    xmlhttp.open("GET", URL2, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // find myDiv and insert results there
            document.getElementById("theatre_list").innerHTML = "";
            var theatre_selection = document.getElementById("theatre_list");
            for (var i = 0; i < xmlhttp.responseXML.getElementsByTagName("TheatreArea").length; i++) {
                var opt = document.createElement('option');
                opt.innerHTML = xmlhttp.responseXML.getElementsByTagName("Name")[i].innerHTML;
                opt.value = xmlhttp.responseXML.getElementsByTagName("ID")[i].innerHTML;
                theatre_selection.appendChild(opt);
            }
        }
    }
}

getSynopsis = () => {
    // Create AJAX objects
    var xmlhttp2 = new XMLHttpRequest();
    xmlhttp2.overrideMimeType('application/xml');

    // Specify the data / url to be fetched
    var URL2 = "https://www.finnkino.fi/xml/Events/";
    xmlhttp2.open("GET", URL2, true);
    xmlhttp2.send();

    xmlhttp2.onreadystatechange = function () {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
            for (var i = 0; i < xmlhttp2.responseXML.getElementsByTagName("ID").length; i++) {
                synopsis_list.push(xmlhttp2.responseXML.getElementsByTagName("ID")[i].innerHTML);
                synopsis_list.push(xmlhttp2.responseXML.getElementsByTagName("ShortSynopsis")[i].innerHTML);
            }
            valueCallBack(synopsis_list);
        }
    }
}

function valueCallBack(value) {
    localStorage.setItem("synopsislist", JSON.stringify(value));
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

getData = () => {
    document.getElementById("movie_data1").innerHTML = "";
    document.getElementById("movie_data2").innerHTML = "";
    document.getElementById("movie_data3").innerHTML = "";
    var theatre = document.getElementById("theatre_list").value;
    var date = document.getElementById("date_list").value;

    // Create AJAX objects
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType('application/xml');

    // Specify the data / url to be fetched
    var URL2 = "https://www.finnkino.fi/xml/Schedule/?area=" + theatre + "&dt=" + date;
    xmlhttp.open("GET", URL2, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // find myDiv and insert results there

            for (var i = 0; i < xmlhttp.responseXML.getElementsByTagName("Show").length; i++) {
                var ID = xmlhttp.responseXML.getElementsByTagName("EventID")[i].innerHTML;
                var title = xmlhttp.responseXML.getElementsByTagName("Title")[i].innerHTML;
                var pic = xmlhttp.responseXML.getElementsByTagName("EventSmallImagePortrait")[i].innerHTML;
                var start = xmlhttp.responseXML.getElementsByTagName("dttmShowStart")[i].innerHTML.split("T");
                var end = xmlhttp.responseXML.getElementsByTagName("dttmShowEnd")[i].innerHTML.split("T");
                var YearMonthDaySplit = start[0].split("-");
                var place = xmlhttp.responseXML.getElementsByTagName("TheatreAndAuditorium")[i].innerHTML;
                var ticket = xmlhttp.responseXML.getElementsByTagName("ShowURL")[i].innerHTML.split(":");

                document.getElementById("movie_data1").innerHTML += `<div class="movie1"> <b class="b1">` + title + "</b> <br>" + place + "<br>" + YearMonthDaySplit[2] + "." + YearMonthDaySplit[1] + "." + YearMonthDaySplit[0] + " " + start[1].slice(0, -3) + ` <br> Ends around: ` + end[1].slice(0, -3) + `<br> <br> <form action="https:` + ticket[1] + `"> <input type="submit" value="Buy / Reserve ticket" /> </form> </div>`;

                document.getElementById("movie_data2").innerHTML += `<div class="movie2"> <img class="pic" src=` + pic + " alt=''> </div>";

                var synopsis_list_unique = JSON.parse(localStorage.getItem("synopsislist")).filter(onlyUnique);

                for (let i = 0; i < synopsis_list_unique.length; i++) {
                    if (parseInt(synopsis_list_unique[i]) == parseInt(ID)) {
                        document.getElementById("movie_data3").innerHTML += `<div class="movie3">` + synopsis_list_unique[i + 1] + "</div>";
                    }
                }
            }
        }
    }
}