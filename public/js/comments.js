// ! перенос скрипта -->
var modal = document.getElementById('myModal');
var images = document.querySelectorAll('.photo-container img');
var modalImg = document.getElementById('modalImage');
var captionText = document.getElementById('caption');
for (let i = 0; i < images.length; i++) {
  /* Обработчик событий клик на фото*/
  images[i].onclick = function () {
    modal.style.display = 'block';
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
    currentImageIndex = i;
  };
}
var span = document.getElementsByClassName('close')[0]; /* 1 */
span.onclick = function () {
  modal.style.display = 'none';
};
var currentImageIndex;
document.getElementById('nextButton').onclick = function () {
  if (currentImageIndex + 1 < images.length) {
    /* След есть */
    currentImageIndex++;
    modalImg.src = images[currentImageIndex].src;
    captionText.innerHTML = images[currentImageIndex].alt;
  }
};
document.getElementById('prevButton').onclick = function () {
  if (currentImageIndex > 0) {
    /* Не 1, i -на 1*/
    currentImageIndex--;
    modalImg.src = images[currentImageIndex].src;
    captionText.innerHTML = images[currentImageIndex].alt;
  }
};
// ! конец переноса скрипта

document.addEventListener('keydown', function (event) {
  if (modal.style.display === 'block') {
    // Проверяем, открыта ли модалка
    if (event.keyCode === 37) {
      // Стрелка влево
      if (currentImageIndex > 0) {
        currentImageIndex--;
        modalImg.src = images[currentImageIndex].src;
        captionText.innerHTML = images[currentImageIndex].alt;
      }
    } else if (event.keyCode === 39) {
      // Стрелка вправо
      if (currentImageIndex + 1 < images.length) {
        currentImageIndex++;
        modalImg.src = images[currentImageIndex].src;
        captionText.innerHTML = images[currentImageIndex].alt;
      }
    }
  }
});

    let form = document.getElementById('newCommentForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('commentName').value;
      const email = document.getElementById('commentEmail').value;
      const content = document.getElementById('commentBody').value;

      // Проверка на заполненность полей
      if (!name || !email || !content) {
        Swal.fire({
          title: 'Ошибка!',
          text: 'Пожалуйста, заполните все поля.',
          icon: 'error',
          confirmButtonText: 'ОК',
        });
        return;
      }

      // Проверка на корректность email
      if (!/\S+@\S+\.\S+/.test(email)) {
        Swal.fire({
          title: 'Ошибка!',
          text: 'Некорректный формат email.',
          icon: 'error',
          confirmButtonText: 'ОК',
        });
        return;
      }

      try {
        const response = await fetch('/photo/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, content }),
        });

        if (!response.ok) {
          throw new Error('Сервер вернул ошибку');
        }

        // Ответ сервера успешен
        Swal.fire({
          title: 'Комментарий отправлен!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          // Перезагрузка страницы после закрытия уведомления
          window.location.reload();
        });
      } catch (error) {
        Swal.fire({
          title: 'Ошибка!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'ОК',
        });
      }
    });

document.addEventListener('DOMContentLoaded', () => {
  const editButtons = document.querySelectorAll('.edit-comment');

  editButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Нахожу родительский элемент комментария
      const comment = button.closest('.comment');

      // Элементы комментария
      const commentContent = comment.querySelector('.comment-content');
      const editForm = comment.querySelector('.comment-edit-form');
      const commentHeader = comment.querySelector('h4');

      button.style.display = 'none';
      commentContent.style.display = 'none';
      commentHeader.style.display = 'none';

      // Заполняю
      const editCommentName = editForm.querySelector('.edit-comment-name');
      const editCommentEmail = editForm.querySelector('.edit-comment-email');
      const editCommentContent = editForm.querySelector(
        '.edit-comment-content',
      );

      editCommentName.value = commentContent.previousElementSibling.innerText.split(' ')[0];
      editCommentEmail.value = commentContent.previousElementSibling.innerText.split(' ')[1].slice(1, -1);
      editCommentContent.value = commentContent.innerText;
      
      // Отображаю форму редактирования
      editForm.style.display = 'block';
    });
  });

  // По аналогии
  const saveButtons = document.querySelectorAll('.save-edit-comment');

  saveButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const editForm = button.parentElement;
    
      const editCommentName = editForm.querySelector('.edit-comment-name').value;
      const editCommentEmail = editForm.querySelector('.edit-comment-email',).value;
      const editCommentContent = editForm.querySelector('.edit-comment-content',).value;
      
      const commentId = button.closest('.comment').getAttribute('data-comment-id');

      // Отправляю PUT-запрос на сервер для обновления комментария
      try {
        const response = await fetch(`/photo/${commentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editCommentName,
            email: editCommentEmail,
            content: editCommentContent,
          }),
        });

        if (!response.ok) {
          window.location.reload();
        }

        // Отправляю текст комментария на странице
        const commentContent = editForm.parentElement.querySelector('.comment-content');
        commentContent.innerText = editCommentContent;
        commentContent.style.display = 'block';

        // Скрываю форму редактироваиня
        editForm.style.display = 'none';
      } catch (error) {
        console.error('Error:', error.message);
      }
      window.location.reload();
    });
  });
});