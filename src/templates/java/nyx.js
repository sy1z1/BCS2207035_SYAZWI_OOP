const fs = require('fs');
const path = require('path');

// Read the favorite product IDs from favorite.txt
function readFavorites() {
  const pathName = path.join(__dirname, 'Files');
  const filePath = path.join(pathName, 'favorite.txt');
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      console.error('Error reading from file:', err);
      return;
    }

    // Parse the file data into an array
    const favoritesArray = JSON.parse(data);

    // Fetch the product details for each favorite product ID
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
    // Create a div element to display the product details
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
  
    // Add the product image
    const image = document.createElement('img');
    image.src = "pic/heart.png";
    image.alt = product.name;
    productDiv.appendChild(image);
  
    // Add the product name and price inside a div with class "text"
    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    
    const name = document.createElement('p');
    name.textContent = product.name;
    textDiv.appendChild(name);
    
    const price = document.createElement('p');
    price.textContent = `${product.price_sign}${product.price}`;
    textDiv.appendChild(price);
    
    productDiv.appendChild(textDiv);

  
    // Add a delete button
    const deleteButton = document.createElement('button');
    const imageButton = document.createElement('img');
    imageButton.src = "pic/trash.png";
    imageButton.alt = "Delete"; // Add an alt attribute for accessibility
    deleteButton.appendChild(imageButton);
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', () => {
      // Remove the product from the favorites array
      const index = favoritesArray.indexOf(String(product.id));
      if (index > -1) {
        favoritesArray.splice(index, 1);
      }
  
      // Update the favorites.txt file
      fs.writeFile(filePath, JSON.stringify(favoritesArray), function(err) {
        if (err) {
          console.error('Error writing to file:', err);
        }
  
        // Remove the product div from the favorites container
        document.getElementById('favorites-container').removeChild(productDiv);
      });
    });
    productDiv.appendChild(deleteButton);
  
    // Append the product div to the favorites container
    document.getElementById('favorites-container').appendChild(productDiv);
  }