import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
async function fetchProducts() {
    try {
        const response = await fetch("../../temp/data.json");
        if (!response.ok) {
            throw new Error(`Error network: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.products)) {
            throw new Error("Error data product.");
        }
        const productsContainer = document.querySelector('.products');
        if (productsContainer) {
            productsContainer.innerHTML = '';
        }
        data.products.forEach(product => {
            if (product && productsContainer) {
                const productArticle = document.createElement('article');
                productArticle.classList.add('product');
                productArticle.setAttribute('data-type', product.type_product);
                const productPrice = parseFloat(product.price).toFixed(2);
                const productImage = product.image ? product.image : '../../assets/images/home/default.png';
                const productColorsHTML = product.colors.map(color => `
                    <label class="label">
                        <input type="radio" data-color="${color}" name="color_product_${product.id}" value="${color}" ${color === 'white' ? 'checked' : ''}>
                        <span class="check"></span>
                    </label>
                `).join('');
                productArticle.innerHTML = `
                    <div class="product_content">
                        <button class="button_add_to_favorite" data-id="${product.id}" data-name="${product.name}" data-price="${productPrice}" data-image="${productImage}">
                            <img src="../../assets/images/catalog/icon_heart.svg" alt="Favorite">
                        </button>
                        <div class="product_image">
                            <img src="${productImage}" alt="${product.name}" />
                        </div>
                        <div class="product_colors">
                            ${productColorsHTML}
                        </div>
                        <h2 class="product_name">
                            ${product.name}
                            <div class="shadow"></div>
                        </h2>
                    </div>
                    <button class="button_buy" data-id="${product.id}" data-name="${product.name}" data-price="${productPrice}" data-image="${productImage}">
                        $ ${productPrice}
                    </button>
                `;
                productsContainer.appendChild(productArticle);
                let selectedColor = 'white';
                const colorInputs = productArticle.querySelectorAll(`input[name="color_product_${product.id}"]`);
                colorInputs.forEach(input => {
                    input.addEventListener('change', function() {
                        selectedColor = this.value;
                    });
                });
                productArticle.addEventListener('click', function() {
                    let detailsContainer = document.querySelector('.catalog_preview_model');
                    const type_product = productArticle.getAttribute('data-type');
                    const sizingData = JSON.parse(localStorage.getItem('sizingData')) || {};
                    const selectedSize = sizingData[type_product]?.size || 'XS';
                    const box_product_sizing = document.querySelector('.sizing_popup');
                    if (box_product_sizing) {
                        box_product_sizing.innerHTML = generateSizingMarkup(type_product, selectedSize);
                        updateSizing(type_product);
                    }
                    if (detailsContainer) {
                        detailsContainer.innerHTML = `
                            <div class="content_details" id="prod_details">
                                <p class="price">$ ${productPrice}</p>
                                <div class="buttons">
                                    <button class="button_details" id="handleDetails" data-preview="${product.type_product}" data-color="${selectedColor}">Details</button>
                                    <button class="button_buy" data-id="${product.id}" data-name="${product.name}" data-price="${productPrice}" data-image="${productImage}">Buy</button>
                                </div>
                            </div>
                        `;
                    }
                    // Setting up the pop-up details functionality
                    const handleDetails = document.getElementById("handleDetails");
                    const popup = document.querySelector(".preview_product");
                    const handleClose = document.querySelector(".button_close");
                    const mask = document.querySelector(".mask");
                    const dataDetails = handleDetails.getAttribute('data-preview');
                    const product_details_header = document.getElementById("product_details_header");
                    const product_sizing = document.getElementById("product_details_header_sizing");
                    const product_details_description = document.getElementById("product_details_description");
                    product_details_header.innerHTML = `
                 
                    `;
                    product_sizing.innerHTML = `
                         
                    `;
                    product_details_description.innerHTML = `
                    
                    `;
                    if (handleDetails && popup && handleClose && mask) {
                        handleDetails.addEventListener("click", function(event) {
                            updateMerch(dataDetails, selectedColor);
                            event.stopPropagation();
                            popup.style.display = "flex";
                            product_details_header.innerHTML = `
                                <div class="left_content">
                                    <div class="container_image">
                                        <img src="${productImage}" alt="${product.name}">
                                    </div>
                                    <h2 class="product_name">
                                        ${product.name}
                                    </h2>
                                </div>
                                <div class="right_content">
                                    <p class="price">$ ${productPrice}</p>
                                    <button class="button_buy">buy</button>
                                </div>
                                <div class="line"></div>
                                `;
                            const sizingData = JSON.parse(localStorage.getItem('sizingData')) || {};
                            const selectedSize = sizingData[type_product] ? sizingData[type_product].size : 'XS';
                            product_sizing.innerHTML = `
                                    <h3 class="title">Size</h3>
                                    <div class="sizing_inputs">
                                        <p class="subtitle_sizing_inputs">Sizing Chart</p>
                                        <label>
                                            <input type="radio" name="${type_product}_size" value="XS" ${selectedSize === 'XS' ? 'checked' : ''}>
                                            <span class="name"><span class="bg">XS</span></span>
                                        </label>
                                        <label>
                                            <input type="radio" name="${type_product}_size" value="S" ${selectedSize === 'S' ? 'checked' : ''}>
                                            <span class="name"><span class="bg">S</span></span>
                                        </label>
                                        <label>
                                            <input type="radio" name="${type_product}_size" value="M" ${selectedSize === 'M' ? 'checked' : ''}>
                                            <span class="name"><span class="bg">M</span></span>
                                        </label>
                                        <label>
                                            <input type="radio" name="${type_product}_size" value="L" ${selectedSize === 'L' ? 'checked' : ''}>
                                            <span class="name"><span class="bg">L</span></span>
                                        </label>
                                        <label>
                                            <input type="radio" name="${type_product}_size" value="XL" ${selectedSize === 'XL' ? 'checked' : ''}>
                                            <span class="name"><span class="bg">XL</span></span>
                                        </label>
                                        <label>
                                            <input type="radio" name="${type_product}_size" value="2XL" ${selectedSize === '2XL' ? 'checked' : ''}>
                                            <span class="name"><span class="bg">2XL</span></span>
                                        </label>
                                    </div>
                                `;
                            updateSizing(type_product)
                            product_details_description.innerHTML = `
                                    <h4 class="title">
                                        Description
                                    </h4>
                                    <div class="content_description">
                                        <div class="content_color">
                                            <h5 class="title_color">
                                                Color
                                            </h5>
                                            <div class="buttons_color">
                                                <button class="button_color white" data-color="white"></button>
                                                <button class="button_color black" data-color="black"></button>
                                                <button class="button_color blue" data-color="blue"></button>
                                                <button class="button_color red" data-color="red"></button>
                                            </div>
                                        </div>
            
                                        <div class="content_material">
                                            <h5 class="title_material">
                                                Material
                                            </h5>
                                            <div class="box">
                                                <div class="image_material"></div>
                                                <div class="name_material">100% Pure Cotton</div>
                                            </div>
                                        </div>
            
                                        <div class="content_benefis">
                                            <h5 class="title_benefis">
                                                Benefits
                                            </h5>
                                            <ul class="items">
                                                <li class="item">
                                                <img class="icon" src="../../assets/images/catalog/icon_soft.svg" alt="Soft & Comfortable">
                                                <span>Soft & Comfortable</span>
                                                </li>
                                                <li class="item">
                                                <img class="icon" src="../../assets/images/catalog/icon_durable.svg" alt="Durable">
                                                <span>Durable</span>
                                                </li>
                                                <li class="item">
                                                <img class="icon" src="../../assets/images/catalog/breathable.svg" alt="Breathable">
                                                <span>Breathable</span>
                                                </li>
                                                <li class="item">
                                                <img class="icon" src="../../assets/images/catalog/versatile_icon.svg" alt="Versatile Style">
                                                <span>Versatile Style</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                `;
                            const buttonsColor = document.querySelectorAll('.button_color');
                            buttonsColor.forEach(ButtonColor => {
                                const color = ButtonColor.getAttribute('data-color');
                                console.log(color)
                                ButtonColor.addEventListener('click', function() {
                                    updateMerch(dataDetails, color)
                                });
                            });
                        });
                        mask.addEventListener("click", function() {
                            popup.style.display = "none";
                            const sizingData = JSON.parse(localStorage.getItem('sizingData')) || {};
                            const selectedSize = sizingData[type_product] ? sizingData[type_product].size : 'XS';
                            if (box_product_sizing) {
                                box_product_sizing.innerHTML = generateSizingMarkup(type_product, selectedSize);
                                updateSizing(type_product);
                            }
                        });
                        handleClose.addEventListener("click", function() {
                            popup.style.display = "none";
                            const sizingData = JSON.parse(localStorage.getItem('sizingData')) || {};
                            const selectedSize = sizingData[type_product] ? sizingData[type_product].size : 'XS';
                            if (box_product_sizing) {
                                box_product_sizing.innerHTML = generateSizingMarkup(type_product, selectedSize);
                                updateSizing(type_product);
                            }
                        });
                    }
                });
            } else {
                return null;
            }
        });
        // need fix
        document.querySelectorAll('.button_add_to_favorite').forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const productId = this.getAttribute('data-id');
                const productName = this.getAttribute('data-name');
                const productPrice = this.getAttribute('data-price');
                const productToAdd = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                };
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingProduct = cart.find(item => item.id === productId);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.push(productToAdd);
                }
                alert(`${productName} has been added to the cart`);
                localStorage.setItem('cart', JSON.stringify(cart));
            });
        });
        // need fix
        document.querySelectorAll('.button_buy').forEach(button => {
            const popupCart = document.getElementById("cart")
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const productId = this.getAttribute('data-id');
                const productName = this.getAttribute('data-name');
                const productPrice = this.getAttribute('data-price');
                const productToAdd = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                };
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingProduct = cart.find(item => item.id === productId);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.push(productToAdd);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart()
                popupCart.style.display = "flex";
            });
        });
    } catch (error) {
        console.error('Data error:', error);
    }
}

function updateSizing(type_product) {
    const sizingData = JSON.parse(localStorage.getItem('sizingData')) || {};
    sizingData[type_product] = sizingData[type_product] || {
        size: 'XS'
    };
    document.querySelectorAll(`input[name="${type_product}_size"]`).forEach(input => {
        input.addEventListener('change', function() {
            sizingData[type_product].size = this.value;
            localStorage.setItem('sizingData', JSON.stringify(sizingData));
        });
    });
}

function generateSizingMarkup(type_product, selectedSize) {
    return `
        <div class="sizing_inputs">
            <p class="subtitle_sizing_inputs">Size: ${type_product}</p>
            ${['XS', 'S', 'M', 'L', 'XL', '2XL'].map(size => `
                <label>
                    <input type="radio" name="${type_product}_size" value="${size}" ${selectedSize === size ? 'checked' : ''}>
                    <span class="name"><span class="bg">${size}</span></span>
                </label>
            `).join('')}
        </div>
    `;
}
const home = document.getElementById("home");
const catalog = document.getElementById("catalog");
let hiddenMeshes = ['jeans', 'Mesh007_1', 'Mesh001', 'tank_top', 'laces_pants', 'laces_hoody_cap', 'Mesh004', 'Mesh004_1', 'shorts_long', 'Mesh005', 'Mesh005_1', 'laces_hoody', 'Mesh007', 'Mesh007_1', 'short_lace', 'sleeve2', 'sleeve', 'hoody_cap', 'hoody', 'pants'];
let modelWidth;
let modelHeight;
let ModelX = 0;
let ModelY = 1;
let ModelZ = 1.7;
if (home) {
    modelWidth = 400;
    modelHeight = 800;
    initialize3DModel({
        canvasSelector: '.model',
        modelUrl: `${window.location.origin}/assets/models/mannequin/man.gltf`,
        modelWidth: modelWidth,
        modelHeight: modelHeight,
        cameraPosition: {
            x: ModelX,
            y: ModelY,
            z: ModelZ
        },
        hiddenMeshes: hiddenMeshes
    });
}
if (catalog) {
    modelWidth = 400;
    modelHeight = 800;
    ModelZ = 1.9;
    ModelY = 0.6;
}
const colorUpdate = (color) => {
    const colorMap = {
        white: 0xffffff,
        black: 0x000000,
        yellow: 0xd1d393,
        green: 0x98dace,
        purple: 0x9e95d6,
        burlywood: 0xdfb49b,
        blue: 0xA0E4E8,
        red: 0xB83131
    };
    return colorMap[color] || 0x000000;
};
let model;
let model2;

function initialize3DModel({
    canvasSelector,
    modelUrl,
    modelWidth = 400,
    modelHeight = 800,
    cameraPosition = {
        x: 0,
        y: 1,
        z: 1.7
    },
    hiddenMeshes = []
}) {
    return new Promise((resolve, reject) => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, modelWidth / modelHeight, 0.5, 1000);
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        const canvas = document.querySelector(canvasSelector);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(modelWidth, modelHeight);
        // Lumina
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.position.set(3, 10, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = -2;
        dirLight.shadow.camera.left = -2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        scene.add(dirLight);
        const loader = new GLTFLoader();
        loader.load(
            modelUrl,
            (gltf) => {
                const loadedModel = gltf.scene;
                loadedModel.position.set(0, -1.25, 0);
                const hiddenMeshesSet = new Set(hiddenMeshes);
                const emissiveMaterial = new THREE.MeshStandardMaterial({
                    color: 0x2e2e2e,
                    metalness: 0,
                    roughness: 0.2,
                    emissive: 0x000000,
                    emissiveIntensity: 0.05
                });
                loadedModel.traverse((child) => {
                    console.log(child.name)
                    // if(child.name === "l1_hand"){
                    //     child.rotation.y = -1;  
                    // }
                    if (child.name === "body" && child.isMesh) {
                        child.material = emissiveMaterial;
                    }
                    if (hiddenMeshesSet.has(child.name)) {
                        child.visible = false;
                    }
                });
                scene.add(loadedModel);
                if (!model) {
                    model = loadedModel;
                    console.log('Initialized model1:', model);
                } else {
                    model2 = loadedModel;
                    console.log('Initialized model2:', model2);
                }
                resolve(loadedModel);
            },
            undefined,
            (error) => {
                console.error('An error occurred:', error);
                reject(error);
            }
        );
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.minPolarAngle = Math.PI / 2;
        controls.maxPolarAngle = Math.PI / 2;
        controls.enablePan = false;

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = modelWidth / modelHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(modelWidth, modelHeight);
        });
    });
}
async function findProducts() {
    return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
            const products = document.querySelectorAll('.product');
            if (products.length > 0) {
                observer.disconnect();
                resolve(products);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
async function uploadModel() {
    const hiddenMeshes2 = ['jeans', 'Mesh007_1', 'Mesh001', 'tank_top', 'laces_pants', 'laces_hoody_cap', 'Mesh004', 'Mesh004_1', 'shorts_long', 'Mesh005', 'Mesh005_1', 'laces_hoody', 'Mesh007', 'Mesh007_1', 'short_lace', 'sleeve2', 'sleeve', 'hoody_cap', 'hoody', 'pants', 't-shirt', 'short_s'];
    model2 = await initialize3DModel({
        canvasSelector: '.model2',
        modelUrl: `${window.location.origin}/assets/models/mannequin/man.gltf`,
        modelWidth: 250,
        modelHeight: 550,
        cameraPosition: {
            x: 0,
            y: 1,
            z: 1.7
        },
        hiddenMeshes: hiddenMeshes2
    });
}
uploadModel()

function updateMerch(merch, color) {
    if (model2) {
        model2.traverse((child) => {
            if (child.name === "body" || child.name === "Scene") {
                child.visible = true;
            } else if (child.name === merch) {
                child.visible = true;
            } else {
                child.visible = false;
            }
            if (merch && color) {
                if (child.name === merch) {
                    child.material.color.set(colorUpdate(color))
                }
            }
        });
    }
}
async function catalogFunctions() {
    const products = await findProducts();
    let model = await initialize3DModel({
        canvasSelector: '.model',
        modelUrl: `${window.location.origin}/assets/models/mannequin/man.gltf`,
        modelWidth: modelWidth,
        modelHeight: modelHeight,
        cameraPosition: {
            x: ModelX,
            y: ModelY,
            z: ModelZ
        },
        hiddenMeshes: hiddenMeshes
    });
    const hiddenUpperMeshes = ['hoody', 'sleeve', 'sleeve2', 'laces_hoody_cap', 'laces_hoody', 't-shirt'];
    const hiddenLowerMeshes = ['pants', 'jeans', 'shorts_long', 'laces_pants', 'Mesh001', 'Mesh004', 'Mesh005', 'short_lace', 'short_s'];
    products.forEach(product => {
        const dataType = product.getAttribute('data-type');
        const dataColor = product.querySelectorAll('input[data-color]');
        dataColor.forEach((colorInput) => {
            const currentColor = colorInput.getAttribute('data-color');
            colorInput.addEventListener("change", function() {
                if (model) {
                    model.traverse((child) => {
                        if (child.name === dataType && child.material) {
                            child.material.color.set(colorUpdate(currentColor));
                        }
                    });
                }
            });
        });

        function resetUpperClothing() {
            if (model) {
                model.traverse((child) => {
                    if (hiddenUpperMeshes.includes(child.name)) {
                        child.visible = false;
                    }
                });
            }
        }

        function resetLowerClothing() {
            if (model) {
                model.traverse((child) => {
                    if (hiddenLowerMeshes.includes(child.name)) {
                        child.visible = false;
                    }
                });
            }
        }

        function updateUpperClothingVisibility(selectedType) {
            resetUpperClothing();
            if (model) {
                model.traverse((child) => {
                    if (child.name === selectedType) {
                        child.visible = true;
                    }
                });
            }
        }

        function updateLowerClothingVisibility(selectedType) {
            resetLowerClothing();
            if (model) {
                model.traverse((child) => {
                    if (child.name === selectedType) {
                        child.visible = true;
                    }
                });
            }
        }
        product.addEventListener('click', () => {
            if (dataType === 'hoody' || dataType === 't-shirt') {
                updateUpperClothingVisibility(dataType);
            } else if (dataType === 'pants' || dataType === "short_s") {
                updateLowerClothingVisibility(dataType);
            }
        });
    });
}
catalogFunctions();
{
    const contentElement = document.querySelector(".preview_content");
    const lightElement = document.querySelector(".preview_light_element");

    function animatePreview(content, light) {
        if (content && light) {
            light.style.opacity = 1;
            setTimeout(function() {
                content.style.opacity = 1;
            }, 500);
        }
    };
    animatePreview(contentElement, lightElement);
}
// Popup cart temp version
{
    const cart = document.querySelector(".cart");
    const mask = document.getElementById("mask");
    if (cart && mask) {
        mask.addEventListener("click", function() {
            cart.style.display = "none";
        });
    }
}
// Popup card address temp version
{
    const closeButtonAdress = document.getElementById("close_adress");
    const maskAdress = document.getElementById("mask_adress");
    const addressPopup = document.querySelector(".address_popup");
    const addAdressButton = document.getElementById("add_address_button");
    if (closeButtonAdress && maskAdress && addressPopup) {
        closeButtonAdress.addEventListener("click", function() {
            addressPopup.style.display = "none";
        });
        maskAdress.addEventListener("click", function() {
            addressPopup.style.display = "none";
        });
        addAdressButton.addEventListener("click", function() {
            addressPopup.style.display = "flex";
        });
    }
}
// Popup card temp version
{
    const BtnBuy = document.getElementById("btn_buy");
    const maskCheckout = document.getElementById("mask_buy");
    const CheckoutPopup = document.querySelector(".checkout_popup");
    const BtnCloseCheckout = document.getElementById("btn_checkout_close");
    if (BtnBuy && maskCheckout && CheckoutPopup && BtnCloseCheckout) {
        BtnBuy.addEventListener("click", function() {
            CheckoutPopup.style.display = "flex";
        });
        maskCheckout.addEventListener("click", function() {
            CheckoutPopup.style.display = "none";
        });
        BtnCloseCheckout.addEventListener("click", function() {
            CheckoutPopup.style.display = "none";
        });
    }
}
// Carousel 
const carousel = document.querySelector('.carousel');
const objects = document.querySelectorAll('.rotating_object');
const container = document.querySelector('.scene');
let angle = 0;
let isAnimating = false;
let currentIndex = 0;
let autoplayInterval;
let isDragging = false;
let startX;
let isAutoplayActive = false;

function updateCarousel(index) {
    const offset = -index * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}

function rotateToObject(objectIndex) {
    if (isAnimating) return;
    isAnimating = true;
    const targetAngle = -((objectIndex - 1.5) * (Math.PI / 3));
    const rotationSpeed = 0.1;
    const animateRotation = () => {
        const delta = targetAngle - angle;
        angle += delta * rotationSpeed;
        if (Math.abs(delta) < 0.001) {
            angle = targetAngle;
            updateCarousel(objectIndex);
            isAnimating = false;
            const currentObject = objects[objectIndex];
            if (currentObject) {
                const color = currentObject.getAttribute('data-color');
                if (model) {
                    model.traverse((child) => {
                        if (child.name === "t-shirt") {
                            child.material.color.set(colorUpdate(color));
                        }
                    });
                }
            }
        } else {
            requestAnimationFrame(animateRotation);
        }
    };
    requestAnimationFrame(animateRotation);
}

function positionObjects() {
    objects.forEach((object, index) => {
        const offsetAngle = angle + (index * (Math.PI / 3));
        const x = Math.cos(offsetAngle) * 160.5;
        const y = Math.sin(offsetAngle) * 100;
        const z = Math.sin(offsetAngle) * 300;
        object.style.transform = `translateX(${x}px) translateZ(${z}px) translateY(${y}px)`;
        object.style.zIndex = Math.round(z + 10);
    });
}
objects.forEach((object, index) => {
    object.addEventListener('click', () => {
        rotateToObject(index);
        pauseAutoplay();
    });
    object.addEventListener('mouseenter', pauseAutoplay);
    object.addEventListener('mouseleave', startAutoplay);
});

function startAutoplay() {
    if (isAutoplayActive) return;
    isAutoplayActive = true;
    autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % objects.length;
        rotateToObject(currentIndex);
    }, 2000);
}

function pauseAutoplay() {
    isAutoplayActive = false;
    clearInterval(autoplayInterval);
}

function onDragStart(event) {
    isDragging = true;
    startX = event.type === 'mousedown' ? event.pageX : event.touches[0].pageX;
    pauseAutoplay();
}

function onDragMove(event) {
    if (!isDragging) return;
    const currentX = event.type === 'mousemove' ? event.pageX : event.touches[0].pageX;
    const diffX = currentX - startX;
    if (Math.abs(diffX) > 20) {
        if (diffX > 0) {
            currentIndex = (currentIndex - 1 + objects.length) % objects.length;
        } else {
            currentIndex = (currentIndex + 1) % objects.length;
        }
        rotateToObject(currentIndex);
        startX = currentX;
    }
}

function onDragEnd() {
    isDragging = false;
    startAutoplay();
}
if (container) {
    container.addEventListener('mousedown', onDragStart);
    container.addEventListener('mousemove', onDragMove);
    container.addEventListener('mouseup', onDragEnd);
    container.addEventListener('mouseleave', onDragEnd);
    container.addEventListener('touchstart', onDragStart);
    container.addEventListener('touchmove', onDragMove);
    container.addEventListener('touchend', onDragEnd);
}
if (carousel) {
    carousel.addEventListener('mouseenter', pauseAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
}

function init() {
    positionObjects();
    startAutoplay();
}
setInterval(positionObjects, 16);
init();

function renderCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart_items');
    cartItemsContainer.innerHTML = '';
    document.querySelector('.set_items span').innerText = `(${cart.length})`;
    if (cart.length > 0) {
        cart.forEach(product => {
            const cartItemHTML = `
                <li class="cart_item">
                    <div class="cart_item_left_box">
                        <div class="cart_item_set">
                            <input type="checkbox" class="select_product" name="name_product_id_${product.id}">
                        </div>
                        <div class="cart_item_image">
                            <img src="../../assets/images/home/shirt1.png" alt="${product.name}">
                        </div>
                        <div class="cart_item_details">
                            <p class="name">${product.name}</p>
                            <div class="cart_item_size">
                                <select name="size_${product.id}" id="">
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="2XL">2XL</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="cart_item_right_box">
                        <p class="cart_item_price">$ ${product.price}</p>
                        <div class="cart_item_settings">
                            <label for="selectQty_${product.id}">
                                Qty:
                                <select name="select_qty" id="selectQty_${product.id}">
                                    ${[...Array(10).keys()].map(i => 
                                        `<option value="${i+1}" ${product.quantity === i+1 ? 'selected' : ''}>${i+1}</option>`).join('')}
                                </select>
                            </label>
                            <button class="button">
                                <img src="../../assets/images/catalog/icon_heart.svg" alt="Favorite">
                            </button>
                            <button class="button remove_item" data-id="${product.id}">
                                <img src="../../assets/images/catalog/icon_trash.svg" alt="Remove">
                            </button>
                        </div>
                    </div>
                </li>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });
    } else {
        const cartItemHTML = `<em>Cart empty</em>`
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    }
    updateCartTotal(cart);
}

