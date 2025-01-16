export default function Chats() {
    fetch('http://localhost:3000/api/chats', {
        method: 'POST',
    }).then(
        response => response.json()
    ).then(
        data => console.log(data)
    );

    return (
        <h1>Chats</h1>
    )
}