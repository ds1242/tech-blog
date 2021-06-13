async function commentHandler(event) {
    event.preventDefault();

    const comment_text = document.getElementById('comment-text').value.trim();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if(comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                comment_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.ok) {
            document.location.reload();
        } else {
            console.log(response.statusText);
        }
    }
};

document.getElementById('comment-text-form').addEventListener('submit', commentHandler);
