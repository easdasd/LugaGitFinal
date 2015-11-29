﻿var dayMenuHTML;
var mealSectionList = [".breakfastSection", ".lunchSection", ".dinnerSection"];
var contentItemHTML = '<div class="menuContentCol col-xs-6 col-sm-4 col-md-3 col-lg-2">' +
                           '<div class="menuContentItem" data-food-ID="">' +
                               '<img class="menuContentImg img-responsive" src="" />' +
                               '<h6 class="menuContentName"></h6>' +
                               //'<small>' +
                                   //'<span class="glyphicon glyphicon-eye-open contentView"></span>' +
                                   //'<span class="glyphicon glyphicon-heart contentLike"></span>' +
                               //'</small>' +
                            '</div>' +
                            //'<button class="changeMenuItem specialButton" data-day="" data-meal="" data-dish="" changed="">Change Dish</button>' +
                       '</div>';

// reload the contents
function reloadContent() {
    var i = 0;
    for (i; i < 7; i++) {
        var dayID = ".tab-pane:eq(" + i + ")";
        $(dayID).html(dayMenuHTML);
    }
}

// load a food item content
function loadMenuItemContent(mealSectionElem, source, index) {
    var fullImgURL = "http://lugagi.com/script/timthumb.php?src=/foodimages/" + source.ImageURL + "&w=300&h=200";
    mealSectionElem.find(".menuContentImg").eq(index).attr("src", fullImgURL);
    mealSectionElem.find(".menuContentName").eq(index).text(source.MonAnName);
    mealSectionElem.find(".menuContentItem").eq(index).attr("data-food-ID", source.MonAnID);
    mealSectionElem.find(".changeMenuItem").eq(index).attr("data-dish", index);
}

// load the week menu page
function loadWeekMenuContent(data) {
    var i = 0;
    // load each day
    for (i; i < 7; i++) {
        var daySource = data[i].Meal;
        var dayID = ".tab-pane:eq(" + i + ")";
        var j = 0;
        // load each meal
        for (j; j < 3; j++) {
            var mealSource = daySource[j];
            var mealSectionElem = $(dayID).find(mealSectionList[j]);
            var k = 0;
            // load each dish
            for (k; k >= 0; k++) {
                var dishSource = mealSource[k];
                // break the loop if out of dishes
                if (dishSource) {
                    mealSectionElem.append(contentItemHTML);
                    mealSectionElem.find(".changeMenuItem").eq(k).attr("data-day", i);
                    mealSectionElem.find(".changeMenuItem").eq(k).attr("data-meal", j);
                    loadMenuItemContent(mealSectionElem, dishSource, k);
                } else {
                    break;
                }
            }
        }
    }
}

// navigate to foodDetails page of the dish
function goToDish() {
    var contentID = $(this).attr("data-food-ID");
    WinJS.Navigation.navigate("/pages/food/foodDetails.html", contentID);
}
$('body').on("click", ".menuContentItem", goToDish);

// new menu suggestion event
$('body').on("click", "#newMenu", function () {
    loadWeekMenu(nutritionChoices);
})


// for change menu dish feature (have not finished)

//$('body').off("click", ".changeMenuItem", goToDish);

//$('body').on("click", ".changeMenuItem", function () {
//    var itemDay = $(this).attr("data-day");
//    var itemMeal = $(this).attr("data-meal");
//    var itemDish = $(this).attr("data-dish");
//})


WinJS.UI.Pages.define("/pages/recommendation/weekMenuSuggestionContent.html", {
    ready: function (element, options) {
        dayMenuHTML = $("#monday").html();
        reloadContent();
        loadWeekMenuContent(options[0]);       
    }
});