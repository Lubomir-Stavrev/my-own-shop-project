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

function getCurrUrlId() {

    let id = window.location.pathname.split('/')[2];

    return id;
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
    if (password.value.length < 6) {
        displayErrorMessage('The password must be at least 6 symbols!', 'registerForm');
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
    let quantity = document.getElementById('create-Quantity').value;
    let type = document.getElementById('create-Type').value;
    let category = document.getElementById('categorySection-Create').value;


    if (title == '' || type == '' || quantity == '' || category == '' || description == '' || image == '' || price == '') {
        displayErrorMessage('You should fill all the fields !', 'createForm');
        return;
    }
    if (title.length > 20) {
        displayErrorMessage('The title SHOULD be no more than 20 letters!', 'createForm');
        return
    }

    auth.create(title, type, category, description, image, price, quantity)
        .then(res => {

            navigate('/home');
        })


}

function editForm(e) {
    e.preventDefault();

    let title = document.getElementById('edit-Title').value;
    let description = document.getElementById('edit-Description').value;
    let image = document.getElementById('edit-Image').value;
    let price = document.getElementById('edit-Price').value;
    let quantity = document.getElementById('edit-Quantity').value;
    let type = document.getElementById('edit-Type').value;
    let category = document.getElementById('categorySection-Edit').value;


    if (title == '' || type == '' || quantity == '' || category == '' || description == '' || image == '' || price == '') {
        displayErrorMessage('You should fill all the fields !', 'editForm');
        return;
    }
    if (title.length > 20) {
        displayErrorMessage('The title SHOULD be no more than 20 letters!', 'editForm');
        return
    }
    let id = getCurrUrlId();
    auth.edit(title, type, description, image, price, quantity, category, id)
        .then(res => {

            navigate(`/details/${id}`);
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

function changeCategoryTitle(e) {
    e.preventDefault();

    let url = new URL(e.target.parentNode.href).pathname.split('/');

    let categoryChange = url[url.length - 1];

    let categoryTitle = document.getElementById('category-Name-Container');

    categoryChange = categoryChange.replace('-', ' ');
    categoryTitle.innerHTML = `<h3 id="categories-Name">${categoryChange}</h3>`;
    navigate('/home', categoryChange);
}

function searchAndDisplayProducts(e) {
    e.preventDefault();

    let searchInput = document.getElementById('searchInput').toLowerCase();
    let currPageProducts = [...document.getElementById('posts').children];

    currPageProducts.forEach(ch => {
        let title = ch.querySelector('h1') ? ch.querySelector('h1').innerText : '';

        if (!searchInput.value) {
            ch.style.display = 'inline-block';
        } else if (!title.includes(searchInput.value)) {
            ch.style.display = 'none';
        } else if (title.includes(searchInput.value)) {
            ch.style.display = 'inline-block';
        }
    })
    let productsCounter = currPageProducts.length - 1;
    currPageProducts.forEach(ch => {

        if (productsCounter == 0) {
            let message = document.createElement('h1');
            message.innerText = 'There is no such a product!';
            document.getElementById('posts').appendChild(message);
        }
        if (ch.style.display == 'none') {
            productsCounter--;
        }
    })
    if (productsCounter > 0) {
        let allPosts = document.getElementById('posts');
        allPosts.removeChild(allPosts.lastChild);
    }

}

function giveAdmin(e) {

    e.preventDefault();
    let email = e.target.parentNode.href.split('/')[4];
    let id = e.target.parentNode.href.split('/')[5];

    auth.giveAdminRights(email, id).then(res => {
        navigate('/profile');
    })
}

function removeAdmin(e) {

    e.preventDefault();
    let email = e.target.parentNode.href.split('/')[4];
    let id = e.target.parentNode.href.split('/')[5];

    auth.removeAdminRights(email, id).then(res => {
        navigate('/profile');
    })
}


registerPartial();