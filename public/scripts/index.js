$(() => {

  function renderToPage(card) {
    $('.cards-container').append(card);
  }

  function buildCards(data) {
    for(let resource of data) {
      console.log(resource);
      let $outerdiv = $("<div>").addClass("card").css('width', '18rem');
      let $img = $("<img>").attr('alt', 'Category Pic').attr('src', resource.url).addClass("card-img-top");

      let $middleDiv = $("<div>").addClass("card-body")
                                .append($('<h5>').text(resource.title).addClass("card-title"))
                                .append($('<p>').text(resource.description).addClass('card-text'))
                                .append($('<a>').attr('href', '#').addClass('btn btn-primary').text('Go Somewhere'));
      $outerdiv.append($img).append($middleDiv);

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


  loadAllData();
});
