function fetchMakeupTypes() {
  fetch('http://makeup-api.herokuapp.com/api/v1/products.json')
    .then((response) => response.json())
    .then(function (data) {
      const makeupTypes = new Set();
      data.forEach((product) => {
        if (product.product_type) {
          makeupTypes.add(product.product_type);
        }
      });

      const makeupTypeSelect = document.getElementById('makeupTypeSelect');
      makeupTypes.forEach((type) => {
        const option = document.createElement('option');
        option.value = type;
        option.text = type;
        makeupTypeSelect.appendChild(option);
      });
    });
}

fetchMakeupTypes();

function handleFilterChange() {
  const selectedBrand = document.getElementById('brandSelect').value;
  const selectedMakeupType = document.getElementById('makeupTypeSelect').value;

  if (selectedBrand === 'Brand' && selectedMakeupType === 'Make Up Type') {
    fetchMakeup('', '');
  } else if (selectedBrand === 'Brand') {
    fetchMakeup('', selectedMakeupType);
  } else if (selectedMakeupType === 'Make Up Type') {
    fetchMakeup(selectedBrand, '');
  } else {
    fetchMakeup(selectedBrand, selectedMakeupType);
  }
}

function fetchMakeup(brand, makeupType) {
  let apiUrl = `http://makeup-api.herokuapp.com/api/v1/products.json`;

  if (brand) {
    apiUrl += `?brand=${brand}`;
  }

  if (makeupType) {
    if (brand) {
      apiUrl += `&product_type=${makeupType}`;
    } else {
      apiUrl += `?product_type=${makeupType}`;
    }
  }

  fetch(apiUrl)
    .then((response) => response.json())
    .then(function (data) {
      displayProducts(data);
    });
}

function displayProducts(products) {
  var html = '';

  for (var i = 0; i < 9; i++) {
    var product = products[i]

    html += `
    <a href="dior.html?id=${product.id}">
      <div class="product">
        <div class="image-product">
          <img src="${product.image_link}" alt="${product.name}">
        </div>
        <div class="desc">
          <h4>${product.brand}</h4>
          <p>${product.name}</p>
          <p>${product.price_sign}${product.price}</p>
          <button class="button" onclick="favorite('${product.id}', event)"><img src="pic/heart.png" style="width: 30px; position: relative; top: 10px;"></button>
        </div>
      </div>
    </a>
  `;
  }
  

  document.getElementById('display').innerHTML = html;
}

function selectOption(brand) {
  const brandSelect = document.getElementById('brandSelect');
  brandSelect.innerText = brand;
  brandSelect.value = brand.toLowerCase();
  document.getElementById('brandOptions').style.display = 'none';
  handleFilterChange();
}

function toggleDropdown() {
  var options = document.getElementById('brandOptions');
  options.style.display = options.style.display === 'none' ? 'block' : 'none';
}

var allProducts = [];

fetchMakeup('', '');

document.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    event.preventDefault();

    const productId = event.target.getAttribute('data-id');
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('show-product', productId);
  }
});
const fs = require('fs');
const path = require('path');

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