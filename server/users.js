const users = [];

const addUser = ({ id, Name, Room }) => {
    Name = Name.trim().toLowerCase();
    Room = Room.trim().toLowerCase();

    const existingUser = users.find((user) => user.Room === Room && user.Name === Name);

   /* if (!Name || !Room) return { error: 'Username and room are required.' };
    if (existingUser) return { error: 'Username is taken.' };*/

    const user = { id, Name, Room };

    users.push(user);

    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.Room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };