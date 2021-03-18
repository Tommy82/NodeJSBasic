$(document).ready(() => {
    $('.btnChange').click((e) => {
        let accountId = e.target.getAttribute('accountId');
        window.location.href = `${page.prefix}/backend/users/details/${accountId}`;
    })
})