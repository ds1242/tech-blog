async function editPostHandler(event) {
    event.preventDefault();
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];
    const title = document.getElementById('post-title').value;
    const post_text = document.getElementById('post-text').value;

    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title, 
            post_text
        }),
        headers: {
            'Content-Type':'application/json'
        }
    });
    if(response.ok) {
        document.location.replace('/dashboard');
    } else {
        console.log(response.statusText);
    }
}

document.getElementById('edit-post-form').addEventListener('submit', editPostHandler);