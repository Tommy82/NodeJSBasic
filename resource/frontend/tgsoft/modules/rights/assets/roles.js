$(document).ready(() => {
    $('#tbl_roles').find('.btnChange').click((e) => {
        let roleId = e.target.getAttribute('roleId');
        window.location.href = `${page.prefix}/backend/roles/details/${roleId}`;
    })
})

