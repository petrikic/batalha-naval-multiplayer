const listOnline = (user) => {
    $("#online-list").append(`
        <li>
            <a id="${user}" href="/users/${user}"><img src="/img/online-ico.png""> ${user}</a>
        </li>`);
}

socket.on('listOnline', list => {
    list.forEach(element => {
        listOnline(element)
    });
});

socket.on('newUser', user => {
    listOnline(user);
});

socket.on('dropUser', user => {
    $('#' + user).closest('li').remove();
});