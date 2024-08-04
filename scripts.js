// scripts.js
const deliveryFee =200;
// Utility to update cart icon
function updateCartIcon() {
    // localStorage.setItem('cartCount',0);
    const cartCount = localStorage.getItem('cartCount') || 0;
    document.getElementById('cart-count').textContent = `${cartCount}`;
}

function addHiddenField(form, name, value) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
}


// Function to update cart page
function updateCartPage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const orderAmount = JSON.parse(localStorage.getItem('orderAmount') || '0')
    const cartItemsDiv = document.getElementById('cart-items');

    

    

    if (cartItemsDiv) {
        cartItemsDiv.innerHTML = ''; // Clear existing items

        cartItems.forEach(item => {
            // finalTotal += item.price * item.quantity;
            const itemDiv = document.createElement('div');
            if(item.id == 1){
                itemDiv.innerHTML = `
                <div class="item">
                <p>${item.name}  <span class="quant">    x ${item.quantity}</span>   <span class="price">PKR ${item.price*item.quantity}</span></p>
                <p class="flavors">Flavors: ${item.flavors.join(', ')}</p>
                </div>
            `;
            cartItemsDiv.appendChild(itemDiv);

            }
            if(item.id == 2){
                itemDiv.innerHTML = `
                <div class="item">
                <p>${item.name}  <span class="quant">    x ${item.quantity}</span>   <span class="price">PKR ${(item.price*item.pearls+item.price*item.packs)*item.quantity}</span></p>
                <p class="flavors">${item.pearls} Tapioca Pearl Packs</p>
                <p class="flavors">${item.packs} Flavor Packs</p>
                <p class="flavors">Flavors:   ${item.flavors.join(', ')}</p>
                </div>
            `;
            cartItemsDiv.appendChild(itemDiv);

            }
            
        });
        

        // Display final total price
        document.getElementById('order-amount').textContent = `PKR ${orderAmount}`;
        const total = orderAmount + deliveryFee;
        document.getElementById('final-total').textContent = `PKR ${total}`;
    }
}

