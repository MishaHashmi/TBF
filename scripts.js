// scripts.js

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
    const cartItemsDiv = document.getElementById('cart-items');
    var finalTotal = 0;

    if (cartItemsDiv) {
        cartItemsDiv.innerHTML = ''; // Clear existing items

        cartItems.forEach(item => {
            finalTotal += Number(item.price);


            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <div class="item">
                <p>${item.name}   <span class="price">PKR ${item.price}</span></p>
                <p class="flavors">${item.flavors.join(', ')}</p>
                </div>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });

        // Display final total price
        document.getElementById('final-total').textContent = `PKR ${finalTotal}`;
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

    

    // Function to update checkbox states based on selected count
    const maxFlavors = 3;
    function updateCheckboxes() {
        const checkboxes = document.querySelectorAll('input[name="flavors"]');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

        checkboxes.forEach(checkbox => {
            if (checkedCount >= maxFlavors && !checkbox.checked) {
                checkbox.disabled = true;
            } else {
                checkbox.disabled = false;
            }
        });
    }

    // Event listener for checkboxes
    document.querySelectorAll('input[name="flavors"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateCheckboxes);
    });

    // Initial update
    updateCheckboxes();

    // Handle adding items to the cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productDiv = button.closest('.product');
            const productId = productDiv.getAttribute('data-id');
            // const quantity = parseInt(productDiv.querySelector('.quantity').value);
            const productName = productDiv.querySelector('h3').textContent;
            const productPrice = productDiv.getAttribute('data-price');
            

            // Default quantity to 1
            const quantity = 1;

            // Get selected flavors
            const selectedFlavors = Array.from(productDiv.querySelectorAll('input[name="flavors"]:checked'))
                .map(cb => cb.value);

            if (selectedFlavors.length < 3) {
                    alert('Select 3 Flavors');
                    return;
            }

            const cartCount = parseInt(localStorage.getItem('cartCount') || '0') + quantity;
            localStorage.setItem('cartCount', cartCount);
            updateCartIcon();

           // Save product details to cart
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            const existingItemIndex = cartItems.findIndex(item => 
                item.id === productId && 
                JSON.stringify(item.flavors) === JSON.stringify(selectedFlavors)
            );

            if (existingItemIndex >= 0) {
                cartItems[existingItemIndex].quantity += quantity;
            } else {
                cartItems.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: quantity,
                    flavors: selectedFlavors
                });
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            // Update button text
            button.textContent = 'Added to Cart';
            button.classList.add('added');
        });
    });

    


    // Update cart page on load if on cart.html
    if (window.location.pathname.includes('cart.html')) {
        // console.log(location.pathname);
        updateCartPage();

        // Handle form submission
        
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzZ3wHQ6vlLfdRAIc-9rFaeKLHKnZNds7EhRXgE0V7peabP6HiA4Cr2wdex6njBJzPe/exec'
        const form = document.forms['submit-to-google-sheet']
    
            form.addEventListener('submit', e => {
                e.preventDefault(); // Prevents the default form submission behavior

                const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
               
                const order=[];
                let orderTotal=0;
                cartItems.forEach(item => {
                    order.push([item.name, item.flavors, item.price])
                    orderTotal += item.price;
                });
                // order.push(["Total",orderTotal]);
                // console.log(order);
    
    
                // Collect form data
                const formData = JSON.stringify(order);
                // console.log(formData);
        
                addHiddenField(form, 'cartItems', formData);
                addHiddenField(form, 'total', orderTotal);
        
        
                fetch(scriptURL, {
                    method: 'POST',
                    body: new FormData(form)
                })
                .then(response => {
                    console.log('Success!', response);
                    form.reset(); // Clear form fields
                    localStorage.removeItem('cartItems');
                    localStorage.setItem('cartCount', '0');
                    updateCartIcon();
                    updateCartPage(); // Clear cart items display
                })
                .catch(error => console.error('Error!', error.message));
            });

        // Handle clearing the cart
        document.getElementById('clear-cart').addEventListener('click', () => {
            localStorage.removeItem('cartItems');
            localStorage.setItem('cartCount', '0');
            updateCartIcon();
            updateCartPage(); // Clear cart items display
            alert('Cart cleared!');
        });
    }



   
});
