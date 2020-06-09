var username = $("#username")[0];
var password = $("#password")[0];
var confirm_password = $('#confirm-password')[0];

const checkRemote = () => {
    $.ajax({
        url: '/register/username',
        type: 'post',
        data: {
            username: username.value
        },
        statusCode: {
            400: () => {
                username.setCustomValidity("O nome de usuário digitado já está em uso.");
                document.getElementById('submit').click();
                username.value = "";
            }
        }
    });
}

const sendValues = () => {
    $.ajax({
        url: '/register',
        type: 'post',
        data: {
            username: username.value,
            password: password.value
        },
        statusCode: {
            200: () => {
                $("#msg").append(`<div class="message" 
                role="alert">usuario cadastrado com sucesso,
                 estamos te redirecionando.</div>`).hide().fadeIn(600);
                setTimeout(() => {
                    location.href = '/';
                }, 3000);
            }
        }
    });
}

username.onchange = () => {
    if (username.value.length < 4) {
        username.setCustomValidity('O nome de usuário deve ter pelo menos 4 caracteres.');
        username.value = "";
    } else {
        username.setCustomValidity('');
        checkRemote();
    }
}

password.onchange = () => {
    if (password.value.length < 4) {
        password.setCustomValidity('A senha deve conter pelo menos 4 caracteres.')
        password.value = "";
    } else {
        password.setCustomValidity('');
    }
}

confirm_password.onchange = () => {
    if (password.value != confirm_password.value) {
        confirm_password.setCustomValidity('As senhas não batem.');
        confirm_password.value = "";
    } else {
        password.setCustomValidity('');
    }
}

$("#form-signin").submit((e) => {
    e.preventDefault()
    sendValues();
});
password.onkeydown = () => password.setCustomValidity('');
username.onkeydown = () => username.setCustomValidity('');
confirm_password.onkeydown = () => confirm_password.setCustomValidity('');