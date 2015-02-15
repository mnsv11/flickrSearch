(function () {
    'use strict';
    var searchText = "";
    var url = "";
    var i;
    var j;
    var viewGallery = false;
    var page = 1;
    var nrOfPages = 0;
    var choosedPics = [];
    var searchText = document.getElementById("searchText");
    var pageText = document.getElementById("pageNr");
    var src = "";

    //content that going to contain all pictures
    var content = document.getElementById("content");

    //search button
    var searchButton = document.getElementById("searchButton");
    searchButton.addEventListener('click', function () {
        choosedPics = [];
        backButton.disabled = false;
        forwadButton.disabled = false;
        firstPage.disabled = false;
        lastPage.disabled = false;
        page = 1;
        viewGallery = false;
        getSearchText();
        
    });

    //navigate to previous page
    var backButton = document.getElementById("backButton");
    backButton.addEventListener('click', function () {
        if (page > 1) {
            page = page - 1;
        }
        getSearchText();
    });

    //navigate to first page
    var firstPage = document.getElementById("firstPage");
    firstPage.addEventListener('click', function () {
        if (page > 1) {
            page = 1;
        }
        getSearchText();
    });

    //navigate to last page
    var lastPage = document.getElementById("lastPage");
    lastPage.addEventListener('click', function () {
        if (nrOfPages !== 0 && page < nrOfPages) {
            page = nrOfPages;
        }
        getSearchText();
    });

    //navigate to next page
    var forwadButton = document.getElementById("forwadButton");
    forwadButton.addEventListener('click', function () {
        if (nrOfPages !== 0 && page < nrOfPages) {
            page = page + 1;
        }
        getSearchText();
    });

    //keyevent for textbox
    searchText.onkeypress = function (evt) {
        //if enter
        if (evt.keyCode === 13) {
            backButton.disabled = false;
            forwadButton.disabled = false;
            firstPage.disabled = false;
            lastPage.disabled = false;
            choosedPics = [];
            page = 1;
            viewGallery = false;
            getSearchText();
        }
    };

    //filter button to view gallery of choosed pictures
    var filterButton = document.getElementById("filterButton");
    filterButton.addEventListener('click', function () {
        if (viewGallery === false && choosedPics.length > 0) {
            backButton.disabled = true;
            forwadButton.disabled = true;
            firstPage.disabled = true;
            lastPage.disabled = true;
            viewGallery = true;

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
    function getSearchText() {
        if (searchText !== "") {
            url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3193d22533c7234cc79736cff4d688e5&text=" + searchText.value + "&page=" + page + "&format=json&nojsoncallback=3";
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
                nrOfPages = pictureArray.photos.pages;
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
        pageText.innerHTML = "Page " + page + " of " + nrOfPages;
        //add all picture with for loop
        for (i = 0; i < arr.length; i++) {

            //create new div that contain a picture
            var div = document.createElement('div');
            div.className = "pictureFrame";
            div.id = "picture" + i;

            //add pictrue adress to picture on flickr
            src = "https://farm" + arr[i].farm + ".staticflickr.com/" + arr[i].server + "/" + arr[i].id + "_" + arr[i].secret + ".jpg";
            div.innerHTML = '<img id="image' + i + '" class="images" src=' + src + ' alt="' + arr[i].title + '">';

            //add eventlistener to picture 
            div.addEventListener('click', function (value) {

                //check if choosed picture is viewed in gallery
                if (viewGallery === false) {
                    //change color on frame around picture when click on it
                    if (value.target.parentNode.style.borderColor === "") {
                        value.target.parentNode.style.borderColor = "#fb0404";
                        choosedPics.push(value.target.parentNode);
                    } else {
                        value.target.parentNode.style.borderColor = "";

                        //remove choosed picture from array where choosed pictures for gallery is stored
                        for (j = 0; j < choosedPics.length; j++) {
                            if (choosedPics[j].firstChild.src === value.target.parentNode.firstChild.src) {
                                choosedPics.splice(j, 1);
                            }
                        }
                    }
                } else {

                    //set transition when picture change size
                    value.target.style.transition = "width 1s, height 2s";

                    //resize picture on click
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

        //if picture is choosed to be viewd in gallery, 
        //set frame color to red when page is changed 
        var contentChild = content.childNodes;
        if (choosedPics.length > 0) {
            for (i = 0; i < contentChild.length; i++) {
                for (j = 0; j < choosedPics.length; j++) {
                    if (contentChild[i].firstChild.src === choosedPics[j].firstChild.src) {
                        contentChild[i].style.borderColor = "#fb0404";
                    }
                }
            }
        }
    }
}());