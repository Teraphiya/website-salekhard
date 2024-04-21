document.addEventListener('DOMContentLoaded', () => {
  const userId = 1;
  const main = document.querySelector('main');
  const socket = io(window.location.origin);


  const removeItemFromCart = async (cartItemId) => {
    try {
      await fetch(`/cart/item/${cartItemId}`, { method: 'DELETE' });
      socket.emit('removeFromCart', { cartItemId });
      loadCart();
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
    }
  };

  const loadCart = () => {
    fetch(`/cart/${userId}`)
      .then((response) => response.json())
      .then((cart) => {
        const cartGrid = document.querySelector('.products-grid');
        cartGrid.innerHTML = '';

        cart.items.forEach((item) => {
          const productElementId = `product-${item.product.id}`;
          let productElement = document.getElementById(productElementId);

          if (!productElement) {
            productElement = document.createElement('div');
            productElement.id = productElementId;
            productElement.className = 'product';
            productElement.innerHTML = `
                                <div class="product-image">
                                    <img src="${item.product.image}" alt="${item.product.name}">
                                </div>
                                <div class="product-info">
                                    <h3>${item.product.name}</h3>
                                    <p>${item.product.description}</p>
                                    <p>Количество: <span id="quantity-${item.product.id}">${item.quantity}</span></p>
                                    <p>Цена за единицу: ${item.product.price} руб.</p>
                                    <p>Общая стоимость: <span id="total-price-${item.product.id}">${item.quantity * item.product.price}</span> руб.</p>
                                    <button class="remove-item-btn" data-cartItemId="${item.id}">Удалить товар</button>
                                </div>
                            `;
            cartGrid.appendChild(productElement);
          } else {
            document.getElementById(`quantity-${item.product.id}`).textContent =
              item.quantity;
            document.getElementById(
              `total-price-${item.product.id}`,
            ).textContent = item.quantity * item.product.price + ' руб.';
          }
        });

        const totalPriceElement = document.getElementById('totalPrice');
        if (totalPriceElement) {
          totalPriceElement.textContent = `Итоговая стоимость: ${cart.totalPrice} руб.`;
        }

        const removeItemBtns = document.querySelectorAll('.remove-item-btn');
        removeItemBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            const cartItemId = btn.getAttribute('data-cartItemId');
            removeItemFromCart(cartItemId);
          });
        });
      })
      .catch((error) => console.error('Ошибка при загрузке корзины:', error));
  };

  socket.on('productRemoved', function (data) {
    toastr.error(`Товар с ID ${data.cartItemId} удален из корзины.`);
  });

  loadCart();
});
