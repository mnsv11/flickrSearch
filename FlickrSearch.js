(function () {
    'use strict';
    var searchText = "";
    var url = "";
    var i;
    var viewGallery = false;
    var searchText = document.getElementById("searchText");

    //content that going to contain all pictures
    var content = document.getElementById("content");

    //search button
    var searchButton = document.getElementById("searchButton");
    searchButton.addEventListener('click', function () {
        getSearchText();
    });
    
    //key event for textbox
    searchText.onkeypress = function(evt) {
        //if enter
        if(evt.keyCode === 13){
            getSearchText();
        }
    };

    //filter button to view gallery of choosed pictures
    var filterButton = document.getElementById("filterButton");
    filterButton.addEventListener('click', function () {
        if (viewGallery === false) {
            var childNodes = content.childNodes;
            var choosedPics = [];
            viewGallery = true;

            //get all chosed picture and add them to an array
            for (i = 0; i < childNodes.length; i++) {
                if (childNodes[i].style.borderColor !== "") {
                    choosedPics.push(childNodes[i]);
                }
            }

            //clear content
            while (content.firstChild) {
                content.removeChild(content.firstChild);
            }

            //add chosed picture to content
            for (i = 0; i < choosedPics.length; i++) {
                {
                    choosedPics[i].style.borderColor = "";
                    choosedPics[i].style.borderWidth = "0";
                    content.appendChild(choosedPics[i]);
                }
            }
        }
    });
    
    /**
     * Set url and if textbox not empty it calls for function to get photos
     * 
     */
    function getSearchText(){
        viewGallery = false;      
        if(searchText !== ""){
            url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3193d22533c7234cc79736cff4d688e5&text=" + searchText.value + "&format=json&nojsoncallback=1";
            getPhotos();
        }
    }

    /**
     * get all picture information in a json file
     * 
     */
    function getPhotos() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var pictureArray = JSON.parse(xmlhttp.responseText);
                print(pictureArray.photos.photo);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
    

    /**
     * Add all pictures with eventhandler to content.
     * 
     * @param {string} arr contain information about pictures
     */
    function print(arr) {
        content.innerHTML = "";

        //add all picture with for loop
        for (i = 0; i < arr.length; i++) {

            //create new div that contain a picture
            var div = document.createElement('div');
            div.className = "pictureFrame";
            div.id = "picture" + i;

            //add pictrue adress to picture on flickr
            div.innerHTML = '<img id="image' + i + '" class="images" src="https://farm' + arr[i].farm + '.staticflickr.com/' + arr[i].server + '/' + arr[i].id + '_' + arr[i].secret + '.jpg" alt="' + arr[i].title + '">';

            //add eventlistener to picture 
            div.addEventListener('click', function (value) {

                //check if choosed picture is viewed in gallery
                if (viewGallery === false) {
                    //change color on frame around picture when click on it
                    if (value.target.parentNode.style.borderColor === "") {
                        value.target.parentNode.style.borderColor = "#fb0404";
                    } else {
                        value.target.parentNode.style.borderColor = "";
                    }
                } else {

                    //set transition when picture change size
                    value.target.style.transition = "width 1s, height 2s";

                    //resize picture
                    if (value.target.style.width !== "100%") {
                        value.target.parentNode.style.width = "40%";
                        value.target.parentNode.style.height = "40%";
                        value.target.style.width = "100%";
                        value.target.style.height = "100%";
                    } else {
                        value.target.style.width = "";
                        value.target.style.height = "";
                        value.target.parentNode.style.width = "10vw";
                        value.target.parentNode.style.height = "6vw";

                    }
                }

            });

            //add picture to content
            content.appendChild(div);
        }
    }
}());

