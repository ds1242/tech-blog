async function newPostHandler(event) {
    event.preventDefault();

    const title = document.getElementById('post-title').value.trim();
    const post_text = document.getElementById('post-text').value;

    const response = await fetch('api/posts', {
        method: 'POST',
        body: JSON.stringify({
            title,
            post_text
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(response.ok) {
        document.location.replace('/dashboard');
    } else {
        console.log(response.statusText);
    }

};

document.querySelector('.new-post').addEventListener('submit', newPostHandler);