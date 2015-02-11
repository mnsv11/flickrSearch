(function () {
    'use strict';
    var searchText = "";
    var url = "";
    var i;
    var button = document.getElementById("searchButton");
    button.addEventListener('click', function () {
        console.log("test");
        searchText = document.getElementById("searchText").value;
        console.log(searchText);
        url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=cdf8b4abca85ccae97559f5c0492a2bb&text=" + searchText + "&format=json&nojsoncallback=1";
        test();
    });

    function test() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var myArr = JSON.parse(xmlhttp.responseText);
                print(myArr.photos.photo);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    function print(arr) {
        var content = document.getElementById("content");
        content.innerHTML = "";
        for (i = 0; i < arr.length; i++) {
            var div = document.createElement('div');
            div.className = "pictureFrame";
            div.id = "picture" + i;
            div.innerHTML = '<img class="images" src="https://farm' + arr[i].farm + '.staticflickr.com/' + arr[i].server + '/' + arr[i].id + '_' + arr[i].secret + '_m.jpg" alt="' + arr[i].title + '">';
            div.addEventListener('click', function (value) {
                if (value.path[1].style.borderColor !== "red") {
                    value.path[1].style.borderColor = "red";
                }else{
                    value.path[1].style.borderColor = "";
                }
                    
            });
            content.appendChild(div);
        }
    }
    
    //TODO visa endast valda bilder i ett galleri
    //     klicka på bild så förstoras den
}());

