'use strict'
console.log("form:", document.getElementById("loginForm"));
console.log("captcha:", document.getElementById("captchaText"));
console.log("refresh:", document.getElementById("refreshCaptcha"));

//============== select element ==============
const allSections = document.querySelectorAll('.section');
const navLinks = document.querySelector('.nav__links');
const imgTargets = document.querySelectorAll('img[data-src]');

//============== scrolling function ==============
if (navLinks) {
    navLinks.addEventListener('click', function (e) {
        e.preventDefault();

        if (e.target.classList.contains('navbar-link')) {
            const id = e.target.getAttribute('href');

            const target = document.querySelector(id);

            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

//============== Reveal sections ==============
if (allSections.length > 0) {

    const revealSections = function (entries, observer) {
        const [entry] = entries;

        if (!entry.isIntersecting) return;

        entry.target.classList.remove('section--hidden');
        observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(revealSections, {
        root: null,
        threshold: 0.20
    });

    allSections.forEach(section => {
        sectionObserver.observe(section);
        section.classList.add('section--hidden');
    });
}

//============== Lazy loading Images ==============
if (imgTargets.length > 0) {

    const loadImgSection = (entries, observer) => {
        const [entry] = entries;

        if (!entry.isIntersecting) return;

        entry.target.src = entry.target.dataset.src;

        entry.target.addEventListener('load', () => {
            entry.target.classList.remove('lazy-img');
        });

        observer.unobserve(entry.target);
    };

    const imageObserver = new IntersectionObserver(
        loadImgSection,
        {
            root: null,
            threshold: 0,
            rootMargin: '1000px'
        }
    );

    imgTargets.forEach(img => imageObserver.observe(img));
}

//*............... BLOG CODES .................
let posts = [];

function displayPosts() {
    const blogContainer = document.getElementById('blogContainer');
    const postDetailView = document.getElementById('postDetailView');

    blogContainer.style.display = 'block';
    postDetailView.style.display = 'none';

    blogContainer.innerHTML = '';

    if (posts.length === 0) {
        blogContainer.innerHTML = '<p>There are no posts!</p>';
        return;
    }

    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.classList.add('blog-post');

        let imageHtml = '';
        if (post.imageUrl) {
            imageHtml = `<img src="${post.imageUrl}" alt="${post.title}" style="max-width: 150px; height: auto;">`;
        }

        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Category:</strong> ${post.category}</p>
            ${imageHtml}
            <p>${post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}</p>
            <button onclick="showPostDetail(${index})">View details..</button>
            <hr>
        `;

        blogContainer.appendChild(postElement);
    });
}

function showPostDetail(index) {
    const blogContainer = document.getElementById('blogContainer');
    const postDetailView = document.getElementById('postDetailView');

    const post = posts[index];
    if (!post) return;

    document.getElementById('detailTitle').textContent = post.title;
    document.getElementById('detailCategory').textContent = post.category;
    document.getElementById('detailContent').textContent = post.content;

    const detailImage = document.getElementById('detailImage');
    if (post.imageUrl) {
        detailImage.src = post.imageUrl;
        detailImage.style.display = 'block';
    } else {
        detailImage.style.display = 'none';
    }

    blogContainer.style.display = 'none';
    postDetailView.style.display = 'block';
}

function hidePostDetail() {
    document.getElementById('postDetailView').style.display = 'none';
    document.getElementById('blogContainer').style.display = 'block';
}

const postForm = document.getElementById('postForm');

if (postForm) {

    postForm.addEventListener('submit', function (e) {

        e.preventDefault();

        const formData = new FormData(this);

        const title = formData.get('title').trim();
        const content = formData.get('content').trim();
        const category = formData.get('category');
        const imageFile = formData.get('image');

        const titleInput = document.getElementById('title');
        const contentInput = document.getElementById('content');

        titleInput.classList.remove('error');
        contentInput.classList.remove('error');

        if (title.length < 5) {
            alert("عنوان باید حداقل ۵ کاراکتر باشد.");
            titleInput.classList.add('error');
            return;
        }

        if (content.length < 10) {
            alert("متن پست باید حداقل ۱۰ کاراکتر باشد.");
            contentInput.classList.add('error');
            return;
        }

        let imageUrl = null;

        if (imageFile && imageFile.size > 0) {

            if (!imageFile.type.startsWith('image/')) {
                alert("لطفاً فقط فایل تصویری آپلود کنید.");
                return;
            }

            imageUrl = URL.createObjectURL(imageFile);
        }

        posts.push({
            title,
            content,
            category,
            imageUrl
        });

        displayPosts();
        this.reset();
    });

    displayPosts();
}

//*-------------- LOGIN FORM ----------------------
const captchaText = document.getElementById("captchaText");
const refreshCaptchaBtn = document.getElementById("refreshCaptcha");

let captchaCode = "";

function generateCaptcha() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    captchaCode = "";

    for (let i = 0; i < 6; i++) {
        captchaCode += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    captchaText.textContent = captchaCode;
}

generateCaptcha();

refreshCaptchaBtn.addEventListener("click", function () {
    generateCaptcha();
});

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let captchaInput = document.getElementById("captchaInput").value;
    let message = document.getElementById("message");

    if (password !== confirmPassword) {
        message.textContent = "Password and repeat are not the same!";
        return;
    }

    if (captchaInput !== captchaCode) {
        message.textContent = "Captcha is incorrect!";

        generateCaptcha();

        document.getElementById("captchaInput").value = "";
        return;
    }

    window.location.href = "index.html";
});


//*--------- Connected Firebase to Rejister ----------
let userName = document.getElementById('username');
let passwordx = document.getElementById('password');

function addUsers() {
    event.preventDefault();
    let newUser = {
        userName: userName.value,
        passwordx: passwordx.value
    }
    // console.log('!');
    console.log(newUser);


    fetch(`https://personalweb-cb8ef-default-rtdb.asia-southeast1.firebasedatabase.app/users.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally()

}

