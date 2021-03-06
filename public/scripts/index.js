$(() => {

  function rounder(num) {
    return Math.round(num*10)/10;
  }

  function renderToPage(card) {
    $('.cards-container').append(card);
  }

  function buildCards(data) {
    $('.card').remove();
    for(let resource of data) {
      if (resource.avg === null) {
        resource.avg = 'No Ratings';
      } else {
        resource.avg = rounder(resource.avg) + ' / 5';
      }
      let $outerdiv = $("<div>").addClass("card").css('width', '18rem');
      let $img = $("<img>").attr('alt', 'Category Pic').attr('src', resource.picture_url).addClass("card-img-top");

      let $middleDiv = $("<div>").addClass("card-body")
                                .append($('<h5>').text(resource.title).addClass("card-title"))
                                .append($('<p>').text(resource.description).addClass('card-text cTex'))
                                .append($('<a>').attr('href', './resources/'+resource.id).addClass('btn btn-outline-info far fa-folder-open').text(' View resource details'));
      let $bottomDiv = $('<div>').append($('<i>').addClass('fas fa-thumbs-up').text(' '+resource.count)).addClass('ranking-likes')
                                .append($('<p>').text(' ' + resource.avg).addClass('p-cards fas fa-star'));
      $outerdiv.append($img).append($middleDiv).append($bottomDiv);

      renderToPage($outerdiv);
    }
  }

  function loadAllData () {
    $.ajax({
    method: "GET",
    url: "/resources"
     }).done((resources) => {
      buildCards(resources);
    });
   }

//Loads all Data
  loadAllData();
//Search bar ajax request
  $('#search-bar').on('submit', function(event) {
    event.preventDefault();
    const search = {};
    search.parameter = ($(this).serialize().split('=')[1]);
    console.log(search);
    $.ajax({
      method: 'GET',
      url:'/resources',
      data: search
      }).done(returnData => {
      buildCards(returnData);
    });
  });

//Side bar Category Filtering
  $('.side-category').on('click', function(event) {
    event.preventDefault();
    const search = {'category': $(this).text()};
    $.ajax({
      method: 'GET',
      url:'/resources',
      data: search
      }).done(returnData => {
      buildCards(returnData);
    });

  });

});
