
function initializeSearchList() {
  $('#searchResults > li').click(function (event) {
    $(this).remove();
    event.preventDefault();
  });
}