function updateCartTotal(cart) {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let serviceFee = 5.00;
    let tax = 2.00;
    document.querySelector('.order_summary span:nth-child(2)').innerText = `$${subtotal.toFixed(2)}`;
    document.querySelector('.order_total span:nth-child(2)').innerText = `$${(subtotal + serviceFee + tax).toFixed(2)}`;
}
document.addEventListener('click', function(event) {
    if (event.target.closest('.remove_item')) {
        const productId = event.target.closest('.remove_item').getAttribute('data-id');
        removeProductFromCart(productId);
    }
});

function removeProductFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function saveAddress(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstname").value.trim();
    const secondName = document.getElementById("secondname").value.trim();
    const streetAddress = document.getElementById("street_address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const city = document.getElementById("city").value.trim();
    const postalCode = document.getElementById("postal_code").value.trim();
    const country = document.getElementById("country").value.trim();
    const saveAsDefault = document.getElementById("save_default").checked;
    if (!firstName || !secondName || !streetAddress || !phone || !city || !postalCode || !country) {
        alert("All fields are required.");
        return;
    }
    const phoneRegex = /^\+?[0-9\s\-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
        alert("The phone number must be valid and may include an international area code.");
        return;
    }
    const postalCodeRegex = /^\d{5,6}$/;
    if (!postalCodeRegex.test(postalCode)) {
        alert("The postal code must contain 5 or 6 digits.");
        return;
    }
    const address = {
        firstName: firstName,
        secondName: secondName,
        streetAddress: streetAddress,
        phone: phone,
        city: city,
        postalCode: postalCode,
        country: country,
        saveAsDefault: saveAsDefault
    };
    let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    addresses.push(address);
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    document.querySelector('.address_popup').style.display = 'none';
    displayAddresses();
    console.log('Address saved:', address);
}

function displayAddresses() {
    const addressContainer = document.getElementById("address_container");
    let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    const addButton = document.getElementById("add_address_button");
    addressContainer.innerHTML = '';
    addressContainer.appendChild(addButton);
    addresses.forEach((address, index) => {
        const addressHTML = `
            <div class="current_address" data-index="${index}">
                <div class="top_content">
                    <p class="user_name"><span class="firstname">${address.firstName}</span> <span class="lastname">${address.secondName}</span></p>
                    <p class="user_phone">${address.phone}</p>
                </div>
                <div class="bottom_content">
                    <p class="user_street">${address.streetAddress}</p>
                    <p class="user_city">${address.city}</p>
                    <p class="user_country">${address.country}</p>
                </div>
                <button class="edit_address" onclick="editAddress(${index})">&#9998;</button>
                <button class="remove_address" onclick="removeAddress(${index})">&#128465; </button>
            </div>
        `;
        addButton.insertAdjacentHTML('beforebegin', addressHTML);
    });
}

function removeAddress(index) {
    let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    addresses.splice(index, 1);
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    displayAddresses();
}

function editAddress(index) {
    let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    const address = addresses[index];
    document.getElementById("firstname").value = address.firstName;
    document.getElementById("secondname").value = address.secondName;
    document.getElementById("street_address").value = address.streetAddress;
    document.getElementById("phone").value = address.phone;
    document.getElementById("city").value = address.city;
    document.getElementById("postal_code").value = address.postalCode;
    document.getElementById("country").value = address.country;
    document.getElementById("save_default").checked = address.saveAsDefault;
    addresses.splice(index, 1);
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    document.querySelector('.address_popup').style.display = 'flex';
}
async function fetchUserData() {
    try {
        const response = await fetch("../../temp/data.json");
        const data = await response.json();
        const user = data.users[0];
        if (user) {
            document.querySelector('[data-username]').textContent = user.username;
            document.querySelector('[data-username]').setAttribute('data-username', user.username);
            document.querySelector('[data-level]').textContent = user.level;
            document.querySelector('[data-level]').setAttribute('data-level', user.level);
            document.querySelector('[data-balance1]').textContent = user.balance1;
            document.querySelector('[data-balance1]').setAttribute('data-balance1', user.balance1);
            document.querySelector('[data-balance2]').textContent = user.balance2;
            document.querySelector('[data-balance2]').setAttribute('data-balance2', user.balance2);
            document.querySelector('[data-image]').setAttribute('src', user.image);
            document.querySelector('[data-image]').setAttribute('alt', user.username);
            document.querySelector('[data-image]').setAttribute('data-image', user.image);
        }
    } catch (error) {
        console.error('Eroare loading data:', error);
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    fetchProducts();
    fetchUserData();
    displayAddresses();
    const formAddAddress = document.getElementById('add_adress');
    formAddAddress.addEventListener('submit', saveAddress);
});