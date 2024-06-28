const net = require('net');

const PORT = 8080;
const HOST = '0.0.0.0';

const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('data', (data) => {
        console.log('Received data from client:', data.toString());
        
        // Process the received data if necessary
        // For example, parse JSON and respond back
        // try {
        //     const jsonData = JSON.parse(data.toString());
        //     console.log('Parsed JSON data:', jsonData);
            
        //     // Send a response back to the client
        //     const response = { status: 'success', received: jsonData };
        //     socket.write(JSON.stringify(response));
        // } catch (error) {
        //     console.error('Error parsing JSON:', error);
        // }
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});
