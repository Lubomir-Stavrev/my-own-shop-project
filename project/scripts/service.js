const userModel = firebase.auth();

const addKeyForAuth = 'AIzaSyA-131Sc54-7JA2T9hhYmBvIdvrE40u2is';
const productsURL = 'https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products.json';
const usersURL = 'https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/users.json';


const auth = {

    login(email, password) {

        return userModel.signInWithEmailAndPassword(email, password)
            .then(function(data) {

                localStorage.setItem('auth', JSON.stringify({ uid: data.user.uid, email }));
            }).catch(err => {
                return 'Error';
            })
    },
    async register(email, password) {

        return await userModel.createUserWithEmailAndPassword(email, password)
            .then(async function(data) {
                await fetch(usersURL, {
                    method: 'POST',
                    body: JSON.stringify({
                        admin: false,
                        email,
                    })
                })
            }).catch(err => {

                return 'Error';
            })
    },
    create(title, type, category, description, image, price, quantity) {

        return fetch(productsURL, {
            method: 'POST',
            body: JSON.stringify({
                title,
                type,
                category,
                description,
                image,
                price,
                quantity,
                uid: this.getUserData().uid
            })
        }).then(res => res.json());
    },

    edit(title, type, description, image, price, quantity, category, id) {

        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${id}/.json`, {
            method: 'PATCH',
            body: JSON.stringify({
                title,
                type,
                description,
                image,
                price,
                quantity,
                category
            })
        }).then(res => res.json());
    },

    async getAllProducts() {

        let allData = [];
        let allProducts = [];

        let allCategories = {
            accessoriesWomen: [],
            accessoriesMen: [],
            clothesMen: [],
            clothesWomen: []
        }

        await fetch(productsURL)
            .then(res => res.json())
            .then(data => {
                if (data) {

                    Object.entries(data).forEach(el => {

                        allData.push({
                            uid: el[1].uid,
                            productId: el[0],
                            title: el[1].title,
                            description: el[1].description,
                            image: el[1].image,
                            price: el[1].price,
                            category: el[1].category,
                            type: el[1].type,
                            quantity: el[1].quantity
                        })
                        if (el[1].category == 'Accessories-Men') {
                            allCategories.accessoriesMen.push({
                                uid: el[1].uid,
                                productId: el[0],
                                title: el[1].title,
                                description: el[1].description,
                                image: el[1].image,
                                price: el[1].price,
                                category: el[1].category,
                                type: el[1].type,
                                quantity: el[1].quantity
                            })
                        } else if (el[1].category == 'Accessories-Women') {
                            allCategories.accessoriesWomen.push({
                                uid: el[1].uid,
                                productId: el[0],
                                title: el[1].title,
                                description: el[1].description,
                                image: el[1].image,
                                price: el[1].price,
                                category: el[1].category,
                                type: el[1].type,
                                quantity: el[1].quantity
                            })

                        } else if (el[1].category == 'Clothes-Women') {
                            allCategories.clothesWomen.push({
                                uid: el[1].uid,
                                productId: el[0],
                                title: el[1].title,
                                description: el[1].description,
                                image: el[1].image,
                                price: el[1].price,
                                category: el[1].category,
                                type: el[1].type,
                                quantity: el[1].quantity
                            })

                        } else if (el[1].category == 'Clothes-Men') {
                            allCategories.clothesMen.push({
                                uid: el[1].uid,
                                productId: el[0],
                                title: el[1].title,
                                description: el[1].description,
                                image: el[1].image,
                                price: el[1].price,
                                category: el[1].category,
                                type: el[1].type,
                                quantity: el[1].quantity
                            })
                        }
                    })
                }
            })
        allProducts.all = allData
        allProducts.categories = allCategories;
        return await allProducts
    },

    async getDetails(id) {

        let data = await fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json`)
            .then(res => res.json())
            .then(data => {

                let isCreator = false;
                if (JSON.parse(localStorage.getItem('auth'))) {
                    if (data.uid == JSON.parse(localStorage.getItem('auth')).uid) {
                        isCreator = true;
                    }
                }
                return {
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    quantity: data.quantity,
                    type: data.type,
                    category: data.category,
                    image: data.image,
                    uid: data.uid,
                    productId: id,
                    isCreator
                }
            })

        return await data;
    },

    async getUserData() {

        let data;

        if (localStorage.getItem('auth')) {
            if (localStorage.getItem('buys')) {
                data = {
                    uid: JSON.parse(localStorage.getItem('auth')).uid,
                    email: JSON.parse(localStorage.getItem('auth')).email,
                    isLogged: true,
                    buys: [],
                }
                if (JSON.parse(localStorage.getItem('buys'))) {

                    Object.entries(JSON.parse(localStorage.getItem('buys')))
                        .forEach(el => {

                            if (!data.buys.includes(el[1])) {
                                data.buys.push(el[1]);
                            }
                        })
                }

            } else {
                data = {
                    uid: JSON.parse(localStorage.getItem('auth')).uid,
                    email: JSON.parse(localStorage.getItem('auth')).email,
                    isLogged: true
                }
            }
        } else {
            data = {
                isLogged: false,
                buys: []
            }
            if (JSON.parse(localStorage.getItem('buys'))) {

                Object.entries(JSON.parse(localStorage.getItem('buys')))
                    .forEach(el => {

                        if (!data.buys.includes(el[1])) {
                            data.buys.push(el[1]);
                        }
                    })
            }

        }
        if (data.email) {

            await fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/users.json`)
                .then(res => res.json())
                .then(userData => {
                    if (userData) {

                        Object.entries(userData)
                            .forEach(el => {
                                if (el[1].email == data.email) {
                                    if (el[1].admin == true) {
                                        data.isAdmin = true;
                                    } else {
                                        data.isAdmin = false;
                                    }
                                }
                            })
                    }
                })
        }
        return data;
    },

    logout() {
        localStorage.removeItem('auth');
        return;
    },

    sendComment(idPost, comment) {

        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${idPost}/commentSection.json`, {
            method: 'POST',
            body: JSON.stringify({

                comment,
                profile: JSON.parse(localStorage.getItem('auth')).email

            })
        }).then(res => res.json())

    },
    async getAllComments(idPost) {
        let comments = [];
        await fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${idPost}/commentSection.json`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    Object.entries(data).forEach(el => {
                        comments.push({
                            comment: el[1].comment,
                            profile: el[1].profile
                        })
                    })
                }
            })
        return await comments;
    },

    postLike(postId) {
        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${postId}/likeSection.json`, {
            method: 'POST',
            body: JSON.stringify({
                profile: JSON.parse(localStorage.getItem('auth')).email
            })
        }).then(res => res.json());
    },

    async getAllLikes(postId) {

        let likesCounterInfo = {
            likes: 0,
            isLiked: false
        }
        await fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${postId}/likeSection.json`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    Object.entries(data).forEach(el => {
                        likesCounterInfo.likes = likesCounterInfo.likes + 1;
                        let currEmail = '';
                        if (JSON.parse(localStorage.getItem('auth'))) {
                            currEmail = JSON.parse(localStorage.getItem('auth')).email;

                        }
                        if (currEmail == el[1].profile) {
                            likesCounterInfo.isLiked = true;
                        }
                    })
                }
            })

        return await likesCounterInfo;
    },

    postUnlike(postId) {

        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${postId}/likeSection.json`, {
            method: 'DELETE',
            body: JSON.stringify({
                profile: JSON.parse(localStorage.getItem('auth')).email
            })
        }).then(res => res.json())
    },

    deleteProduct(id) {
        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${id}/.json`, {
            method: 'DELETE',
        }).then(res => res.json());
    },

    async getAllRegisteredUsers() {

        let users = [];
        let currEmail = JSON.parse(localStorage.getItem('auth')).email;

        await fetch(usersURL)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    Object.entries(data).forEach(el => {

                        if (el[1].email != currEmail) {

                            users.push({
                                userEmail: el[1].email,
                                admin: el[1].admin,
                                userId: el[0],
                            })
                        }
                    })

                }
            })

        return await users;
    },
    giveAdminRights(email, id) {
        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/users/${id}/.json`, {
            method: 'PATCH',
            body: JSON.stringify({
                email,
                admin: true
            })
        })
    },
    removeAdminRights(email, id) {
        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/users/${id}/.json`, {
            method: 'PATCH',
            body: JSON.stringify({
                email,
                admin: false
            })
        })
    }

}