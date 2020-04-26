const addBtn = document.getElementById('add');
var trash = document.getElementsByClassName("fa-trash");
document.getElementById('add').addEventListener('click', addToFavorites)

function addToFavorites() {
  let startPosition = document.querySelector('#start').value
  let endPostion = document.querySelector('#end').value
  console.log(startPosition, endPostion);
  fetch('/favorites', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        start: startPosition,
        end: endPostion
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
}
Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        fetch('favorites', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
