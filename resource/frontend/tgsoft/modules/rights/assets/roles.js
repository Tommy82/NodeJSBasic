$(document).ready(() => {
    $('#tbl_roles').find('.btnChange').click((e) => {
        let roleId = e.target.getAttribute('roleId');
        window.location.href = `{{prefix}}/backend/roles/details/${roleId}`;
    })
})

