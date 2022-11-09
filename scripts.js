window.onload = () => {
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
    document.getElementById("movie_data1").innerHTML = "";
    document.getElementById("movie_data2").innerHTML = "";
    document.getElementById("movie_data3").innerHTML = "";
    let theatre = document.getElementById("theater_list").value;
    let date = document.getElementById("date_list").value;
    console.log(theatre);
    // Create AJAX objects
    let xmlhttp1 = new XMLHttpRequest();
    xmlhttp1.overrideMimeType('application/xml');
    let xmlhttp2 = new XMLHttpRequest();
    xmlhttp2.overrideMimeType('application/xml');

    // Specify the data / url to be fetched
    let URL2 = "https://www.finnkino.fi/xml/Schedule/?area=" + theatre + "&dt=" + date;
    xmlhttp1.open("GET", URL2, true);
    xmlhttp1.send();

    let URL3 = "https://www.finnkino.fi/xml/Events/";
    xmlhttp2.open("GET", URL3, true);
    xmlhttp2.send();

    xmlhttp1.onreadystatechange, xmlhttp2.onreadystatechange = function () {
        if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200 && xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
            // find myDiv and insert results there
            
            for (let i = 0; i < xmlhttp1.responseXML.getElementsByTagName("Show").length; i++) {
                let ID = xmlhttp1.responseXML.getElementsByTagName("EventID")[i].innerHTML;
                let title = xmlhttp1.responseXML.getElementsByTagName("Title")[i].innerHTML;
                let pic = xmlhttp1.responseXML.getElementsByTagName("EventSmallImagePortrait")[i].innerHTML;
                let start = xmlhttp1.responseXML.getElementsByTagName("dttmShowStart")[i].innerHTML.split("T");
                let YearMonthDaySplit = start[0].split("-");
                let place = xmlhttp1.responseXML.getElementsByTagName("TheatreAndAuditorium")[i].innerHTML;

                document.getElementById("movie_data1").innerHTML += `<div class="movie"> <b>` + title + "</b> <br>" + place + "<br>" + YearMonthDaySplit[2] + "." + YearMonthDaySplit[1] + "." + YearMonthDaySplit[0] + " " + start[1].slice(0, -3) + " </div>";
                
                document.getElementById("movie_data2").innerHTML += `<div class="movie"> <img src=` + pic + " alt=''> </div>";

                for (let i = 0; i < xmlhttp2.responseXML.getElementsByTagName("ID").length; i++) {
                    if(parseInt(xmlhttp2.responseXML.getElementsByTagName("ID")[i].innerHTML)===parseInt(ID)) {
                        document.getElementById("movie_data3").innerHTML += `<div class="movie">` + xmlhttp2.responseXML.getElementsByTagName("ShortSynopsis")[i].innerHTML + "</div>";
                    }
                }
                // ==> Create array list   
            }
        }
    }
}