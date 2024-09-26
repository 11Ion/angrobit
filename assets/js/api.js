// async function fetchUserData() {
//     try {
//         const response = await fetch("../../temp/data.json");
//         const data = await response.json();

//         const user = data.users[0]; 

//         if(user){
//             document.querySelector('[data-username]').textContent = user.username;
//             document.querySelector('[data-username]').setAttribute('data-username', user.username);
    
//             document.querySelector('[data-level]').textContent = user.level;
//             document.querySelector('[data-level]').setAttribute('data-level', user.level);
    
//             document.querySelector('[data-balance1]').textContent = user.balance1;
//             document.querySelector('[data-balance1]').setAttribute('data-balance1', user.balance1);
    
//             document.querySelector('[data-balance2]').textContent = user.balance2;
//             document.querySelector('[data-balance2]').setAttribute('data-balance2', user.balance2);

                
//             document.querySelector('[data-image]').setAttribute('src', user.image);
//             document.querySelector('[data-image]').setAttribute('alt', user.username);
//             document.querySelector('[data-image]').setAttribute('data-image', user.image);

//         }

//     } catch (error) {
//         console.error('Eroare loading data:', error);
//     }
// }

// // async function fetchProducts() {
// //     try {
// //         const response = await fetch("../../temp/data.json");
// //         if (!response.ok) {
// //             throw new Error(`Error network: ${response.status}`);
// //         }

// //         const data = await response.json();

// //         if (!Array.isArray(data.products)) {
// //             throw new Error("Error data product.");
// //         }

// //         const productsContainer = document.querySelector('.products');
        
// //         if(productsContainer){
// //             productsContainer.innerHTML = '';
// //         }

// //         data.products.forEach(product => {
// //             if (product && productsContainer) {
// //                 const productArticle = document.createElement('article');
// //                 productArticle.classList.add('product');
// //                 productArticle.setAttribute('data-type', product.type_product);

// //                 const productPrice = parseFloat(product.price).toFixed(2);
// //                 const productImage = product.image ? product.image : '../../assets/images/home/default.png';

// //                 const productColorsHTML = product.colors.map(color => `
// //                     <label class="label">
// //                         <input type="radio" data-color="${color}" name="color_product_${product.id}" value="${color}" ${color === 'white' ? 'checked' : ''}>
// //                         <span class="check"></span>
// //                     </label>
// //                 `).join('');
            
// //                 productArticle.innerHTML = `
// //                     <div class="product_content">
// //                         <button class="button_add_to_favorite">
// //                             <img src="../../assets/images/catalog/icon_heart.svg" alt="Favorite">
// //                         </button>
// //                         <div class="product_image">
// //                             <img src="${productImage}" alt="${product.name}" />
// //                         </div>
// //                         <div class="product_colors">
// //                             ${productColorsHTML}
// //                         </div>
// //                         <h2 class="product_name">
// //                             ${product.name}
// //                             <div class="shadow"></div>
// //                         </h2>
// //                     </div>
// //                     <button class="button_buy" data-id="${product.id}" data-name="${product.name}" data-price="${productPrice}" data-image="${productImage}">
// //                         $ ${productPrice}
// //                     </button>
// //                 `;

// //                 productsContainer.appendChild(productArticle);

// //                 productArticle.addEventListener('click', function() {
// //                     const detailsContainer = document.querySelector('.catalog_preview_model');
// //                     if (detailsContainer) {
// //                         detailsContainer.innerHTML = `
// //                             <div class="content_details" id="prod_details">
// //                                 <p class="price">$ ${productPrice}</p>
// //                                 <div class="buttons">
// //                                     <button class="button_details" id="handleDetails" data-preview="${product.type_product}">Details</button>
// //                                     <button class="button_buy" data-id="${product.id}" data-name="${product.name}" data-price="${productPrice}" data-image="${productImage}">Buy</button>
// //                                 </div>
// //                             </div>
// //                         `;
// //                     }

// //                     // Setting up the pop-up details functionality
// //                     const handleDetails = document.getElementById("handleDetails");
// //                     const popup = document.querySelector(".preview_product");
// //                     const handleClose = document.querySelector(".button_close");
// //                     const mask = document.querySelector(".mask");

// //                     if (handleDetails && popup && handleClose && mask) {
                        
// //                         handleDetails.addEventListener("click", function(event) {
// //                             event.stopPropagation(); 
// //                             popup.style.display = "flex";

