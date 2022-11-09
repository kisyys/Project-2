window.onload = () =>{
    getDate();
    getTheatre();
}

getDate = () => {
    // Create AJAX object
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType('application/xml');

    // Specify the data / url to be fetched
    let URL2 = "https://www.finnkino.fi/xml/ScheduleDates/";
    xmlhttp.open("GET", URL2, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // find myDiv and insert results there
            document.getElementById("date_list").innerHTML = "";
            let date_selection = document.getElementById("date_list");
            for (let i = 0; i < xmlhttp.responseXML.getElementsByTagName("dateTime").length; i++) {
                let YearMonthDay = xmlhttp.responseXML.getElementsByTagName("dateTime")[i].innerHTML.split("T");
                let YearMonthDaySplit = YearMonthDay[0].split("-");
                let opt = document.createElement('option');
                opt.innerHTML = YearMonthDaySplit[2] + "." + YearMonthDaySplit[1] + "." + YearMonthDaySplit[0];
                opt.value = YearMonthDaySplit[2] + "." + YearMonthDaySplit[1] + "." + YearMonthDaySplit[0];
                date_selection.appendChild(opt);
            }
        }
    }  
}

getTheatre = () => {
    // Create AJAX object
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType('application/xml');

    // Specify the data / url to be fetched
    let URL2 = "https://www.finnkino.fi/xml/TheatreAreas/";
    xmlhttp.open("GET", URL2, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // find myDiv and insert results there
            document.getElementById("theater_list").innerHTML = "";
            let theatre_selection = document.getElementById("theater_list");
            for (let i = 0; i < xmlhttp.responseXML.getElementsByTagName("TheatreArea").length; i++) {
                let opt = document.createElement('option');
                opt.innerHTML = xmlhttp.responseXML.getElementsByTagName("Name")[i].innerHTML;
                opt.value = xmlhttp.responseXML.getElementsByTagName("ID")[i].innerHTML;
                theatre_selection.appendChild(opt);
            }
        }
    }
}

getData = () => {
    let theatre = document.getElementById("theater_list").value;
    let date = document.getElementById("date_list").value;
    console.log(theatre);
    // Create AJAX object
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType('application/xml');

    // Specify the data / url to be fetched
    let URL2 = "https://www.finnkino.fi/xml/Schedule/?area=" + theatre + "&dt=" + date;
    xmlhttp.open("GET", URL2, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // find myDiv and insert results there
            document.getElementById("movie_data").innerHTML = "";

            for (let i = 0; i < xmlhttp.responseXML.getElementsByTagName("Show").length; i++) {
                let title = xmlhttp.responseXML.getElementsByTagName("Title")[i].innerHTML;
                let pic = xmlhttp.responseXML.getElementsByTagName("EventSmallImagePortrait")[i].innerHTML;
                let start = xmlhttp.responseXML.getElementsByTagName("dttmShowStart")[i].innerHTML.split("T");
                let YearMonthDaySplit = start[0].split("-");
                let place = xmlhttp.responseXML.getElementsByTagName("TheatreAndAuditorium")[i].innerHTML;

                document.getElementById("movie_data").innerHTML +=`<div class="movie"> <b>` + title + "</b> <br>" + place + "<br> <img src=" + pic +" alt=''> " + YearMonthDaySplit[2] + "." + YearMonthDaySplit[1] + "." + YearMonthDaySplit[0] + " "+start[1].slice(0, -3); + " </div> <br>";
            }
        }
    }
}


