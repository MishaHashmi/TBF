document.addEventListener('DOMContentLoaded', () => {



    if (window.location.pathname.includes('summary.html')) {

        const orderSummary = JSON.parse(localStorage.getItem("orderSummary"));
        const order = new Map(Object.entries(orderSummary));
        console.log(order);

        const orderNo = order.get('orderNo');
        const time = order.get('time');

        const date = new Date(time);

        // Format the date string
        const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        });

        // Format the time string
        const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // Set to false for 24-hour format
        });

        const name = order.get('name');
        const cont = order.get('contact');
        const add = order.get('address');
        const email = order.get('email');


        document.querySelector('.order-no').textContent = `Order # ${orderNo}`;
        document.querySelector('.time').textContent = `${formattedDate} on ${formattedTime}`;
        document.querySelector('.Name').textContent = `${name}`;
        document.querySelector('.Contact').textContent = `${cont}`;
        document.querySelector('.Address').textContent = `${add}`;
        document.querySelector('.Email').textContent = `${email}`;
        document.querySelector('.payment').textContent = "Cash On Delivery";
        document.querySelector('.Delivery').textContent = ` +200`;

        const cartItems = order.get('cartItems');
        console.log(cartItems);
        const itemsDiv = document.querySelector('.Items');

        cartItems.forEach(item => {
            const itemDiv = document.createElement('div');
            
            
        
            
            if(item.id == "1"){
                itemDiv.innerHTML = `
                <div class="item">
                <p>${item.name}  <span class="quant">    x ${item.quantity}</span>   <span class="price">PKR ${item.price*item.quantity}</span></p>
                <p class="flavors">Flavors: ${item.flavors.join(', ')}</p>
                </div>
            `;
            itemsDiv.appendChild(itemDiv);

            }
            if(item.id == "2"){
                itemDiv.innerHTML = `
                <div class="item">
                <p>${item.name}  <span class="quant">    x ${item.quantity}</span>   <span class="price">PKR ${(item.price*item.pearls+item.price*item.packs)*item.quantity}</span></p>
                <p class="flavors">${item.pearls} Tapioca Pearl Packs</p>
                <p class="flavors">${item.packs} Flavor Packs</p>
                <p class="flavors">${item.flavors.join(', ')}</p>
                </div>
            `;
            itemsDiv.appendChild(itemDiv);

            }


        });

        const amount = order.get('orderAmount');
        document.querySelector('.Amount').textContent = `PKR ${amount}`;








    }
});