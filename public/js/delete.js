var trash = document.getElementsByClassName("fa-minus-square");

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log("Thank you Anthony");
        let favoriteRoute = event.target.id
        let deleteRoute = event.target.parentNode.parentNode
        console.log(deleteRoute);

        fetch('favorites', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: favoriteRoute
          })
        }).then(function (response) {
            deleteRoute.style.display="none"
        })
      });
});
