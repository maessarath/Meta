module.exports = (io) => {
    const onlineUsers = new Map();

    io.on('connection', (socket) => {
        console.log('New client connected');

        // Ajouter un utilisateur en ligne
        socket.on('userOnline', (userId) => {
            onlineUsers.set(userId, socket.id);
            io.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));
        });

        // Supprimer un utilisateur déconnecté
        socket.on('disconnect', () => {
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));
                    break;
                }
            }
        });
    });
};