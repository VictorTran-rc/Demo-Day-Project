var trash = document.getElementsByClassName("fa-minus-square");


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log("Thank you Anthony");
        let elementToRemove = event.target.parentNode.parentNode
        let favoriteRoute = event.target.id
        let deleteStart = event.target.parentNode.parentNode.querySelector(".start").textContent
        let deleteEnd = event.target.parentNode.parentNode.querySelector('.end').textContent

        fetch('favorites', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            start: deleteStart,
            end: deleteEnd,
            id: favoriteRoute
          })
        }).then(function (response) {
            elementToRemove.parentNode.removeChild(elementToRemove)
        })
      });
});
