$(document).ready(function(){

  var current_category;
  var current_animal;

    // a helper function that instantiates a template
    // and displays the results in the content div
    function showTemplate(template, data, destination){
    	var html    = template(data);
    	$(destination).html(html);
    }

    // Manage ids of nav list to be lowercase
    Handlebars.registerHelper("toLower", function(name) {
      return name.toLowerCase();
    });

    // Take brief from the animal description
    Handlebars.registerHelper("brief", function(text) {
      var brief = text.substring(0, 100);
      var end = brief.lastIndexOf(" ");
      return brief.substring(0, end);
    });

    // Handle navigation template
    var source   = $("#nav").html();
    var nav_template = Handlebars.compile(source);
    showTemplate(nav_template, animals_data, "#navigation");

    // Handle template for home page
    var source = $("#home_page").html();
    var home_template = Handlebars.compile(source);

    // and this will be inserted inside it
    var source = $("#hero_image").html();
    var hero_template = Handlebars.compile(source);

    // Handle template for animals of different categories
    var source = $("#animals").html();
    var animals_template = Handlebars.compile(source);

    // Handle template for displaying individual animal
    var source   = $("#one-animal").html();
    var one_animal_template = Handlebars.compile(source);

    // Handle template for displaying all animals in all categories
    var source   = $("#all").html();
    var all_categories_template = Handlebars.compile(source);


    // Manage active class of navigation tabs
    $(".navbar-nav li").click(function() {
      $(".active").removeClass("active");
      $(this).addClass("active");
    });

    // Callback function for displaying individual animal
    // (used twice so it makes sense to put it into separate function)
    function showAnimal() {
      var index = $(this).data("animal");
      var list = animals_data.category[current_category].animals;
      showTemplate(one_animal_template, list[index], "#main");
    }
    // end of individual animal callback

    // Callback function for displaying animals in given category
    // It is called either from inside home renderer function (default behavior),
    // or after user clicks on nav category buttons
    function showCategory() {
      var list = animals_data.category;
      // by default, current category is defined in home renderer – by random choice
      showTemplate(animals_template, list[current_category], "#main");

      // Display category name in the <h1>Title</h1> of the page
      $("#category_name").html(list[current_category].name);

      // Onclick event listener for displaying individual animal
      $(".animal-container").click(showAnimal);
    }

    function switchActive() {
      // Add active class to the element with id
      // which corresponds to the name attribute of current category
      var selector = animals_data.category[current_category].name;
      idSelector = "#" + selector.toLowerCase();
      $(idSelector).addClass("active");
    }


    // Onclick event listener for home page
    // Choose category and animal randomly
    $("#home").click(function() {
      current_category = Math.floor(Math.random() * animals_data.category.length);
      showTemplate(home_template, animals_data.category[current_category], "#main");
      current_animal = Math.floor(Math.random() * animals_data.category[current_category].animals.length);
      showTemplate(hero_template, animals_data.category[current_category].animals[current_animal], "#hero");

      // Onclick event listener for category buttons
      $(".category").click(function() {
        // Display animals in current category (default behavior)
        showCategory();
        // Manage active class in nav
        $("#home").removeClass("active");
        switchActive();
      });

      // Simple slideshow
      $("#slide").on("click", function() {
        // .hidden is a Bottstrap class which hides the object
        // combine it with fading effect of jQuery
        var oldImage = $(".showing-item");
        var newImage = $(".hidden");
        newImage.fadeIn(1000);
        oldImage.fadeOut(1000);
        $(this).children("img").toggleClass("hidden");
        $(this).children("img").toggleClass("showing-item");
      });

    });
    // end of home page renderer


    // Onclick event listener for nav category buttons: display animals in given category
    $(".category").click(function() {
      // we need to redefine current category set inside home page renderer
      // to correspond to the button clicked
      current_category = $(this).data("category");
      // now we can call regular callback for category
      showCategory();
    });
    // end of category page


    // Onclick event listener for all categories button
    $("#all_categories").click(function() {
      showTemplate(all_categories_template, animals_data, "#main");

      // Onclick event listener for displaying individual animal
      // works very similar to showAnimal callback function
      // except that here we need another logic to define current category
      // and update active class in navigation bar
      $(".animal-container").click(function() {
        var index = $(this).data("animal");
        var parent = $(this).parents(".row");
        current_category = parent.data("category");
        var list = animals_data.category[current_category].animals;
        showTemplate(one_animal_template, list[index], "#main");

        // Manage active classes in nav
        $("#all_categories").removeClass("active");
        switchActive();
      });
      // end of individual animal page

    });

    // Initialize site with home page content
    $("#home").click();

});
// end of ready
