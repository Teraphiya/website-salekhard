document.addEventListener('DOMContentLoaded', () => {
  const socket = io(window.location.origin);

  socket.on('productAdded', function (data) {
    toastr.info(
      `Товар с ID ${data.productId} добавлен в корзину в количестве ${data.quantity}.`,
    );
  });

  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const productId = this.getAttribute('data-id');
      const userId = 1;
      const quantity = 1;

      fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId, quantity }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          socket.emit('addToCart', { productId, quantity });
        })
        .catch((error) => {
          console.error('Ошибка добавления товара в корзину:', error);
          toastr.error('Ошибка при добавлении товара в корзину');
        });
    });
  });
});
