LoadPage();
LoadBooks();
async function LoadPage(){
    if( localStorage.length > 0 ){
        const res = await fetch('/user/load',{
            method: 'GET',
            headers: { token: localStorage.getItem('token') }
        });
        const data = await res.json();
        if( data.name )
        {
            userInterface.className = 'hidden';
            userSettings.className = ''; userSettings.innerHTML = (data.name).concat(',');
            LoadCart(); GetUser();
        }
        else
            return;
    }
}
// Login / Logout / Register / User
const userInterface = document.getElementById('user_interface');
const closeUserInterface = document.getElementById('close_login_form');
const login = document.getElementById('login_form');
const closeRegister = document.getElementById('back_to_login');
const register = document.getElementById('register');
const createAccount = document.getElementById('register_form');
const userSettings = document.getElementById('user_settings');
const editUser = document.getElementById('edit_user');
const closeEditUser = document.getElementById('close_edit_user');
const logout = document.getElementById('logout');

// Modals
const about = document.getElementById('about');
const closeAbout = document.getElementById('close_about_modal');
const registerModal = document.getElementById('register_modal');
const privacy = document.getElementById('privacy');
const closePrivacy = document.getElementById('privacy_close');
const termsNconditions = document.getElementById('terms&conditions');
const closeTermsNcondtions = document.getElementById('terms_conditions_close');
const contactUs = document.getElementById('contact_us');
const sendContactUs = document.getElementById('contact_us_form');
const closeContactUs = document.getElementById('contact_us_close');
const editUserReq = document.getElementById('edit_user_form');
const booksContainer = document.getElementById('book_container');
const closeBookInfo = document.getElementById('book_information_close');

// Functionally
const cart = document.getElementById('cart');
const closeCart = document.getElementById('cart_close');
const addBookCart = document.getElementById('add_book_cart');
const searchBook = document.getElementById('search_filter');
const buyBooks = document.getElementById('buy_books');
const nextPage = document.getElementById('next_page');
const prevPage = document.getElementById('prev_page');

//***************************************************** Modals *********************************************************** */

/**
 * Opens 'Login/Register' modal and blocks any other background activity.
 */
userInterface.addEventListener('click', ()=>{
    document.getElementById('login_register').className = 'visible_modal';
    document.getElementById('block_background').className = 'visible_background';
});

/**
 * Closes the 'Login/Register' modal and returns the background activity.
 */
closeUserInterface.addEventListener('click',()=>{
    document.getElementById('login_register').className = 'hidden';
    document.getElementById('block_background').className = 'hidden';
})

/**
 * Opens the 'About' modal and blocks any other background activity.
 */
about.addEventListener('click',()=>{
    document.getElementById('about_modal').className = 'visible_modal';
    document.getElementById('block_background').className = 'visible_background';
});

/**
 * Closes the 'About' modal and returns the background activity.
 */
closeAbout.addEventListener('click', ()=>{
    document.getElementById('about_modal').className = 'hidden';
    document.getElementById('block_background').className = 'hidden';
});

/**
 * Opens the 'Register' modal.
 */
register.addEventListener('click',(e)=>{
    e.preventDefault();
    document.getElementById('register_modal').className = 'visible_modal';
    document.getElementById('login_register').className = 'hidden';
});

/**
 * Closes the 'Register' modal and returns to 'Login' modal.
 */
closeRegister.addEventListener('click',()=>{
    document.getElementById('login_register').className = 'visible_modal';
    document.getElementById('register_modal').className = 'hidden';
});

/**
 * Opens the 'Privacy' modal.
 */
privacy.addEventListener('click',()=>{
    document.getElementById('privacy_modal').classList.remove('hidden');
    document.getElementById('block_background').className = 'visible_background';
});

/**
 * Closes the 'Privacy' modal.
 */
closePrivacy.addEventListener('click',()=>{
    document.getElementById('privacy_modal').className = 'hidden';
    document.getElementById('block_background').className = 'hidden';
});

/**
 * Opens the 'Terms & Conditions' modal.
 */
termsNconditions.addEventListener('click',()=>{
    document.getElementById('terms_conditions_modal').classList.remove('hidden');
    document.getElementById('block_background').className = 'visible_background';
});

/**
 * Closes the 'Terms & Conditions' modal.
 */
closeTermsNcondtions.addEventListener('click',()=>{
    document.getElementById('terms_conditions_modal').className = 'hidden';
    document.getElementById('block_background').className = 'hidden';
});

