const showMessage = (message, button, event) => {
    let divMessage = document.createElement('div');
    let divBreak = document.createElement('div');
    let buttonMessage = document.createElement('button');
    let buttonCancel = document.createElement('button');
    divMessage.innerHTML = message;
    divMessage.className = 'message';
    divBreak.className = 'break';
    buttonMessage.innerHTML = button;
    buttonMessage.className = 'btn btn-lg btn-primary';
    buttonCancel.innerHTML = 'Cancelar'
    buttonCancel.className = 'btn btn-primary';
    $('#msg').prepend(divMessage);
    $(buttonMessage).on('click', () => {
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
    if (button) {
        $(divMessage).append(divBreak, buttonMessage, buttonCancel);
    } else {
        setTimeout(() => {
            $(divMessage).fadeTo(600, 0, () => {
                divMessage.remove();
            });
        }, 3000);
    }
    $(divMessage).hide().slideDown(600).fadeIn(600);
}
