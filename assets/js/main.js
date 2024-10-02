import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const URL_MAN_MANNEQUIN = `${window.location.origin}/assets/models/mannequin/man.gltf`;
let hiddenMeshes = ['jeans', 'Mesh007_1', 'Mesh001', 'tank_top', 'laces_pants', 'laces_hoody_cap', 'Mesh004', 'Mesh004_1', 'shorts_long', 'Mesh005', 'Mesh005_1', 'laces_hoody', 'Mesh007', 'Mesh007_1', 'short_lace', 'sleeve2', 'sleeve', 'hoody_cap', 'hoody', 'pants'];
let modelWidth = 400;
let modelHeight = 800;
let ModelX = 0;
let ModelY = 1;
let ModelZ = 1.7;
let currentColorPreview = "white";
let model;
let model2;

// Carousel functionality
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


// color model set ongoing update 
function colorUpdate(color){
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
                    // console.log(child.name)
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
                    // console.log('Initialized model1:', model);
                } else {
                    model2 = loadedModel;
                    // console.log('Initialized model2:', model2);
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
function generateProduct(productName, productPrice, productImage, productColors, productType, productId) {
    const productArticle = document.createElement('article');
    productArticle.classList.add('product');
    productArticle.setAttribute('data-type', productType);

    // colors product
    const productColorsHTML = productColors.map(color => `
        <label class="label">
            <input type="radio" data-color="${color}" name="color_product_${productId}" value="${color}" ${color === 'white' ? 'checked' : ''}>
            <span class="check"></span>
        </label>
    `).join('');

    // single product
    productArticle.innerHTML = `
        <button class="button_add_cart" data-id="${productId}" data-name="${productName}" data-price="${productPrice}" data-image="${productImage}">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="16" viewBox="0 0 19 16" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.910691 1.44259H13.684C13.6919 1.43466 14.1422 1.42938 14.6867 1.42938H15.6763L15.7287 1.24971C15.7575 1.15195 15.8282 0.908881 15.8858 0.708082C16.0088 0.272136 16.0717 0.163811 16.2628 0.0713372L16.4042 0L18.5771 0.0158534L18.7054 0.095116C18.8075 0.158526 18.852 0.208726 18.9201 0.346115C19.0012 0.501999 19.0065 0.533704 18.996 0.694872C18.9777 0.974934 18.7918 1.23122 18.5588 1.29727C18.5064 1.31312 18.0535 1.32369 17.5194 1.32369C16.9984 1.32369 16.5665 1.33162 16.5612 1.34483C16.5534 1.3554 16.433 1.76228 16.2942 2.24843C16.1554 2.73457 15.9277 3.51399 15.7915 3.979C15.6554 4.44401 15.5219 4.89581 15.4957 4.983C15.4774 5.05085 15.4241 5.23074 15.3669 5.42425L15.3177 5.59068C14.9302 6.91701 14.4014 8.7427 14.2103 9.42172C14.0636 9.93693 13.9642 10.0928 13.7024 10.217L13.5715 10.2804H10.4089L10.2099 10.3887C10.0136 10.4971 9.2203 10.97 8.85116 11.1999C8.74905 11.2633 8.66266 11.3267 8.66266 11.3399C8.66266 11.3531 9.27266 11.3637 10.1052 11.3637H11.5451L11.3278 11.583C11.2074 11.7018 11.0529 11.8868 10.9822 11.9925L10.8513 12.1827H7.35888L7.20704 11.9793C7.12326 11.8657 6.96094 11.6807 6.84575 11.5697L6.63893 11.3637L6.94785 11.3742L8.42704 10.4944C9.24124 10.0109 9.96382 9.58289 10.0371 9.5459L10.168 9.4772L13.3358 9.48777L13.4091 9.28169C13.4484 9.17072 13.4798 9.06504 13.4798 9.05183C13.4798 9.03333 11.6917 9.0254 8.17309 9.0254H2.86374L2.73545 8.96464C2.54957 8.88009 2.44224 8.79026 2.36893 8.6608C2.3349 8.60003 2.18305 8.20371 2.03121 7.78362C1.54425 6.42558 0.630562 3.89709 0.319017 3.04105C0.151464 2.58397 0.0100928 2.15331 0.00223785 2.08726C-0.0134702 1.91816 0.0545969 1.72265 0.172408 1.60375C0.295456 1.47958 0.483953 1.42145 0.730047 1.43466L0.910691 1.44259ZM0.988037 2.42767L3.08569 8.18548L13.5742 8.22968L15.265 2.41797L0.988037 2.42767Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7155 11.3017C14.0716 11.3783 14.3622 11.5078 14.6449 11.7218C15.0795 12.0468 15.3544 12.4431 15.5141 12.9689C15.5769 13.1802 15.5848 13.241 15.5848 13.6241C15.5848 14.0072 15.5769 14.068 15.5141 14.2793C15.2549 15.1301 14.6187 15.7457 13.7757 15.9544C13.5322 16.0152 12.9825 16.0152 12.7364 15.9544C11.8829 15.7404 11.2284 15.1116 10.9928 14.2714C10.9195 14.0151 10.8933 13.4946 10.9404 13.2304C11.032 12.7073 11.2624 12.2793 11.6656 11.8909C12.0007 11.5659 12.4117 11.3598 12.8516 11.2885C13.0846 11.2488 13.5113 11.2568 13.7155 11.3017ZM12.7442 12.0943C12.2494 12.2528 11.8489 12.6861 11.7075 13.2172C11.6525 13.4339 11.6525 13.809 11.7101 14.031C11.8515 14.5858 12.341 15.0693 12.8699 15.1829C13.0819 15.2278 13.3987 15.2331 13.5898 15.1935C14.137 15.0799 14.6711 14.5568 14.802 14.0046C14.8517 13.7826 14.8517 13.4101 14.7994 13.204C14.6737 12.7126 14.2522 12.2502 13.781 12.0917C13.4642 11.986 13.0819 11.986 12.7442 12.0943Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.40325 11.2969C5.85355 11.3999 6.23055 11.6034 6.54995 11.9152C7.14686 12.4911 7.38248 13.2547 7.2254 14.079C7.04737 15.0011 6.34836 15.7409 5.45561 15.9496C5.1493 16.021 4.66497 16.0157 4.36913 15.9391C3.32192 15.6617 2.58888 14.7184 2.58888 13.6537C2.58888 12.9482 2.82973 12.3802 3.32454 11.9046C3.6387 11.606 3.89265 11.4554 4.29583 11.3365C4.54192 11.2626 5.16501 11.2414 5.40325 11.2969ZM4.49218 12.0684C4.00523 12.2111 3.59158 12.61 3.42664 13.0909C3.21458 13.7118 3.37952 14.3432 3.87694 14.8109C4.16231 15.0804 4.52098 15.2204 4.93201 15.2204C5.38231 15.2204 5.72265 15.0725 6.06038 14.7316C6.38501 14.404 6.52115 14.0658 6.51853 13.5982C6.51591 13.1569 6.3693 12.8029 6.05776 12.4832C5.79595 12.2164 5.53677 12.079 5.18334 12.0235C4.99746 11.9944 4.66759 12.0156 4.49218 12.0684Z" fill="white"/>
                <path d="M10.6262 12.6736C10.6262 12.6894 10.6026 12.7925 10.5765 12.9034C10.5477 13.0144 10.5162 13.1756 10.5058 13.2628L10.4874 13.4239H7.69402V13.3367C7.69402 13.268 7.63118 12.9457 7.57359 12.6974C7.5605 12.6445 7.57359 12.6445 9.09204 12.6445C10.1811 12.6445 10.6262 12.6524 10.6262 12.6736Z" fill="white"/>
            </svg>
        </button>
        <div class="content">
            <div class="bg_content"></div>
            <div class="product_image_container">
                <img src="${productImage}" alt="${productName}" />
            </div>
            <div class="product_colors">
                ${productColorsHTML}
            </div>
            <p class="product_name">
                    ${productName}
                <span class="shadow"></span>
            </p>
            <button class="button_buy" data-id="${productId}" data-name="${productName}" data-price="${productPrice}" data-image="${productImage}">
                <span class="text">$ ${productPrice}</span>
            </button>
            </div>
            
    `;
    return productArticle;
};
function updatePreviewProduct(productPrice) {
    let previewContainer = document.querySelector(".catalog_preview_model");

    if (previewContainer) {
        previewContainer.innerHTML = ""; // Curățăm conținutul existent

        // Creăm un nou element pentru detalii
        const previewDetailsContainer = document.createElement("div");
        previewDetailsContainer.classList.add("content_details");
        
        // Adăugăm conținutul dorit
        previewDetailsContainer.innerHTML = `
            <p class="price">$ ${productPrice}</p>
            <div class="buttons">
                <button class="button_details">Details</button>
                <button class="button_buy">Buy</button>
            </div>
        `;

        // Adăugăm detalii în previewContainer
        previewContainer.appendChild(previewDetailsContainer);
    }
};
function updateSizingProduct(productType, productName){

    let sizingContainer = document.querySelector(".sizing_popup_container");
    if(sizingContainer){
        sizingContainer.remove();
    }

    const sizingData = JSON.parse(localStorage.getItem('sizingData')) || {};
    const selectedSize = sizingData[productType]?.size || 'XS';

    sizingContainer = document.createElement("div");
    sizingContainer.classList.add("sizing_popup_container");
    
    sizingContainer.innerHTML = `
      <div class="sizing_popup_content">
        <p class="sizing_name_product">
            ${productName}
            <span class="line"></span>
        </p>
        <div class="box_sizing">
            ${['XS', 'S', 'M', 'L', 'XL', '2XL'].map(size => `
            <label>
                <input type="radio" name="${productType}_size" value="${size}" ${selectedSize === size ? 'checked' : ''}>
                <span class="bg"></span>
                <span class="text">${size}</span>
            </label>`).join('')}
        </div>
    </div>
    `;
    document.body.appendChild(sizingContainer);
    updateSizing(productType)
};
function updateSizing(productType) {
    const sizingData = JSON.parse(localStorage.getItem('sizingData')) || {};
    sizingData[productType] = sizingData[productType] || {
        size: 'XS'
    };
    document.querySelectorAll(`input[name="${productType}_size"]`).forEach(input => {
        input.addEventListener('change', function() {
            sizingData[productType].size = this.value;
            localStorage.setItem('sizingData', JSON.stringify(sizingData));
        });
    });
};
function updateColorMerch(productType, colorInputs){
    colorInputs.forEach((colorInput) => {
        const currentColor = colorInput.getAttribute('data-color');
        colorInput.addEventListener("change", function() {
            if (model) {
                model.traverse((child) => {
                    if (child.name === productType && child.material) { 
                        child.material.color.set(colorUpdate(currentColor));
                        currentColorPreview = currentColor;
                    }
                });
            }
        });
    });
};
function updateMerch(productType) {
    const hiddenUpperMeshes = ['hoody', 'sleeve', 'sleeve2', 'laces_hoody_cap', 'laces_hoody', 't-shirt'];
    const hiddenLowerMeshes = ['pants', 'jeans', 'shorts_long', 'laces_pants', 'Mesh001', 'Mesh004', 'Mesh005', 'short_lace', 'short_s'];

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

    if (productType === 'hoody' || productType === 't-shirt') {
        updateUpperClothingVisibility(productType);
    } 
    else if (productType === 'pants' || productType === 'short_s') { 
        updateLowerClothingVisibility(productType);
    }
};
// need integration by api colors
function generatePreviewProduct(productName, productPrice, productColors, productImage, productType){
    let previewContainer = document.querySelector('.preview_product');
    
    if(previewContainer){
        previewContainer.innerHTML = "";
    }
    previewContainer = document.createElement("div");
    previewContainer.classList.add("preview_product");
    const sizingData = JSON.parse(localStorage.getItem('sizingData')) || {};
    const selectedSize = sizingData[productType] ? sizingData[productType].size : 'XS';

    const productSizing = `
        <h3 class="title">
            Size
        </h3>
        <div class="sizing_inputs">
            <p class="subtitle_sizing_inputs">Sizing Chart</p>
            <label>
                <input type="radio" name="${productType}_size" value="XS" ${selectedSize === 'XS' ? 'checked' : ''}>
                <span class="bg"></span>
                <span class="text">XS</span>

            </label>
            <label>
                  <input type="radio" name="${productType}_size" value="S" ${selectedSize === 'S' ? 'checked' : ''}>
                    <span class="bg"></span>
                     <span class="text">S</span>

            </label>
            <label>
                  <input type="radio" name="${productType}_size" value="M" ${selectedSize === 'M' ? 'checked' : ''}>
                 <span class="bg"></span>
                     <span class="text">M</span>
            </label>
               <label>
                  <input type="radio" name="${productType}_size" value="L" ${selectedSize === 'L' ? 'checked' : ''}>
                 <span class="bg"></span>
                     <span class="text">L</span>
            </label>
            <label>
                 <input type="radio" name="${productType}_size" value="XL" ${selectedSize === 'XL' ? 'checked' : ''}>
                 <span class="bg"></span>
                     <span class="text">XL</span>
            </label>
            <label>
                 <input type="radio" name="${productType}_size" value="2XL" ${selectedSize === '2XL' ? 'checked' : ''}>
                 <span class="bg"></span>
                     <span class="text">2XL</span>
            </label>
        </div>
    `;


    previewContainer.innerHTML = `
             <div class="mask" id="closePopupPreviewMask"></div>
                  <div class="content">
                     <button class="button_close" id="closePopupPreviewBtn">
                           <img src="../../assets/images/catalog/icon_close.svg" alt="close" title="Close">
                     </button>
                     <div class="left_box">
                        <div class="box_model_preview">
                           <canvas class="model2"></canvas>
                        </div>
                        <div class="bottom_light"></div>
                        <div class="ground"></div>
                        <button class="button_add_to_cart">
                           ADD TO CARD
                        </button>
                     </div>
                     <div class="right_box">
                        <div class="product_details_header">
                           <div class="left_content">
                              <div class="container_image">
                                 <img src="${productImage}" alt="${productName}"> 
                              </div>
                              <h2 class="product_name">
                                 ${productName}
                              </h2>
                           </div>
                           <div class="right_content">
                              <p class="price">$ ${productPrice}</p>
                              <button class="button_buy">buy</button>
                           </div>
                           <div class="line"></div>
                        </div>
                        <div class="product_sizing">
                            ${productSizing}
                        </div>
                        <div class="product_description">
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
                        </div>
                     </div>
                  </div>
    `;  
    return previewContainer;
};
function closePreviewProduct(productType, productName){
    const previewContainer = document.querySelector(".preview_product");
    const closePopup = document.getElementById("closePopupPreviewBtn");
    const mask = document.getElementById("closePopupPreviewMask");
    if(closePopup && previewContainer && mask){
        closePopup.addEventListener('click', function(){
            previewContainer.remove();
            updateSizing(productType);
            updateSizingProduct(productType, productName);
        });
        mask.addEventListener('click', function(){
            previewContainer.remove();
            updateSizing(productType);
            updateSizingProduct(productType, productName);
        });
    }
};
async function uploadModelDetails(productType) {
    const hiddenMeshes = ['jeans', 'Mesh007_1', 'Mesh001', 'tank_top', 'laces_pants', 'laces_hoody_cap', 'Mesh004', 'Mesh004_1', 'shorts_long', 'Mesh005', 'Mesh005_1', 'laces_hoody', 'Mesh007', 'Mesh007_1', 'short_lace', 'sleeve2', 'sleeve', 'hoody_cap', 'hoody', 'pants', 't-shirt', 'short_s'];

        await initialize3DModel({
            canvasSelector: '.model2',
            modelUrl: URL_MAN_MANNEQUIN,
            modelWidth: 250,
            modelHeight: 550,
            cameraPosition: {
                x: 0,
                y: 1,
                z: 1.7
            },
            hiddenMeshes: hiddenMeshes,
        });

        if (model2) {
            model2.traverse((child) => {
                if (child.name === productType) {
                    child.visible = true;
                }   
                if (child.name === productType && currentColorPreview) {
                    child.material.color.set(colorUpdate(currentColorPreview));
                }
            });
        };
};
function updateColorMerchPreview(productType, colorBtnsContainer) {
    const colorBtns = colorBtnsContainer.querySelectorAll('.button_color');
    
    colorBtns.forEach((colorBtn) => {
        const currentColor = colorBtn.getAttribute('data-color');
        colorBtn.addEventListener("click", function() {
            if (model2) {
                model2.traverse((child) => {
                    if (child.name === productType) { 
                        child.material.color.set(colorUpdate(currentColor));
                    }
                });
            }
        });
    });
}
// carousell functionality
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
function initCarousel() {
    positionObjects();
    startAutoplay();
}

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
    
        const productsContainer = document.getElementById('productsContainer');

        if (productsContainer) {
            productsContainer.innerHTML = '';
        }

        data.products.forEach(product => {

            if (product && productsContainer) {
                const productId = product.id;
                const productName = product.name;
                const productPrice = parseFloat(product.price).toFixed(2);
                const productImage = product.image ? product.image : '../../assets/images/home/default.png';
                const productColors = product.colors;
                const productType = product.type_product; // type prouduct temporar este egal cu tipul de haina din model 3d

                // generate product
                const generatedProduct = generateProduct(productName, productPrice, productImage, productColors, productType, productId);
                productsContainer.appendChild(generatedProduct);
                
                // product events click
                generatedProduct.addEventListener("click", function(){
                    // update data product preview
                    updatePreviewProduct(productPrice);
                    // update data sizing
                    updateSizingProduct(productType, productName);
                    // update merch 3d model
                    updateMerch(productType);
                    const colorInputs = generatedProduct.querySelectorAll("input[data-color]");
                    // update color merch 3d model
                    updateColorMerch(productType, colorInputs);
                    // click events details product
                    const btnDetails = document.querySelector(".button_details");
                    if(btnDetails){
                        btnDetails.addEventListener("click", function(){
                            const previewProduct = generatePreviewProduct(productName, productPrice, productColors, productImage, productType);
                            document.body.appendChild(previewProduct);
                            // upload 3d model preview product
                            uploadModelDetails(productType);
                            // close popup details
                            closePreviewProduct(productType, productName);
                            // update sizing product
                            updateSizing(productType);
                            // change color preview 3d model
                            const colorBtns = previewProduct.querySelector(".buttons_color");
                            updateColorMerchPreview(productType, colorBtns);
                        });
                    }
                });
            } else {
                return null;
            }
        });
       
    } catch (error) {
        console.error('Error data:', error);
    }
}