/**
 * Opens the 'Contact-Us' modal.
 */
contactUs.addEventListener('click',()=>{
    document.getElementById('contact_us_modal').classList.remove('hidden');
    document.getElementById('block_background').className = 'visible_background';
});

/**
 * Closes the 'Contact-Us' modal. Doesn't sent anything.
 */
sendContactUs.addEventListener('submit',(e)=>{
    e.preventDefault();
    document.getElementById('contact_us_modal').className = 'hidden';
    document.getElementById('block_background').className = 'hidden';
    sendContactUs.reset();
})

/**
 * Closes the 'Contact-Us' modal.
 */
closeContactUs.addEventListener('click',()=>{
    document.getElementById('contact_us_modal').className = 'hidden';
    document.getElementById('block_background').className = 'hidden';
});

/**
 * Opens / Closes the user settings.
 */
userSettings.addEventListener('click', ()=>{
    let settingsModal = document.getElementById('user_settings_modal');
    if( settingsModal.style.display === 'flex')
        settingsModal.style.display = 'none';
    else
        settingsModal.style.display = 'flex';
});

/**
 * Opens the 'Edit User' modal.
 */
editUser.addEventListener('click',()=>{
    document.getElementById('edit_user_modal').className = '';
    GetUser();
});

/**
 * Closes the 'Edit User' modal.
 */
closeEditUser.addEventListener('click',()=>{
    document.getElementById('edit_user_modal').className = 'hidden';
});

/**
 * Opens the user Cart modal.
 */
cart.addEventListener('click',()=>{
    document.getElementById('cart_modal').classList.remove('hidden');
    LoadCart();
});

/**
 * Closes the user Cart modal.
 */
closeCart.addEventListener('click', ()=>{
    document.getElementById('cart_modal').className = 'hidden';
});


//********************************************************* SERVER REQUESTS *************************************************************** */

/**
 * Sends an user information request to the server.
 */
async function GetUser()
{
    const res = await fetch('/user/me',{
        method: 'GET',
        headers: { token: localStorage.getItem('token') }
    });
    const data = await res.json();
    editUserReq.children[0].placeholder = data.name;
    editUserReq.children[1].placeholder = data.email;
}

/**
 * Sends an edit request to the server.
 */
editUserReq.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(editUserReq.children[2].value != editUserReq.children[3].value )
    {
        document.getElementById('error_password').innerHTML = 'Passwords are different.'
        return;
    }
    const editInfo = { name: editUserReq.children[0].value, email: editUserReq.children[1].value,password:editUserReq.children[2].value};
    editUserInfo(editInfo);
});

/**
 * Opens a 'Book Modal' and sends a request to the server for the book information.
 */
booksContainer.addEventListener('click',(e)=>{
    if( e.target.id != booksContainer.id && e.target.id != ''){
        const bookInfo = document.getElementById('book_information');
        bookInfo.className = 'book_modal';
        document.getElementById('block_background').className = 'visible_background';
        BookInformation(e.target.parentNode.children[1].innerHTML);
    }
});

/**
 * Closes the 'Book Modal.
 */
closeBookInfo.addEventListener('click', ()=>{
    const bookInfo = document.getElementById('book_information');
    bookInfo.className = 'hidden';
    bookInfo.removeChild(document.getElementById('book_information_title'));
    bookInfo.removeChild(document.getElementById('book_information_description'));
    document.getElementById('block_background').className = 'hidden';
});


//*****************************************  Server Requests  ************************************************\\

/**
 * Sends register credentials to the server. If register succeed login the account.
 */
createAccount.addEventListener('submit',(e)=>{
    e.preventDefault();
    const registerInfo = { name: createAccount.children[0].value, email:createAccount.children[1].value, password: createAccount.children[2].value};
    createAccount.reset();
    RegisterAccount(registerInfo);
});

/**
 * Sends login credentials to the server in order to verify account.
 */
login.addEventListener('submit', (e) =>{
    e.preventDefault();
    const loginInfo = { email: login.children[0].value , password: login.children[1].value };
    Login(loginInfo);
});

/**
 * Sends a login request to the server and returns a user token.
 * @param {User credentials} loginInfo 
 */
async function Login(loginInfo)
{
    const res = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
    });
    const data = await res.json();
    if( !data.Message ){
        localStorage.setItem('token',data.token);
        userInterface.className = 'hidden';
        userSettings.className = ''; userSettings.innerHTML = (data.name).concat(',');
        closeUserInterface.click();
        login.reset();
    }
    else
        document.getElementById('login_error_message').innerHTML = data.Message;
};

