// scripts.js


allFlavors = ["TARO", "MATCHA", "LATTE", "CHOCOLATE", "VANILLA", "STRAWBERRY", "BROWN SUGAR", "COCONUT", "HONEY DEW", "RED VELVET"];
kitPrice = 3000;
packPrice = 700;
deliveryFee = 500;

    



function updateOrderPage(){
    const bubbleteaKit = document.querySelector('.product[data-id="1"]');
    const pearlFlavorPacks = document.querySelector('.product[data-id="2"]');
    const btKit = document.querySelectorAll('.data-id-1');
    const pfPacks = document.querySelectorAll('.data-id-2');

    if (bubbleteaKit) {
        bubbleteaKit.dataset.price = kitPrice;  
    }
    if (pearlFlavorPacks) {
        pearlFlavorPacks.dataset.price = packPrice;  
    }

    
    btKit.forEach(span => {
        span.textContent = kitPrice; 
    });
    pfPacks.forEach(span => {
        span.textContent = packPrice; 
    });

}


function updateCartIcon() {
    
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



function updateCartPage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const orderAmount = JSON.parse(localStorage.getItem('orderAmount') || '0')
    const cartItemsDiv = document.getElementById('cart-items');
    const moneyElement = document.getElementById('delivery-Fee');
        
    if (moneyElement) {
        moneyElement.textContent = deliveryFee;

    }
    

    

    if (cartItemsDiv) {
        cartItemsDiv.innerHTML = ''; // Clear existing items

        cartItems.forEach(item => {
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
                <p class="flavors">${item.flavors.join(', ')}</p>
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


document.addEventListener('DOMContentLoaded', () => {
    
    updateCartIcon();
    
    


    
   

    document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropbtn = document.querySelector('.dropbtn');

    dropbtn.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownContent.classList.toggle('show');
    });


    window.addEventListener('click', () => {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    });



    var inputs = document.querySelectorAll('input[required]');

    inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            if (!input.checkValidity()) {
                input.classList.add('blurred');
            } else {
                input.classList.remove('blurred');
            }
        });
    });

      
    


      if (typeof on_index !== 'undefined' && on_index === true) {
        document.querySelector('.instruct-toggle').addEventListener('click', function () {
            const content = document.querySelector('.instruct-content');
            const icon = document.querySelector('.instruct-icon');
        
            if (content.classList.contains('show')) {
                content.classList.remove('show');
                icon.classList.remove('rotate');
            } else {
                content.classList.add('show');
                icon.classList.add('rotate');
            }
        });

    }



    if (window.location.pathname.includes('cart')) {
        updateCartPage();
        window.addEventListener("pageshow", function (event) {
            var historyTraversal = event.persisted,
              perf = window.performance,
              perfEntries =
                perf && perf.getEntriesByType && perf.getEntriesByType("navigation"),
              perfEntryType = perfEntries && perfEntries[0] && perfEntries[0].type,
              navigationType = perf && perf.navigation && perf.navigation.type;
            if (
              historyTraversal ||
              perfEntryType === "back_forward" ||
              navigationType === 2 
            ) {
              // Handle page restore.
              window.location.reload();
            }
        });


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
            popover.classList.add('show'); 
 
        });

        cancelButton.addEventListener('click', () => {
            popover.classList.remove('show'); 

        });



        // Handle form submission //order placement
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzxdrFlcLOtT899KoLbyEhegf6RyQ79eOd0nbIbqwnlTCSEmDvdkzPyom_0qRjcuwUW/exec'
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
                
                
                const bubbleKits=[];
                const customKits=[];
                cartItems.forEach(item => {
                    if(item.id == 1){
                        bubbleKits.push([item.name, "quantity:", item.quantity, item.flavors])
                    }
                    if(item.id == 2){
                        customKits.push([item.name, "quantity:", item.quantity, "pearl packs:",item.pearls, "flavors:", item.packs ,item.flavors])
                    }
                    
                });
                addHiddenField(form, 'bubbleKits', JSON.stringify(bubbleKits));
                addHiddenField(form, 'customKits', JSON.stringify(customKits));

                addHiddenField(form, 'orderAmount', orderAmount);
                addHiddenField(form, 'time', now);
                addHiddenField(form, 'orderNo', orderNo);
                

               

                // console.log(orderSummary);
                // const mapObject = Object.fromEntries(orderSummary);
                // localStorage.setItem("orderSummary", JSON.stringify(mapObject));
                // const retr = JSON.parse(localStorage.getItem("orderSummary"));
                // const m = new Map(Object.entries(retr));
                
                fetch(scriptURL, {
                    method: 'POST',
                    body: new FormData(form)
                })
                .then(response => {
                    console.log('Success!', response);

                
                    const orderSummary = new Map();
                    orderSummary.set("name", form.elements['fname'].value+''+form.elements['lname'].value);
                    orderSummary.set("contact", form.elements['contact'].value);
                    orderSummary.set("email", form.elements['email'].value);
                    orderSummary.set("address", form.elements['address-street'].value+', '+form.elements['address-city'].value+', Pakistan');
                    orderSummary.set("orderNo", orderNo);
                    orderSummary.set("time", now);
                    orderSummary.set("orderAmount", orderAmount+deliveryFee);
                    orderSummary.set("cartItems", cartItems);
                    orderSummary.set("deliveryFee", deliveryFee)
                    const mapObject = Object.fromEntries(orderSummary);
                    sessionStorage.setItem("orderSummary", JSON.stringify(mapObject));

                    localStorage.removeItem('cartItems');
                    localStorage.removeItem('cartCount');
                    localStorage.removeItem('orderAmount');
                    localStorage.removeItem('kit');

                    form.reset();
                    updateCartIcon();
                    updateCartPage();
    
                    loadingDiv.classList.remove('show'); 

                    window.location.href = 'summary.html';
                    
                    
                })
                .catch(error => {
                    loadingDiv.classList.remove('show'); 
                    alert('Error: Something went wrong. Order could not be placed.')
                    console.error('Error!', error.message);
                });
                
                
            });


        document.getElementById('clear-cart').addEventListener('click', () => {
            localStorage.removeItem('cartItems');
            localStorage.setItem('cartCount', '0');
            localStorage.setItem('orderAmount', '0');
            localStorage.setItem('kit', '0');
            updateCartIcon();
            updateCartPage(); 
            alert('Cart cleared!');
        });
    }





    if (window.location.pathname.includes('order')) {
        updateOrderPage()

        window.addEventListener("pageshow", function (event) {
            var historyTraversal = event.persisted,
              perf = window.performance,
              perfEntries =
                perf && perf.getEntriesByType && perf.getEntriesByType("navigation"),
              perfEntryType = perfEntries && perfEntries[0] && perfEntries[0].type,
              navigationType = perf && perf.navigation && perf.navigation.type;
            if (
              historyTraversal ||
              perfEntryType === "back_forward" ||
              navigationType === 2 
            ) {
              window.location.reload();
            }
        });
        
        const kit = parseInt(localStorage.getItem('kit') || '0');
        const kitDiv = document.querySelector('.kit');
        const fullDiv = document.querySelector('.full');
        if(kit){
            kitDiv.classList.remove('show');
            fullDiv.classList.add('show');
        }
        else{
            kitDiv.classList.add('show');
            fullDiv.classList.remove('show');
        }

        const flavorsContainerDiv = document.querySelector(".flavors-container");
        flavorsContainerDiv.innerHTML='';
        allFlavors.forEach(item =>{
            const itemDiv = document.createElement('div');
            itemDiv.className = "flavor-block";
            itemDiv.textContent = item;
            flavorsContainerDiv.appendChild(itemDiv);

        });


        const flavorsDivs = document.querySelectorAll(".flavors");
        flavorsDivs.forEach(flavorDiv => {
            flavorDiv.innerHTML = ''; 
            allFlavors.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                flavorDiv.appendChild(option);
            });
        });


        
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productDiv = button.closest('.product');
                const productId = productDiv.getAttribute('data-id');
                const productName = productDiv.querySelector('h3').textContent;
                const productPrice = productDiv.getAttribute('data-price');
                const popover =productDiv.querySelector('.popover');
                

                let quantity = 0;
                let pearls = 0;

                

                if (productId == 1){
                    popover.classList.add('show');
                    quantity= Number(productDiv.querySelector('#kits').value);
                    


                    for(let i=1; i<= quantity; i++){

                        
                        const chooseFlavs = productDiv.querySelector(`.choose-flav[data-id="${i}"]`);
                        
                        const selectedFlavors = Array.from(chooseFlavs.querySelectorAll('select[name="flavors"]'))
                        .map(select => select.value);

                        


                        const cartCount = parseInt(localStorage.getItem('cartCount') || '0') + 1;
                        localStorage.setItem('cartCount', cartCount);
                        updateCartIcon();
                        const orderAmount = parseInt(localStorage.getItem('orderAmount') || '0');
                        localStorage.setItem('orderAmount', orderAmount+Number(productPrice));

                       
                        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                        const existingItemIndex = cartItems.findIndex(item => 
                            item.id === productId && 
                            JSON.stringify(item.flavors.slice().sort()) === JSON.stringify(selectedFlavors.slice().sort())
                            
                        );
                        
                        
                        

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
                        localStorage.setItem('kit', '1');

                        kitDiv.classList.remove('show');
                        fullDiv.classList.add('show');



                        chooseFlavs.querySelectorAll('select[name="flavors"]').forEach(select => {
                            select.selectedIndex = 0;
                        });

                    }

                    
                    


                }

                if (productId == 2){
                    pearls = productDiv.querySelector("#pearl-packs").value;
                    packs = productDiv.querySelector("#flavor-packs").value;
                    if(pearls == 0 && packs ==0){
                        return;
                    }
                    popover.classList.add('show');
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
                    
                    
                    
                    
                    productDiv.querySelectorAll('select').forEach(select => {
                        select.selectedIndex = 0;
                    });

                    const event = new Event('change', { bubbles: true, cancelable: true });
                    document.getElementById('flavor-packs').dispatchEvent(event);
                    

                }

               

                setTimeout(() => {
                    popover.classList.remove('show');
                }, 1500); 
                
                


                
            });
        });


        document.getElementById('flavor-packs').addEventListener('change', function() {

            const selectedValue = parseInt(this.value, 0);
            
            const selectedFlavs = document.querySelectorAll('.selected-flav');

            

            selectedFlavs.forEach((element) => {
                const dataId = element.dataset.id;
            
                if (dataId <= selectedValue) {
                    element.classList.add('show');
                }
                else{
                    element.classList.remove('show');
                }
            });
             


        });

        document.getElementById('kits').addEventListener('change', function() {
            const selectedValue = parseInt(this.value, 0);
            const chooseFlavs = document.querySelectorAll('.choose-flav');

           

            chooseFlavs.forEach((element) => {
                const dataId = element.dataset.id;

                if (dataId <= selectedValue) {
                    element.classList.add('show');
                }
                else{
                    element.classList.remove('show');
                }
            });
            
            


        });



    
    }

   

   
});