initialize3DModel({
    canvasSelector: '.model',
    modelUrl: URL_MAN_MANNEQUIN,
    modelWidth: modelWidth,
    modelHeight: modelHeight,
    cameraPosition: {
        x: ModelX,
        y: ModelY,
        z: ModelZ
    },
    hiddenMeshes: hiddenMeshes
});

if(objects){
    objects.forEach((object, index) => {
        object.addEventListener('click', () => {
            rotateToObject(index);
            pauseAutoplay();
        });
        object.addEventListener('mouseenter', pauseAutoplay);
        object.addEventListener('mouseleave', startAutoplay);
    });
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

// codurile de mai jos vor fi modificate.
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


document.addEventListener('DOMContentLoaded', (event) => {
    fetchProducts();
    setInterval(positionObjects, 16);
    initCarousel();




  // Function to close all popups TEMP
function closeAllPopups() {
    const popupCategory = document.getElementById("popup_category");
    const popupSort = document.getElementById("popup_sort");
    const popupFilter = document.getElementById("popup_filter");
    const popupSearch = document.getElementById("popup_search");
    popupCategory.style.display = "none";
    popupSort.style.display = "none";
    popupFilter.style.display = "none";
    popupSearch.style.display = "none";
}

// Popup Category TEMP
const popupCategory = document.getElementById("popup_category");
const triggerElementCategory = document.querySelector(".catalog_type_product");

if (popupCategory && triggerElementCategory) {
    triggerElementCategory.addEventListener("click", function(event) {
        closeAllPopups(); 
        popupCategory.style.display = "block";
        event.stopPropagation();
    });

    window.addEventListener("click", function(event) {
        if (!popupCategory.contains(event.target)) {
            popupCategory.style.display = "none";
        }
    });

    popupCategory.addEventListener("click", function(event) {
        event.stopPropagation();
    });
}

// Popup Sort TEMP
const popupSort = document.getElementById("popup_sort");
const triggerElementSort = document.querySelector(".button_sort_type");

if (popupSort && triggerElementSort) {
    triggerElementSort.addEventListener("click", function(event) {
        closeAllPopups(); 
        popupSort.style.display = "block";
        event.stopPropagation();
    });

    window.addEventListener("click", function(event) {
        if (!popupSort.contains(event.target)) {
            popupSort.style.display = "none";
        }
    });

    popupSort.addEventListener("click", function(event) {
        event.stopPropagation();
    });
}

// Popup Filter TEMP
const popupFilter = document.getElementById("popup_filter");
const triggerElementFilter = document.querySelector(".filter_button");

if (popupFilter && triggerElementFilter) {
    triggerElementFilter.addEventListener("click", function(event) {
        closeAllPopups(); 
        popupFilter.style.display = "block";
        event.stopPropagation();
    });

    window.addEventListener("click", function(event) {
        if (!popupFilter.contains(event.target)) {
            popupFilter.style.display = "none";
        }
    });

    popupFilter.addEventListener("click", function(event) {
        event.stopPropagation();
    });
}

// Popup Search TEMP
const popupSearch = document.getElementById("popup_search");
const triggerElementSearch = document.getElementById("search_input");

if (popupSearch && triggerElementSearch) {
    triggerElementSearch.addEventListener("click", function(event) {
        closeAllPopups();
        popupSearch.style.display = "block";
        event.stopPropagation();
    });

    window.addEventListener("click", function(event) {
        if (!popupSearch.contains(event.target)) {
            popupSearch.style.display = "none";
        }
    });

    popupSearch.addEventListener("click", function(event) {
        event.stopPropagation();
    });
}
    
// Popup Cart TEMP
const btnCloseCart = document.getElementById("btn_close_cart");
const popupCart = document.getElementById("cart");
const btnOpenCart = document.getElementById("btn_open_cart");

btnCloseCart.addEventListener("click", function(){
    popupCart.style.display = "none";
});
btnOpenCart.addEventListener("click", function(){
    popupCart.style.display = "flex";
});

});