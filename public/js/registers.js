document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('reg');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let patronymic = document.getElementById('patronymic').value;
    let gender = document.getElementById('gender').value;
    let phone = document.getElementById('phone').value;
    await signUpClicked(
      email,
      password,
      firstName,
      lastName,
      patronymic,
      gender,
      phone,
    );
  });

  async function signUpClicked(
    email,
    password,
    firstName,
    lastName,
    patronymic,
    gender,
    phone,
  ) {
    console.log(
      email,
      password,
      firstName,
      lastName,
      patronymic,
      gender,
      phone,
    );
    try {
      let response = await supertokensEmailPassword.signUp({
        formFields: [
          { id: 'email', value: email },
          { id: 'password', value: password },
          { id: 'firstName', value: firstName },
          { id: 'lastName', value: lastName },
          { id: 'patronymic', value: patronymic },
          { id: 'gender', value: gender },
          { id: 'phone', value: phone },
        ],
      });

      if (response.status === 'FIELD_ERROR') {
        response.formFields.forEach((formField) => {
          if (formField.id === 'email') {
            window.alert(formField.error);
          } else if (formField.id === 'password') {
            window.alert(formField.error);
          }
        });
      } else if (response.status === 'SIGN_UP_NOT_ALLOWED') {
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