// //                             document.querySelector("#content_popup .product_name").innerText = product.name;
// //                             document.querySelector("#content_popup .price").innerText = `$ ${productPrice}`;
// //                         });

// //                         mask.addEventListener("click", function() {
// //                             popup.style.display = "none";
// //                         });

// //                         handleClose.addEventListener("click", function() {
// //                             popup.style.display = "none";
// //                         });
// //                     }
// //                 });
// //             } else {
// //                 return null;
// //             }
// //         });

// //         document.querySelectorAll('.button_buy').forEach(button => {
// //             button.addEventListener('click', function(event) {
// //                 event.stopPropagation(); 
                
// //                 const productId = this.getAttribute('data-id');
// //                 const productName = this.getAttribute('data-name');
// //                 const productPrice = this.getAttribute('data-price');

// //                 const productToAdd = {
// //                     id: productId,
// //                     name: productName,
// //                     price: productPrice,
// //                     quantity: 1
// //                 };

// //                 let cart = JSON.parse(localStorage.getItem('cart')) || [];

// //                 const existingProduct = cart.find(item => item.id === productId);

// //                 if (existingProduct) {
// //                     existingProduct.quantity += 1;
// //                 } else {
// //                     cart.push(productToAdd);
// //                 }

// //                 localStorage.setItem('cart', JSON.stringify(cart));

// //                 // console.log("Product added to cart:", productToAdd);
// //             });
// //         });
        
// //     } catch (error) {
// //         console.error('Data error:', error);
// //     }
// // }


// // function renderCart() {
// //     let cart = JSON.parse(localStorage.getItem('cart')) || [];

// //     const cartItemsContainer = document.querySelector('.cart_items');
// //     cartItemsContainer.innerHTML = '';

// //     document.querySelector('.set_items span').innerText = `(${cart.length})`;

// //     if(cart.length > 0){
// //         cart.forEach(product => {
        
// //             const cartItemHTML = `
// //                 <li class="cart_item">
// //                     <div class="cart_item_left_box">
// //                         <div class="cart_item_set">
// //                             <input type="checkbox" class="select_product" name="name_product_id_${product.id}">
// //                         </div>
// //                         <div class="cart_item_image">
// //                             <img src="../../assets/images/home/shirt1.png" alt="${product.name}">
// //                         </div>
// //                         <div class="cart_item_details">
// //                             <p class="name">${product.name}</p>
// //                             <div class="cart_item_size">
// //                                 <select name="size_${product.id}" id="">
// //                                     <option value="XS">XS</option>
// //                                     <option value="S">S</option>
// //                                     <option value="M">M</option>
// //                                     <option value="L">L</option>
// //                                     <option value="XL">XL</option>
// //                                     <option value="2XL">2XL</option>
// //                                 </select>
// //                             </div>
// //                         </div>
// //                     </div>
// //                     <div class="cart_item_right_box">
// //                         <p class="cart_item_price">$ ${product.price}</p>
// //                         <div class="cart_item_settings">
// //                             <label for="selectQty_${product.id}">
// //                                 Qty:
// //                                 <select name="select_qty" id="selectQty_${product.id}">
// //                                     ${[...Array(10).keys()].map(i => 
// //                                         `<option value="${i+1}" ${product.quantity === i+1 ? 'selected' : ''}>${i+1}</option>`).join('')}
// //                                 </select>
// //                             </label>
// //                             <button class="button">
// //                                 <img src="../../assets/images/catalog/icon_heart.svg" alt="Favorite">
// //                             </button>
// //                             <button class="button remove_item" data-id="${product.id}">
// //                                 <img src="../../assets/images/catalog/icon_trash.svg" alt="Remove">
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </li>
// //             `;
    
// //             cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
// //         });
// //     } else{
// //          const cartItemHTML = `<em>Cart empty</em>`
// //          cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);

// //     }
   
// //     updateCartTotal(cart); 
// // }

// // function updateCartTotal(cart) {
// //     let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
// //     let serviceFee = 14.05; 
// //     let tax = 7.00; 

// //     document.querySelector('.order_summary span:nth-child(2)').innerText = `$${subtotal.toFixed(2)}`;
// //     document.querySelector('.order_total span:nth-child(2)').innerText = `$${(subtotal + serviceFee + tax).toFixed(2)}`;
// // }

