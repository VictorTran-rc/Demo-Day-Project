const addBtn = document.getElementById('add');

document.getElementById('add').addEventListener('click', addToFavorites)


function addToFavorites() {
  let startPosition = document.querySelector('#start').value
  let endPostion = document.querySelector('#end').value
  let sendSms = document.getElementById("sendSms").checked;
  console.log('sendSms', sendSms);
  console.log(startPosition, endPostion);
  fetch('/favorites', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        start: startPosition,
        end: endPostion,
        sendSms: sendSms
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
