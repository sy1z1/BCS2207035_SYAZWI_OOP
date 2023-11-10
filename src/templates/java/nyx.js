const fs = require('fs');
const path = require('path');

function readFavorites() {
  const pathName = path.join(__dirname, 'Files');
  const filePath = path.join(pathName, 'favorite.txt');
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      console.error('Error reading from file:', err);
      return;
    }

    const favoritesArray = JSON.parse(data);

    for (const productId of favoritesArray) {
      (function(productId) {
        fetch(`https://makeup-api.herokuapp.com/api/v1/products/${productId}.json`)
          .then((response) => response.json())
          .then((product) => {
            displayProductDetails(product, favoritesArray, filePath);
          });
      })(productId);
    }
  });
}

readFavorites();

function displayProductDetails(product, favoritesArray, filePath) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
  
    const image = document.createElement('img');
    image.src = "pic/heart.png";
    image.alt = product.name;
    productDiv.appendChild(image);
  
    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    
    const name = document.createElement('p');
    name.textContent = product.name;
    textDiv.appendChild(name);
    
    const price = document.createElement('p');
    price.textContent = `${product.price_sign}${product.price}`;
    textDiv.appendChild(price);
    
    productDiv.appendChild(textDiv);

  
    const deleteButton = document.createElement('button');
    const imageButton = document.createElement('img');
    imageButton.src = "pic/trash.png";
    imageButton.alt = "Delete"; 
    deleteButton.appendChild(imageButton);
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', () => {
      const index = favoritesArray.indexOf(String(product.id));
      if (index > -1) {
        favoritesArray.splice(index, 1);
      }
  
      fs.writeFile(filePath, JSON.stringify(favoritesArray), function(err) {
        if (err) {
          console.error('Error writing to file:', err);
        }
  
        document.getElementById('favorites-container').removeChild(productDiv);
      });
    });
    productDiv.appendChild(deleteButton);
  
    document.getElementById('favorites-container').appendChild(productDiv);
  }