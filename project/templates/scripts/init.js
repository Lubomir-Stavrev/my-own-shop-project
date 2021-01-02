function registerPartial() {

    let header = document.getElementById('headerTemp').innerHTML;
    let footer = document.getElementById('footerTemp').innerHTML;
    let headerNotHome = document.getElementById('headerNotHomeTemp').innerHTML;

    Handlebars.registerPartial('header', header);
    Handlebars.registerPartial('footer', footer);
    Handlebars.registerPartial('headerNotHome', headerNotHome);
}

function navigateHandler(e) {
    e.preventDefault();

    if (e.target.tagName == 'BUTTON' || e.target.tagName == 'LI' || e.target.tagName == 'IMG') {
        let url = new URL(e.target.parentNode.href);
        navigate(url.pathname);
    }
    if (e.target.tagName == 'A') {
        let url = new URL(e.target.href);
        navigate(url.pathname);
    }
    return;
}

function changeColorOnHover(e) {
    e.preventDefault();
    let row = [...document.getElementsByTagName('tr')];

    row.forEach(r => {
        r.addEventListener('mouseover', event => {

            console.log(event.target);
        })
    })

}

function registerForm(e) {
    e.preventDefault();

    let email = document.getElementById('register-Email');
    let password = document.getElementById('register-Password');
    let rePassword = document.getElementById('register-RePassword');

    if (password.value != rePassword.value) {
        displayErrorMessage('The passwords must be the same!', 'registerForm');
        password.value = '';
        rePassword.value = '';
        return;
    }

    auth.register(email.value, password.value)
        .then(res => {
            if (res == 'Error') {
                displayErrorMessage('The email is already taken!', 'registerForm');
                return;
            }
            navigate('/login');
        })
}

function loginForm(e) {
    e.preventDefault();

    let email = document.getElementById('login-Email');
    let password = document.getElementById('login-Password');

    auth.login(email.value, password.value)
        .then(res => {
            if (res == 'Error') {
                displayErrorMessage('The email or password is invalid !', 'loginForm');
                return;
            }
            navigate('/home');
        })
}

function displayErrorMessage(message, formId) {

    let p = document.createElement('p');
    p.setAttribute('id', 'errorBox')
    p.textContent = message;
    let form = document.getElementById(formId);

    form.insertBefore(p, form.firstChild);

    setTimeout(function() {
        form.removeChild(p);
    }, 4000)
}

function createForm(e) {
    e.preventDefault();

    let title = document.getElementById('create-Title').value;
    let description = document.getElementById('create-Description').value;
    let image = document.getElementById('create-Image').value;
    let price = document.getElementById('create-Price').value;


    if (title == '' || description == '' || image == '' || price == '') {
        displayErrorMessage('You should fill all the fields !', 'createForm');
        return;
    }
    if (title.length > 20) {
        displayErrorMessage('The title SHOULD be no more than 20 letters!', 'createForm');
        return
    }

    auth.create(title, description, image, price)
        .then(res => {

            navigate('/home');
        })


}


function showCommentSection(e) {
    if (e) {

        e.preventDefault();
    }

    let commentSection = document.getElementById('comment-Container');

    if (commentSection.style.display == 'block') {
        e.target.textContent = 'See Comments'
        commentSection.style.display = 'none'
    } else {
        e.target.textContent = 'Hide Comments'
        commentSection.style.display = 'block'
        window.scrollTo(0, document.body.scrollHeight);
    }
}


function scrollToEnd(e) {
    e.preventDefault();

    document.getElementById('comment-Section').scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function postComment(e) {
    e.preventDefault();

    let comment = document.getElementById('comment-Area');
    let postId = e.target.parentNode.href.split('/')[4];

    if (comment.value == '' || comment.value == null || !comment.value.trim()) {
        return;
    }
    auth.sendComment(postId, comment.value)
        .then(res => {

            comment.value = '';
            navigate(`/details/${postId}`, 'block');

        })
}

function sendLike(e) {
    e.preventDefault();

    let likeId = e.target.parentNode.href.split('/')[4];

    auth.postLike(likeId)
        .then(res => {

            navigate(`/details/${likeId}`)
        })
}

function sendUnlike(e) {
    e.preventDefault();

    let postId = e.target.parentNode.href.split('/')[4];

    auth.postUnlike(postId)
        .then(res => {

            navigate(`/details/${postId}`)
        })
}

function addToCart(e) {
    e.preventDefault();

    let data = {

        description: tempData.description,
        image: tempData.image,
        price: tempData.price,
        productId: tempData.productId,
        title: tempData.title,
        productPath: window.location.href,
        productModel: 'watch'
    }
    var a = [];
    a = JSON.parse(localStorage.getItem('buys')) || [];
    a.push(data);
    localStorage.setItem('buys', JSON.stringify(a));


    navigate('/cart')
}

function requestDelete(e) {
    e.preventDefault();

    let postId = e.target.parentNode.href.split('/')[4];

    auth.deleteProduct(postId).then(res => {
        navigate('/home');
    })
}

function removeProductFromCart(e) {
    e.preventDefault();
    let productIdToRemove = e.target.parentNode.href.split('/')[4];

    let localeStorageBuys = [...JSON.parse(localStorage.getItem('buys'))];
    console.log(localeStorageBuys.length);

    let index = -1;
    Object.entries(localeStorageBuys).forEach(el => {
        index++;
        if (el[1].productId == productIdToRemove) {

            localeStorageBuys.splice(index, 1);
            console.log(localeStorageBuys.length);
            localStorage.setItem('buys', JSON.stringify(localeStorageBuys));
            navigate('/cart')
        }
    })

}




registerPartial();