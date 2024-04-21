document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('login');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let username = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    await signInClicked(username, password);
  });
  async function signInClicked(email, password) {
    try {
      let response = await supertokensEmailPassword.signIn({
        formFields: [
          {
            id: 'email',
            value: email,
          },
          {
            id: 'password',
            value: password,
          },
        ],
      });

      if (response.status === 'FIELD_ERROR') {
        response.formFields.forEach((formField) => {
          if (formField.id === 'email') {
            window.alert(formField.error);
          }
        });
      } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
        window.alert('Email password combination is incorrect.');
      } else if (response.status === 'SIGN_IN_NOT_ALLOWED') {
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        window.alert(err.message);
      } else {
        window.alert('Wrong!');
      }
    }
  }
});
