﻿(function () {
    // page variables
    var urlList =
        ["http://lugagi.com/script/smartPhoneAPI/landing/loadEditorPickedContent.php",
        "http://lugagi.com/script/smartPhoneAPI/landing/loadLatestFood.php",
        "http://lugagi.com/script/smartPhoneAPI/landing/loadMostLikeCollection.php"]
    var itemList = [".editorPickedItem", ".latestFoodItem", ".mostLikeCollectionItem"];
    var containerList = ["editorPickedContainer", "latestFoodContainer", "mostLikeCollectionContainer"];
    var iconList = ["/images/editor-01.svg", "/images/monan-01.svg", "/images/bstuathich.svg"];
    var titleList = ["Editor's Picks", "Latest Dishes", "Featured Collections"];
    var pageList = ["/pages/index/categories/editorPick.html", "/pages/index/categories/latestFood.html", "/pages/index/categories/featuredCollection.html"];
    // startIndex and endIndex of each section
    var startIndexList;
    var endIndexList;

    // load random dish
    function randDish() {
        var randContainer = $("#randContainer");
        // show progress ring
        var randBreak = $("#randBreak");
        var changeRand = $("#changeRand");
        var randProgress = randContainer.find("progress");
        var randImg = $("#randImg");
        randBreak.hide();
        changeRand.hide();
        randProgress.show();
        $.ajax({
            url: "http://lugagi.com/script/food/generateRandomFood.php",
            data: "Nothing",
            dataType: "json",
            async: true,
            cache: false,
            success: function (data) {
                var source = data.Foods[0];
                var fullImgURL = "http://lugagi.com/script/timthumb.php?src=/foodimages/" + source.ImageURL + "&w=500&h=220";
                randImg.attr("src", fullImgURL);
                $("#randName").text(source.MonAnName);
                var randItem = randContainer.find(".contentItem");
                randItem.attr("data-ID", source.MonAnID);
                randItem.attr("data-type", "food");
                //reveal(randContainer);
                //randContainer.show();
            },
            complete: function () {
                randImg.on("load", function () {
                    // hide progress ring
                    randProgress.hide();
                    randBreak.show();
                    changeRand.show();
                });
            }
        });
    }

    // calculate the endIndex
    function calculateEndIndex(source, lastIndex) {
        if (lastIndex % 2 == 0) {
            var endIndex = lastIndex - 2;
        } else {
            var endIndex = lastIndex - 1;
        };
        return endIndex;
    }

    // load previous contents of a section (the indexes of the items decreases by 2)
    function sectionPrevious(numb) {
        if (startIndexList[numb] > 0) {
            startIndexList[numb] -= 2;
        }
            // to go previous when the startIndex is 0
        else {
            startIndexList[numb] = endIndexList[numb];
        }
        loadSection(numb);
    }

    // load next contents of a section (the indexes of the items increases by 2)
    function sectionNext(numb) {
        if (startIndexList[numb] != endIndexList[numb]) {
            startIndexList[numb] += 2;
        }
            // reset startIndex if it hits the end of json
        else {
            startIndexList[numb] = 0;
        }
        loadSection(numb);
    }


    // run the ajax and get content from server, then load it to the page
    function loadSection(numb) {
        // show the progress bar
        var currentContainer = $(".sectionContainer:eq(" + numb + ")");
        var progressBar = currentContainer.find(".pBar");
        reveal(progressBar);
        $.ajax({
            url: urlList[numb],
            dataType: "json",
            data: "Nothing",
            dataType: "json",
            async: true,
            cache: false,
            success: function (data) {
                var sourceList = [data.EditorPickContents, data.LatestFood, data.MostLikeCollection];
                var source = sourceList[numb];

                // calculate the indexes so that the startIndex can be reset at the end of json
                var lastIndex = source.length;
                endIndexList[numb] = calculateEndIndex(source, lastIndex);
                var i = startIndexList[numb];
                var j = 0;

                // load 6 new items
                for (j; j < 6; j++) {

                    // prevent the index from getting out of json range when the nextButton is clicked too fast
                    //try {
                    //    var test = source[i].ContentName;
                    //}
                    //catch (err) {
                    //    startIndexList[numb] = 0;
                    //    break;
                    //}

                    // load new content to item
                    var itemElem = currentContainer.find(".contentItem:eq(" + j + ")");
                    var newItem = $("#sampleItem").clone();
                    newItem.attr("id", "");
                    var currentImg = newItem.find(".contentImg");
                    var currentSource = source[i];

                    // load the content received from ajax into elements of item
                    var fullImgURL = "http://lugagi.com/script/timthumb.php?src=/" + currentSource.ContentImageURL + "&w=300&h=200";
                    currentImg.attr("src", fullImgURL);
                    // itemElem.find(".contentImg").css("height", "auto");
                    newItem.find(".contentName").text(currentSource.ContentName);
                    newItem.find(".contentView").text(currentSource.ContentViewCount + " ");
                    newItem.find(".contentLike").text(currentSource.ContentLikeCount);
                    itemElem.attr("data-ID", currentSource.ContentID);
                    itemElem.attr("data-type", currentSource.ContentType);
                    newItem.show();
                    itemElem.html(newItem);

                    currentImg.on("load", function () {
                        if (j == 6) {
                            transparentize(progressBar);
                        }
                    });
                    i++;

                    // reset the index if it hits the end of json
                    if (i == lastIndex) {
                        i = 0;
                    };
                };
                //currentContainer.find(".contentItem:eq(6)").find(".contentImg").on("load", function () {
                //    reveal(itemElem.find(".contentView"));
                //    reveal(itemElem.find(".contentLike"));
                //    // hide the progress bar
                //    transparentize(currentContainer.find(".pBar"));
                //});
                wrapTwoLines();
            }
        })
    };

    // function to navigate to category pages
    function navigateCategory(numb) {
        WinJS.Navigation.navigate(pageList[numb]);
    };

    // page events
    $(document).ready(function () {

        // header section events
        $('body').on("click", "#goToIngredient", function () {
            WinJS.Navigation.navigate("/pages/recommendation/ingredientBasedSuggestionBox.html"); // navigate to ingredientBasedSuggestion page
        });

        $('body').on("click", "#goToWeek", function () {
            WinJS.Navigation.navigate("/pages/recommendation/weekMenuSuggestionFilter.html"); // navigate to weekMenuSuggestion page
        });

        // random button event
        $('body').on("click", "#changeRand", function () {
            randDish();
        });

        // previous and next events of all sections
        $('body').on("click", ".previousButton", function () {
            var numb = $('.previousButton').index(this);
            sectionPrevious(numb);
        });

        $('body').on("click", ".nextButton", function () {
            var numb = $('.nextButton').index(this);
            sectionNext(numb);
        });

        $('body').on("click", ".contentItem", function () {
            var currentItem = $(this);
            var contentType = currentItem.attr("data-type")
            if (contentType == "food") {
                var contentID = currentItem.attr("data-ID");
                WinJS.Navigation.navigate("/pages/food/foodDetails.html", contentID);
            } else if (contentType = "collection") {
                var contentID = currentItem.attr("data-ID");
                WinJS.Navigation.navigate("/pages/collection/collection.html", contentID);
            }
        });

        // go to category pages
        $("body").on("click", ".sectionTitle", function () {
            navigateCategory($(".sectionTitle").index(this));
        });

        $("body").on("click", ".sectionIcon", function () {
            navigateCategory($(".sectionIcon").index(this));
        });

        

        //$("body").on("click", "#latestFood", function () {
        //    WinJS.Navigation.navigate("/pages/index/categories/latestFood.html")
        //});

        //$("body").on("click", "#mostLikeCollectionContainer", function () {
        //    WinJS.Navigation.navigate("/pages/index/categories/featuredCollection.html")
        //});
        
    });


    // do when the page is ready
    WinJS.UI.Pages.define("/pages/index/index.html", {
        ready: function (element, options) {

            // reset indeces;
            startIndexList = [0, 0, 0];
            endIndexList = [0, 0, 0];

            // generate random dish
            randDish();

            // load all the sections
            var noOfSections = urlList.length;
            var section = 0;
            var sectionHTML = $("#sectionTemplate").html();
            for (section; section < noOfSections; section++) {
                var sectionID = $(".section:eq(" + section + ")");
                sectionID.html(sectionHTML);
                sectionID.find(".sectionIcon").attr("src", iconList[section]);
                sectionID.find(".sectionTitle").text(titleList[section]);
                //sectionHTML.attr("section-ID", containerList[section])
                loadSection(section);
            }

            //Get auto login user
            getCurrentUser();
        }
    });
})();