// Add event listener to add items to the cart
document.addEventListener('DOMContentLoaded', () => {
    
    updateCartIcon();

    
   

    // const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropbtn = document.querySelector('.dropbtn');

    dropbtn.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownContent.classList.toggle('show');
    });

    // Close dropdown if clicked outside
    window.addEventListener('click', () => {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    });



    var inputs = document.querySelectorAll('input[required]');
      
      inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
          input.classList.add('blurred');
        });
      });
    

    


    


    // Update cart page on load if on cart.html
    if (window.location.pathname.includes('cart.html')) {
        updateCartPage();


        // Confirm submit popover
        const orderForm = document.querySelector('.order-form');
        const confirmSubmitButton = orderForm.querySelector('.confirm-submit');
        const popover = orderForm.querySelector('.popover');
        const cancelButton = orderForm.querySelector('.cancel');


        confirmSubmitButton.addEventListener('click', () => {
            if(!orderForm.checkValidity()){
                alert('Fill checkout form')
                return;
            }
            popover.classList.add('show'); // Show the popover
 
        });

        cancelButton.addEventListener('click', () => {
            popover.classList.remove('show'); // Hide the popover

        });



        // Handle form submission //order placement
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz4yENtbFr289ZISe4n9LXdziYVj1VWQWNPFxyrSsvRN35jKTMhe0zE_X58dXTQEkP3/exec'
        const form = document.forms['submit-to-google-sheet']
        

            form.addEventListener('submit', e => {
                e.preventDefault();


                
                const popover = form.querySelector('.popover');
                popover.classList.remove('show');

                const orderAmount = JSON.parse(localStorage.getItem('orderAmount') || '0'); 
                if (orderAmount < 2000){
                    alert('Minimum order amount should be PKR2000');
                    return;
                }

                const loadingDiv = document.querySelector('.loading');
                loadingDiv.classList.add('show');

                const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                const now = new Date();
                const orderNo=Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
                

        
                addHiddenField(form, 'cartItems', cartItems);
                addHiddenField(form, 'total', orderAmount);
                addHiddenField(form, 'time', now);
                addHiddenField(form, 'orderNo', orderNo);
                

               

                // console.log(orderSummary);
                // const mapObject = Object.fromEntries(orderSummary);
                // localStorage.setItem("orderSummary", JSON.stringify(mapObject));
                // const retr = JSON.parse(localStorage.getItem("orderSummary"));
                // const m = new Map(Object.entries(retr));
                // console.log();
                // return;
                // const data = new FormData(form);
                // const action = e.target.action;
                fetch(scriptURL, {
                    method: 'POST',
                    body: new FormData(form)
                })
                .then(response => {
                    console.log('Success!', response);

                     //set localstorage
                    const orderSummary = new Map();
                    orderSummary.set("name", form.elements['fname'].value+''+form.elements['lname'].value);
                    orderSummary.set("contact", form.elements['contact'].value);
                    orderSummary.set("email", form.elements['email'].value);
                    orderSummary.set("address", form.elements['address-street'].value+', '+form.elements['address-city'].value+', Pakistan');
                    orderSummary.set("orderNo", orderNo);
                    orderSummary.set("time", now);
                    orderSummary.set("orderAmount", orderAmount+deliveryFee);
                    orderSummary.set("cartItems", cartItems);
                    const mapObject = Object.fromEntries(orderSummary);
                    localStorage.setItem("orderSummary", JSON.stringify(mapObject));

                    localStorage.removeItem('cartItems');
                    localStorage.setItem('cartCount', '0');
                    localStorage.setItem('orderAmount', '0');

                    form.reset(); // Clear form fields
                    updateCartIcon();
                    updateCartPage(); // Clear cart items display
    
                    loadingDiv.classList.remove('show'); 

                    // window.location.href = 'summary.html';
                    
                    
                })
                .catch(error => {
                    loadingDiv.classList.remove('show'); 
                    alert('Error: Something went wrong. Order could not be placed.')
                    console.error('Error!', error.message);
                });
                
                
            });

        
        
            // Handle clearing the cart
        document.getElementById('clear-cart').addEventListener('click', () => {
            localStorage.removeItem('cartItems');
            localStorage.setItem('cartCount', '0');
            localStorage.setItem('orderAmount', '0');
            updateCartIcon();
            updateCartPage(); // Clear cart items display
            alert('Cart cleared!');
        });
    }

    if (window.location.pathname.includes('order.html')) {




        // Handle adding items to the cart
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productDiv = button.closest('.product');
                const productId = productDiv.getAttribute('data-id');
                const productName = productDiv.querySelector('h3').textContent;
                const productPrice = productDiv.getAttribute('data-price');
                const popover =productDiv.querySelector('.popover');
                popover.classList.add('show');

                let quantity = 0;
                let pearls = 0;

                

                if (productId == 1){
                    // console.log(productId);
                    quantity= Number(productDiv.querySelector('#kits').value);
                    // console.log(quantity);
                    // console.log(typeof quantity);


                    for(let i=1; i<= quantity; i++){

                        // Get selected flavors from the select elements
                        const chooseFlavs = productDiv.querySelector(`.choose-flav[data-id="${i}"]`);
                        // console.log(chooseFlavs);
                        const selectedFlavors = Array.from(chooseFlavs.querySelectorAll('select[name="flavors"]'))
                        .map(select => select.value);

                        // console.log(selectedFlavors);


                        const cartCount = parseInt(localStorage.getItem('cartCount') || '0') + 1;
                        localStorage.setItem('cartCount', cartCount);
                        updateCartIcon();
                        const orderAmount = parseInt(localStorage.getItem('orderAmount') || '0');
                        localStorage.setItem('orderAmount', orderAmount+Number(productPrice));

                        // Save product details to cart
                        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                        const existingItemIndex = cartItems.findIndex(item => 
                            item.id === productId && 
                            JSON.stringify(item.flavors.slice().sort()) === JSON.stringify(selectedFlavors.slice().sort())
                            
                        );
                        
                        // console.log(cartItems);
                        

                        if (existingItemIndex >= 0) {
                            cartItems[existingItemIndex].quantity += 1;
                        } else {
                            cartItems.push({
                                id: productId,
                                name: productName,
                                price: productPrice,
                                quantity: 1,
                                flavors: selectedFlavors
                            });
                        }
                        localStorage.setItem('cartItems', JSON.stringify(cartItems));


                         // Reset select elements
                        chooseFlavs.querySelectorAll('select[name="flavors"]').forEach(select => {
                            select.selectedIndex = 0;
                        });

                    }

                    
                    


                }

                if (productId == 2){
                    pearls = productDiv.querySelector("#pearl-packs").value;
                    packs = productDiv.querySelector("#flavor-packs").value;
                    const elements= productDiv.querySelectorAll('.selected-flav.show');

                    const selectedFlavors = Array.from(elements).map(element => {
                        const select = element.querySelector('select[name="flavors"]');
                        return select ? select.value : null; // Ensure select exists
                      }).filter(value => value !== null);
  

                    const cartCount = parseInt(localStorage.getItem('cartCount') || '0') + 1;
                    localStorage.setItem('cartCount', cartCount);
                    updateCartIcon();
                    const orderAmount = parseInt(localStorage.getItem('orderAmount') || '0');
                    localStorage.setItem('orderAmount', orderAmount+(productPrice*pearls)+(productPrice*packs));
                     
                

                    // Save product details to cart
                    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

                    const existingItemIndex = cartItems.findIndex(item => 
                        item.id === productId && 
                        JSON.stringify(item.flavors.slice().sort()) === JSON.stringify(selectedFlavors.slice().sort()) &&
                        item.pearls === pearls
                    );

                    if (existingItemIndex >= 0) {
                        cartItems[existingItemIndex].quantity += 1;
                    } else {
                        cartItems.push({
                            id: productId,
                            name: productName,
                            price: productPrice,
                            quantity: 1,
                            pearls: pearls,
                            packs: packs,
                            flavors: selectedFlavors
                        });
                    }
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    
                    
                    
                    // Reset select elements
                    productDiv.querySelectorAll('select[name="flavors"]').forEach(select => {
                        select.selectedIndex = 0;
                    });

                }

               

                setTimeout(() => {
                    popover.classList.remove('show'); // Hide the popover
                }, 1500); //1500 milliseconds delay
                
                


                
            });
        });


        document.getElementById('flavor-packs').addEventListener('change', function() {
            const selectedValue = parseInt(this.value, 0);
            // console.log(this);
            const selectedFlavs = document.querySelectorAll('.selected-flav');

            if (selectedValue > 0) {

                selectedFlavs.forEach((element) => {
                    // Access data-id attribute using dataset
                    const dataId = element.dataset.id;
                
                    // Compare dataId with the desired value
                    if (dataId <= selectedValue) {
                        element.classList.add('show');
                    }
                    else{
                        element.classList.remove('show');
                    }
                });
             
            }


        });

        document.getElementById('kits').addEventListener('change', function() {
            const selectedValue = parseInt(this.value, 0);
            // console.log(this);
            const chooseFlavs = document.querySelectorAll('.choose-flav');

            if (selectedValue > 0) {

                chooseFlavs.forEach((element) => {
                    // console.log(element);
                    // Access data-id attribute using dataset
                    const dataId = element.dataset.id;
                
                    // Compare dataId with the desired value
                    if (dataId <= selectedValue) {
                        element.classList.add('show');
                    }
                    else{
                        element.classList.remove('show');
                    }
                });
             
            }


        });



    
    }

   
});
