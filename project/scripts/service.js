const userModel = firebase.auth();

const addKeyForAuth = 'AIzaSyA-131Sc54-7JA2T9hhYmBvIdvrE40u2is';
const realTimeDataBase = 'https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/.json';

//createUserWithEmailAndPassword
//signInWithEmailAndPassword
const auth = {

    login(email, password) {

        return userModel.signInWithEmailAndPassword(email, password)
            .then(function(data) {

                localStorage.setItem('auth', JSON.stringify({ uid: data.user.uid, email }));
            }).catch(err => {
                return 'Error';
            })
    },
    register(email, password) {

        return userModel.createUserWithEmailAndPassword(email, password)
            .then(function(data) {

            }).catch(err => {

                return 'Error';
            })
    },
    create(title, type, category, description, image, price, quantity) {

        return fetch(realTimeDataBase, {
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

        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/${id}/.json`, {
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

        let obj = [];

        await fetch(realTimeDataBase)
            .then(res => res.json())
            .then(data => {
                if (data) {

                    Object.entries(data).forEach(el => {

                        obj.push({
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
                    })
                }
            })

        return await obj;
    },

    async getDetails(id) {

        let data = await fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/${id}.json`)
            .then(res => res.json())
            .then(data => {

                let isCreator = false;
                if (data.uid == this.getUserData().uid) {
                    isCreator = true;
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

    getUserData() {

        let data;

        if (localStorage.getItem('auth')) {
            if (localStorage.getItem('buys')) {
                data = {
                    uid: JSON.parse(localStorage.getItem('auth')).uid,
                    email: JSON.parse(localStorage.getItem('auth')).email,
                    isLogged: true,
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
        return data;
    },

    logout() {
        localStorage.removeItem('auth');
        return;
    },

    sendComment(idPost, comment) {

        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/${idPost}/commentSection.json`, {
            method: 'POST',
            body: JSON.stringify({

                comment,
                profile: this.getUserData().email

            })
        }).then(res => res.json())

    },
    async getAllComments(idPost) {
        let comments = [];
        await fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/${idPost}/commentSection.json`)
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
        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/${postId}/likeSection.json`, {
            method: 'POST',
            body: JSON.stringify({
                profile: this.getUserData().email
            })
        }).then(res => res.json());
    },

    async getAllLikes(postId) {

        let likesCounterInfo = {
            likes: 0,
            isLiked: false
        }
        await fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/${postId}/likeSection.json`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    Object.entries(data).forEach(el => {
                        likesCounterInfo.likes = likesCounterInfo.likes + 1;
                        if (this.getUserData().email == el[1].profile) {
                            likesCounterInfo.isLiked = true;
                        }
                    })
                }
            })

        return await likesCounterInfo;
    },

    postUnlike(postId) {

        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/${postId}/likeSection.json`, {
            method: 'DELETE',
            body: JSON.stringify({
                profile: this.getUserData().email
            })
        }).then(res => res.json())
    },

    deleteProduct(id) {
        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/${id}/.json`, {
            method: 'DELETE',
        }).then(res => res.json());
    }

}