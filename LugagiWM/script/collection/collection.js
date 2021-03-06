﻿(function () {
    var collectionID;
    var foodIdList;
    var collectionName;
    function loadCollection() {
        $.ajax({
            type: "GET",
            url: "http://lugagi.com/script/collection/getCollectionContent.php?UserCollectionID=100",
            data: { UserCollectionID: collectionID },
            dataType: 'json',
            cache: false,
            async: true,
            success: function (receivedData) {
                var source = receivedData.Collection;
                collectionName = source.CollectionName;
                $("#collectionName").text(collectionName);
                $("#ViewCount").text(source.ViewCount);
                $("#LikeCount").text(source.LikeCount);
                $("#CollectionDescription").text(source.CollectionDescription);
                $("#CollectionCreatedDate").text("Created on: " + source.CollectionCreatedDate.split(" ")[0]);

                var contentSource = source.Content;
                var numOfContent = contentSource.length;
                for (var i = 0; i < numOfContent; i++) {
                    var currentSource = contentSource[i];
                    if (i == numOfContent - 1) {
                        newFoodImg.on("load", function () {
                            $("progress").hide();
                        })
                    };
                    if (currentSource.ContentType != 'food') {
                        continue;
                    };
                    var newFood = $("#collectionItemSample").clone();
                    newFood.attr("id", "");
                    var contentImg = currentSource.ContentImageURL;
                    if (contentImg) {
                        var fullImgURL = currentSource.ContentImageURL.replace("com/", "com/script/timthumb.php?src=/") + "&w=300&h=200";
                    }
                    else {
                        var fullImgURL = '';
                    }
                    var newFoodImg = newFood.find(".collectionItemImg");
                    newFood.find(".collectionItemName").text(currentSource.ContentName);
                    newFoodImg.attr("src", fullImgURL);

                    // newFood.attr("ContentID", currentSource.ContentID);
                    newFood.show();
                    // create index atrribute
                    newFood.attr("currentIndex", i);
                    // append food ID to a list.
                    foodIdList.push(currentSource.ContentID);

                    $("#collectionContent").append(newFood);
                }
                wrapTwoLines();
            }
        });
    };

    // event

    $(document).ready(function () {
        $("body").on("click", ".collectionItem", function () {
            var currentItem = $(this);
            // var currentID = currentItem.attr("ContentID");
            // WinJS.Navigation.navigate("/pages/food/foodDetails.html", foodIdList[currentItem.attr("currentIndex")]);
            var collectionData = {
                'foodIndex': parseInt(currentItem.attr("currentIndex")),
                'foodIDList': foodIdList,
                'collectionName': collectionName,
                'collectionID': collectionID,
            };
            WinJS.Navigation.navigate("/pages/food/foodDetails.html", collectionData);
        });
    })

    WinJS.UI.Pages.define("/pages/collection/collection.html", {
        ready: function (element, options) {
            collectionID = options;
            foodIdList = [];
            loadCollection();
        }
    });
})();