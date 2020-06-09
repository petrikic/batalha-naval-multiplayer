const showMessage = (message, button, event) => {
    let divMessage = document.createElement('div');
    let buttonMessage = document.createElement('button');
    let buttonCancel = document.createElement('button');
    let msg;
    divMessage.innerText = message;
    divMessage.className = 'message';
    buttonMessage.innerHTML = button;
    buttonMessage.className = 'btn btn-lg btn-primary';
    buttonCancel.innerHTML = 'Cancelar'
    buttonCancel.className = 'btn btn-primary';
    $('#msg').prepend(divMessage);
    $(buttonMessage).click(() => {
        event();
        $(divMessage).fadeTo(600, 0, () => {
            divMessage.remove();
        });
    });
    $(buttonCancel).click(() => {
        $(divMessage).fadeTo(600, 0, () => {
            divMessage.remove();
        });
    });
    if (button) $(divMessage).append(buttonMessage,buttonCancel);
    else {
        setTimeout(() => {
            $(divMessage).fadeTo(600, 0, () => {
                divMessage.remove();
            });
        }, 3000);
    }
    $(divMessage).hide().slideDown(600).fadeIn(600);
}