/**
 * Sends a register request to the server and returns a user token.
 * @param {User register credentials} registerInfo 
 */
async function RegisterAccount(registerInfo)
{
    const res = await fetch('/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerInfo)
    });
    const data = await res.json();
    if( !data.Message ){
        await Login( {email: registerInfo.email , password: registerInfo.password} );
        registerModal.className = 'hidden';
    }
    else{
        const errorMessage = document.getElementById('register_error_message');
        errorMessage.className = 'error';
        errorMessage.innerHTML = data.Message;
    }
}

/**
 * Edit requests to the server.
 * @param {User credentials} userInfo 
 */
async function editUserInfo(userInfo)
{
    const res = await fetch('/user/me/edit',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { user: userInfo, token: localStorage.getItem('token') })
    });
    const data = await res.json();
    if( data.Message && userInfo.name){
        userSettings.innerHTML = userInfo.name.concat(',');
        closeEditUser.click();
        editUserReq.reset();
        GetUser();
    }
    if( data.Error )
        document.getElementById('error_password').innerHTML = data.Error;   
}

/**
 * Logouts user and clears local storage.
 */
logout.addEventListener('click', ()=>{
    document.getElementById('user_settings_modal').style.display = 'none';
    userInterface.classList.remove('hidden');   userSettings.className = 'hidden';
    Logout();
});

/**
 * Sends a logout request to the server.
 */
async function Logout()
{
    await fetch('/user/logout',{
        method: 'GET',
        headers: { token: localStorage.getItem('token') }
    });
    localStorage.clear();
}

/**
 * Sends a request to the server for all the books in the DB and loads them to the book container.
 */
async function LoadBooks()
{
    const res = await fetch('/books',{
        method: 'GET',
        headers: { user: 'user'}
    });
    const data = await res.json();
    BookResult(data);
}

/**
 * Inserts the books data from Server to the book container.
 * @param {List of book object} books 
 */
function BookResult(books)
{
    if( books.length === 0 ){
        booksContainer.innerHTML = 'No Book Results.';
    }
    for(let i = 0; i < books.length; i++){
        let div = document.createElement('div');
        let img = document.createElement('img'); img.id = 'book' + i;
        let p = document.createElement('p');

        img.src = books[i].image;
        p.innerHTML = books[i].name;
        div.appendChild(img); div.appendChild(p);
        div.className = 'add_book_effect';
        booksContainer.appendChild(div);
    }
}

/**
 * Sends a book request to the server by clicked image and inserts information to the 'Book Modal'.
 * @param {Book name} bookName 
 */
async function BookInformation(bookName)
{
    const res = await fetch('/books/name/' + bookName,{
        method: 'GET'
    });
    const data = await res.json();
    let title = document.createElement('p');
    title.innerHTML = data.name + ', ' + data.author + ' , ' + data.year + ', ' + data.genre;
    let description = document.createElement('p');
    description.innerHTML = data.description;
    title.id = 'book_information_title';  description.id = 'book_information_description';
    
    const bookInfo = document.getElementById('book_information');
    bookInfo.insertBefore(title,document.getElementById('add_book_cart'));
    bookInfo.insertBefore(description,document.getElementById('add_book_cart'));
}

/**
 * Filter search. Sends for every letter a search request 
 */
searchBook.addEventListener('keyup',()=>{
    if(searchBook.value.length > 0)
        SearchBook(searchBook.value);
    else
        SearchBook('*');
});

/**
 * Sends a search request to the server.
 * @param {Book name} book 
 */
async function SearchBook(book)
{
    const res = await fetch('/books/search/'+ book ,{
        method: 'GET'
    });
    const data = await res.json();
    booksContainer.innerHTML = '';
    BookResult(data);
}

/**
 * Sends a 'Load Cart' to the server.
 */
async function LoadCart()
{
    const res = await fetch('/user/cart', {
        method: 'GET',
        headers: { token: localStorage.getItem('token') }
    });
    const data = await res.json();
    if( data.Message ){
        const cartContainer = document.getElementById('cart_book_container');
        cartContainer.innerHTML = 'User not logged in.';
        cartContainer.className = 'cart_book_container_empty';
        cartContainer.style.color = 'red';
        return;
    }
    if( data.length === 0 ){
        const cartContainer = document.getElementById('cart_book_container');
        cartContainer.innerHTML = 'Cart is Empty.';
        cartContainer.className = 'cart_book_container_empty';
    }
    else{
        const cartContainer = document.getElementById('cart_book_container');
        cartContainer.innerHTML = '';
        for(let i = 0; i < data.length; i++){
            let div = document.createElement('div');
            let img = document.createElement('img');
            let p = document.createElement('p'); p.id = 'cart_book_title'
            img.src = data[i].book.image;
            p.innerHTML = data[i].book.name;
            div.appendChild(img); div.appendChild(p);
            cartContainer.appendChild(div);
        }
    }
}

