var username = $("#username")[0];
var password = $("#password")[0];

const checkRemote = () => {
    $.ajax({
        url:'/login',
        type: 'post',
        data: {
            username: username.value,
            password: password.value
        },
        statusCode: {
            401: () => {
                username.setCustomValidity("O nome de usuário digitado é inválido.");
                document.getElementById('submit').click();
                username.value = "";
            },
            403: () => {
                if(password.value != ''){
                    password.setCustomValidity("A senha digitada é inválida.");
                    document.getElementById('submit').click();
                    password.value = "";
                }
            },
            200: () => {
                location.href = '/';
            }
        }
    });
}

$("#form-signin").submit((e) => e.preventDefault());
username.onkeydown = () => username.setCustomValidity('');
username.onchange = () => checkRemote();
password.onkeydown = () => password.setCustomValidity('');
password.onchange = () => checkRemote();