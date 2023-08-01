import { Server } from 'socket.io';

const SocketHandler = (req, res) => {

    if (res.socket.server.io) {
        console.log("Already set up");
        res.end();
        return;
    }

    const io = new Server(res.socket.server);

    io.on('connection', socket => {

        socket.on('disconnect', () => {
            console.log('Disconnected');
            socket.leaveAll();
            socket.removeAllListeners();
        });

        socket.on("join-room", (roomId) => {
            socket.join(roomId);
        });

        socket.on('input-change', msg => {
          socket.broadcast.emit('update-input', msg)
        })
    })

    res.socket.server.io = io;
    res.end();
}

export default SocketHandler