// // document.addEventListener('click', function(event) {
// //     if (event.target.closest('.remove_item')) {
// //         const productId = event.target.closest('.remove_item').getAttribute('data-id');
// //         removeProductFromCart(productId);
// //     }
// // });

// // function removeProductFromCart(productId) {
// //     let cart = JSON.parse(localStorage.getItem('cart')) || [];
// //     cart = cart.filter(product => product.id !== productId);
// //     localStorage.setItem('cart', JSON.stringify(cart));
// //     renderCart(); 
// // }

// // temp 
// function saveAddress(event) {
//     event.preventDefault(); 

//     const firstName = document.getElementById("firstname").value.trim();
//     const secondName = document.getElementById("secondname").value.trim();
//     const streetAddress = document.getElementById("street_address").value.trim();
//     const phone = document.getElementById("phone").value.trim();
//     const city = document.getElementById("city").value.trim();
//     const postalCode = document.getElementById("postal_code").value.trim();
//     const country = document.getElementById("country").value.trim();
//     const saveAsDefault = document.getElementById("save_default").checked; 
//     if (!firstName || !secondName || !streetAddress || !phone || !city || !postalCode || !country) {
//         alert("All fields are required.");
//         return;
//     }

//     const phoneRegex = /^\+?[0-9\s\-]{7,15}$/;
//     if (!phoneRegex.test(phone)) {
//         alert("The phone number must be valid and may include an international area code.");
//         return;
//     }

//     const postalCodeRegex = /^\d{5,6}$/;
//     if (!postalCodeRegex.test(postalCode)) {
//         alert("The postal code must contain 5 or 6 digits.");
//         return;
//     }

//     const address = {
//         firstName: firstName,
//         secondName: secondName,
//         streetAddress: streetAddress,
//         phone: phone,
//         city: city,
//         postalCode: postalCode,
//         country: country,
//         saveAsDefault: saveAsDefault
//     };

//     let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];

//     addresses.push(address);

//     localStorage.setItem('userAddresses', JSON.stringify(addresses));

//     document.querySelector('.address_popup').style.display = 'none';

//     displayAddresses();

//     console.log('Address saved:', address);
// }


// function displayAddresses() {
//     const addressContainer = document.getElementById("address_container");
    
//     let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    
//     const addButton = document.getElementById("add_address_button");

//     addressContainer.innerHTML = ''; 
//     addressContainer.appendChild(addButton); 

//     addresses.forEach((address, index) => {
//         const addressHTML = `
//             <div class="current_address" data-index="${index}">
//                 <div class="top_content">
//                     <p class="user_name"><span class="firstname">${address.firstName}</span> <span class="lastname">${address.secondName}</span></p>
//                     <p class="user_phone">${address.phone}</p>
//                 </div>
//                 <div class="bottom_content">
//                     <p class="user_street">${address.streetAddress}</p>
//                     <p class="user_city">${address.city}</p>
//                     <p class="user_country">${address.country}</p>
//                 </div>
//                 <button class="edit_address" onclick="editAddress(${index})">&#9998;</button>
//                 <button class="remove_address" onclick="removeAddress(${index})">&#128465; </button>
//             </div>
//         `;
//         addButton.insertAdjacentHTML('beforebegin', addressHTML); 
//     });
// }

// function removeAddress(index) {
//     let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
//     addresses.splice(index, 1); 
//     localStorage.setItem('userAddresses', JSON.stringify(addresses));
//     displayAddresses(); 
// }

// function editAddress(index) {
//     let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
//     const address = addresses[index];

//     document.getElementById("firstname").value = address.firstName;
//     document.getElementById("secondname").value = address.secondName;
//     document.getElementById("street_address").value = address.streetAddress;
//     document.getElementById("phone").value = address.phone;
//     document.getElementById("city").value = address.city;
//     document.getElementById("postal_code").value = address.postalCode;
//     document.getElementById("country").value = address.country;
//     document.getElementById("save_default").checked = address.saveAsDefault;

//     addresses.splice(index, 1);
//     localStorage.setItem('userAddresses', JSON.stringify(addresses));

//     document.querySelector('.address_popup').style.display = 'flex';
// }

// document.addEventListener('DOMContentLoaded', (event) => {
//     fetchUserData();
//     // fetchProducts();
//     // renderCart(); 
//     displayAddresses();

//     const formAddAddress = document.getElementById('add_adress');
//     formAddAddress.addEventListener('submit', saveAddress);

// });
