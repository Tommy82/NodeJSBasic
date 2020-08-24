$(document).ready(() => {
    $('.btnChange').click((e) => {
        let accountId = e.target.getAttribute('accountId');
        window.location.href = `/backend/users/details/${accountId}`;
    })
})