const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

fetch(`https://makeup-api.herokuapp.com/api/v1/products/${productId}.json`)
  .then((response) => response.json())
  .then((product) => {
    displayProductDetails(product);
  });

function displayProductDetails(product) {
  var html = '';

  html += `
    <div class='product-image'>
      <img src="${product.image_link}">
    </div>
    <div class="product-desc">
      <div class="desc-text">
        <h3>${product.name}</h3>
        <p>${product.category} , ${product.product_type}</p>
        <h4>${product.brand}</h4>
        <h6>${product.description}</h6>
        <h5>£ ${product.price}</h5>
      </div>
      <div class="desc-other">
        <p>Color : </p>
        <div class='product-color'>
  `;

  var productColor = product.product_colors;
  for (var k = 0; k < productColor.length; k++) {
    var color = productColor[k].hex_value;
    html += `<span class="color" style="display: flex; width: 50px; height: 50px; background-color: ${color}; margin: 5px;"></span>`;
  }

  html += `
        </div>
        <button onclick="favorite('${product.id}', event)">Favorite</button>
      </div>
    </div>
  `;

  document.getElementById('display').innerHTML = html;
}

const { app, BrowserWindow } = require('electron');
const fs = require('fs')
const path = require('path')

var btnSubmit = document.getElementById('btnSubmit')
var userComment = document.getElementById('userComment')
var commentsDisplay = document.getElementById('commentsDisplay')
var comments = document.getElementById('comments')

let pathName = path.join(__dirname, 'Files')
let file = path.join(pathName, `comment_${productId}.txt`)

if (!fs.existsSync(file)) {
    fs.writeFile(file, '', function(err) {
        if (err) {
            return console.log(err)
        }
        console.log(`File comment_${productId}.txt created`)
    })
}

fs.readFile(file, 'utf8', function(err, data){
  if(err){
      return console.log(err);
  }
  var formattedData = data.replace(/\n/g, '<br>');
  comments.innerHTML = formattedData;
});
btnSubmit.addEventListener('click', function() {
  if (username && userComment.value) {
    var newComment = username + ': ' + userComment.value + '<hr>' + '\n' ;
    fs.appendFile(file, newComment, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log('Comment added');
      comments.innerHTML += newComment.replace(/\n/g, '<br>');
      userComment.value = '';
    });
  } else if (!username) {
    popup.style.display = 'block';
    popupUsernameInput.focus();
  }
});

var userComment = document.getElementById('userComment');
var btnSubmit = document.getElementById('btnSubmit');
var comments = document.getElementById('comments');
var username;
var popup = document.createElement('div');
popup.className = 'popup';

var popupContent = document.createElement('div');
popupContent.className = 'popup-content';
popupContent.innerHTML = '<p>Please enter your username:</p>';

var popupUsernameInput = document.createElement('input');
popupUsernameInput.className = 'popup-username-input';
popupUsernameInput.type = 'text';
// ...

var popupUsernameInput = document.createElement('input');
popupUsernameInput.className = 'popup-username-input';
popupUsernameInput.type = 'text';
popupUsernameInput.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    username = popupUsernameInput.value;
    popup.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.filter = 'none';
  }
});

popup.appendChild(popupContent);
popup.appendChild(popupUsernameInput);
document.body.appendChild(popup);

var overlay = document.createElement('div');
overlay.className = 'overlay';
overlay.style.display = 'none';
document.body.appendChild(overlay);

userComment.addEventListener('focus', function() {
  if (!username) {
    popup.style.display = 'block';
    overlay.style.display = 'block';
    popupUsernameInput.focus();
  }
});

btnSubmit.addEventListener('click', function() {
  if (username && userComment.value) {
    var newComment = username + ': ' + userComment.value + '\n';
    comments.textContent += newComment;
    userComment.value = '';
  } else if (!username) {
    popup.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.filter = 'blur(5px)';
    popupUsernameInput.focus();
  }
});


function showModal(text, modalId) {
  var modal = document.getElementById(modalId);
  var modalText = modal.querySelector("p");

  modalText.textContent = text;

  modal.style.display = "block";

  var closeBtn = modal.querySelector(".close");

  closeBtn.onclick = function() {
    modal.style.display = "none";
    window.removeEventListener('click', outsideClickListener);
  }

  function outsideClickListener(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      window.removeEventListener('click', outsideClickListener);
    }
  }

  window.addEventListener('click', outsideClickListener);
}

function favorite(productId, event) {
  event.preventDefault();
  event.stopPropagation();

  let pathName = path.join(__dirname, 'Files');
  let filePath = path.join(pathName, 'favorite.txt');

  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        data = '[]';
      } else {
        console.error('Error reading from file:', err);
        return;
      }
    }
    if (data === '') {
      data = '[]';
    }

    let favoritesArray = JSON.parse(data);

    if (favoritesArray.includes(productId)) {
      showModal('The product is already in your list', 'added');
      return;
    }

    if (favoritesArray.length >= 5) {
      showModal('You can only have 5 items in your list', 'excessive');
      return;
    }

    favoritesArray.push(productId);

    fs.writeFile(filePath, JSON.stringify(favoritesArray), function(err) {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }

      showModal('The product was added to your list', 'added');
    });
  });
}