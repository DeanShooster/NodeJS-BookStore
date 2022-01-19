const login = document.getElementById('login_admin_form');

/**
 * Login admin. Checks credentials with server.
 */
login.addEventListener('submit', (e) => {
    e.preventDefault();
    const loginInfo = { ID: login.children[0].value, password: login.children[1].value }
    loginAdmin(loginInfo);
});


/**
 * Sends an admin login request to the server in order to validate.
 * @param {Admin Credentials} loginInfo 
 */
 async function loginAdmin(loginInfo) {
    const res = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
    });
    const data = await res.json();
    if (!data.Message) {
        localStorage.setItem('token', data.token);
        setInterval(() => {
            if( localStorage.getItem('token') )
                window.location.replace('/admin/page');
        }, 500);
    }
    else
        document.getElementById('login_error').innerHTML = 'Invalid Credentials';
}