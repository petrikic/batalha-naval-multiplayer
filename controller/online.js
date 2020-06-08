var stackOnline = [];

const addUser = (user) => {
    stackOnline.push(user);
}

const removeUser = (user) => {
    stackOnline.pop(user);
}

const checkUser = (user) => {
    return stackOnline.includes(user);
}

const listUsers = () => {
    return stackOnline.filter((i, j) => stackOnline.indexOf(i) === j);
}

exports.set = addUser;
exports.remove = removeUser;
exports.check = checkUser;
exports.list = listUsers;