/**
 * Adds a book to the user cart.
 */
addBookCart.addEventListener('click', ()=>{
    let bookName = addBookCart.parentNode.children[1].innerHTML;
    let book = '';
    for(let i = 0; i < bookName.length; i++){
        if( bookName[i] == ',') break;
        book += bookName[i];
    }
    AddBookCart(book);
});

/**
 * Sends a request to the server: 'Adding book to Cart'. And visually adding the book to the cart container.
 * @param {Name of the book} book 
 * @returns 
 */
async function AddBookCart(book)
{
    const res = await fetch('/user/cart/add/'+book, {
        method: 'POST',
        headers: { token: localStorage.getItem('token') }
    });
    const data = await res.json();
    if( data.Message ){
        const bookInfo = document.getElementById('book_information');
        const p = document.createElement('p');
        if( data.Message === 'No Authentication.')
            p.innerHTML = 'User not logged in. Please log in or register.';
        else
            p.innerHTML = 'Book has been already added to the cart.';
        for(let i = 0; i < bookInfo.children.length ; i++){
            if(bookInfo.children[i].id === 'added_book_note' )
                return;
        }   
        bookInfo.insertBefore(p ,document.getElementById('book_information_close'));
        p.id = 'added_book_note';
        setTimeout( ()=>{
            bookInfo.removeChild(p);
        },2500)
    }
    else{
        const cart = document.getElementById('cart');
        const bookInfo = document.getElementById('book_information');
        const p = document.createElement('p'); p.innerHTML = 'Book has been added to the Cart.';

        bookInfo.insertBefore(p ,document.getElementById('book_information_close'));
        p.id = 'added_book_note';
        setTimeout( ()=>{
            bookInfo.removeChild(p);
        },2500)

        cart.classList.add('juggle_move');
        setTimeout(()=>{
            cart.classList.remove('juggle_move');
        },1000)
        LoadCart();
    }
}

/**
 * Clears the cart and fictionally submit a 'Buy'.
 */
buyBooks.addEventListener('click',()=>{
    BuyBooks();
});

/**
 * Send a buying request to the server and clears the cart.
 */
async function BuyBooks()
{
    const res =  await fetch('/user/cart/buy', {
        method: 'POST',
        headers: { token: localStorage.getItem('token') }
    });
    const data = await res.json();
    if( data.Message )
        alert(data.Message);
    else{
        document.getElementById('cart_modal').className = 'hidden';
        alert('Thanks for buying');
    }
}

/**
 * Loads the next book page.
 */
nextPage.addEventListener('click', ()=>{
    let pageNumber = document.getElementById('page_number').innerHTML;
    Pagination(pageNumber,'NEXT');
});

/**
 * Loads the previous page.
 */
prevPage.addEventListener('click',()=>{
    let pageNumber = document.getElementById('page_number').innerHTML;
    Pagination(pageNumber,'PRE');
})

/**
 * Sends a request to the server to load the next or previous page.
 * @param {Page number} pageNumber
 * @param {Previous/Next page} moveTo
 */
async function Pagination(pageNumber,moveTo)
{
    if( searchBook.value.length > 0 ) // Stops pagination incase there is input in search box.
        return;
    if( moveTo === 'NEXT')
        pageNumber++;
    else
        pageNumber--;
    const res = await fetch('/page/'+pageNumber ,{
        method: 'GET'
    });
    const data = await res.json();
    if( data.Message === 'Page out of boundaries.')
        return;
    booksContainer.innerHTML = '';
    const pageNum = document.getElementById('page_number');
    if( moveTo === 'NEXT'){
        pageNum.innerHTML = pageNumber;
        prevPage.classList.remove('hidden');
        if( data.length < 12 )
            nextPage.classList.add('hidden');
    }
    if( moveTo === 'PRE'){
        pageNum.innerHTML = pageNumber;
        nextPage.classList.remove('hidden');
        if( pageNum.innerHTML == 1)
            prevPage.classList.add('hidden');
    }
    BookResult(data);
}