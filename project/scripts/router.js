const appElement = document.getElementById('app');

let profilesWithAdminRight = ['pesho@mail.bg', 'pesho123@mail.bg'];


const routs = {
    'home': '../templates/homePage.hbs',
    'login': '../templates/login.hbs',
    'register': '../templates/register.hbs',
    'aboutPage': '../templates/aboutPage.hbs',
    'contactPage': '../templates/contactPage.hbs',
    'create': '../templates/createPage.hbs',
    'details': '../templates/productDetails.hbs',
    'edit': '../templates/editPage.hbs',
    'imagePreview': '../templates/imagesPreview.hbs',
    'cart': '../templates/shoppingCart.hbs',
    'paymentPage': '../templates/paymentPage.hbs',
    'profile': '../templates/profile.hbs',

}



async function router(path, condition) {
    let tempData = await auth.getUserData();
    globalThis.tempData = tempData;

    switch (path) {
        case 'logout':
            auth.logout();
            navigate('/home');
            return;
        case 'home':
            let productsData = await auth.getAllProducts();

            if (condition) {
                let choosenCategoryName = condition;

                if (choosenCategoryName == 'All Categories') {

                    tempData.products = productsData.all;

                } else if (choosenCategoryName == 'Accessories Women') {
                    tempData.products = productsData.categories.accessoriesWomen;
                } else if (choosenCategoryName == 'Accessories Men') {
                    tempData.products = productsData.categories.accessoriesMen;
                } else if (choosenCategoryName == 'Clothes Women') {
                    tempData.products = productsData.categories.clothesWomen;
                } else if (choosenCategoryName == 'Clothes Men') {
                    tempData.products = productsData.categories.clothesMen;
                }
                tempData.categoryName = choosenCategoryName;
            } else {
                tempData.products = productsData.all;
            }


            break;
        default:
            break;
    }

    if (path.includes('details/')) {
        let id = path.split('/')[1];
        let data = await auth.getDetails(id);
        let allComments = await auth.getAllComments(id);
        let allLikes = await auth.getAllLikes(id);

        commentSectionControl(tempData, allComments, condition);

        Object.assign(tempData, allLikes);
        Object.assign(tempData, data);
        path = 'details';
    } else if (path.includes('edit/')) {
        let id = path.split('/')[1];
        let data = await auth.getDetails(id);

        Object.assign(tempData, data);
        path = 'edit';
    } else if (path.includes('profile')) {
        tempData.users = await auth.getAllRegisteredUsers();
    }

    getTemplate(path)
        .then(res => {

            let template = Handlebars.compile(res);
            let htmlResult = template(tempData);
            appElement.innerHTML = htmlResult;
        })
}

function commentSectionControl(tempData, allComments, condition) {
    tempData.comments = allComments;
    if (condition == 'block') {
        tempData.sectionCondition = 'Hide';
    } else {
        tempData.sectionCondition = 'See';
    }
    tempData.displayStyle = condition;
}

function getTemplate(path) {
    let tempPath = routs[path];

    return fetch(tempPath)
        .then(res => res.text());
}

function navigate(direction, condition) {

    history.pushState('', {}, direction);

    router(direction.slice(1), condition);
}


navigate('/home');