import * as THREE from './three.module.js';
import { OrbitControls } from './examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './examples/jsm/loaders/GLTFLoader.js';

const URL_MAN_MANNEQUIN = `${window.location.origin}/assets/models/man_mannequin.gltf`;

let modelWidth = 400;
let modelHeight = 800;
let scene, camera, renderer, controls;
let model, model2;
let scene2, camera2, renderer2;
let clothingModels = {
    upper: null,
    lower: null,
    footwear: null,
};
function getColorHex(color) {
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
}
function initializeScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, modelWidth / modelHeight, 0.5, 1000);
    camera.position.set(0, 1.7, 0.5);
    camera.lookAt(0, 1.7, 0);

    const canvas = document.querySelector('.model');
    renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(modelWidth, modelHeight);

    addLighting(scene);

    controls = new OrbitControls(camera, renderer.domElement);
    configureControls();

    window.addEventListener('resize', resizeRenderer);

    animate();
}
function addLighting(targetScene) {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    hemiLight.position.set(0, 20, 0);
    targetScene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(3, 10, 10);
    dirLight.castShadow = true;
    targetScene.add(dirLight);
}
function configureControls() {
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enablePan = false;
}
function resizeRenderer() {
    camera.aspect = modelWidth / modelHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modelWidth, modelHeight);
}
function loadModel(url) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            url,
            (gltf) => {
                const model = gltf.scene;
                model.position.set(0, -1.25, 0);
                setupModelMaterials(model);
                scene.add(model);
                resolve(model);
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error);
                reject(error);
            }
        );
    });
}
function setupModelMaterials(model) {
    const emissiveMaterial = new THREE.MeshStandardMaterial({
        color: 0x2e2e2e,
        metalness: 0,
        roughness: 0.2,
        emissive: 0x000000,
        emissiveIntensity: 0.05
    });

    model.traverse((child) => {
        if (child.isMesh && child.name === "body") {
            child.material = emissiveMaterial;
        }
        setLimbRotations(child);
    });
}
function setLimbRotations(child) {
    const rotations = {
        upper_armR: { z: 2.65 },
        upper_armL: { z: -2.65 },
        forearmR: { x: 0 },
        forearmL: { x: 0 },
        thighR: { z: 0.1 },
        thighL: { z: -0.1 }
    };
    if (rotations[child.name]) {
        Object.assign(child.rotation, rotations[child.name]);
    }
}
async function wearClothing(itemUrl, type, name) {
    if (clothingModels[type]) {
        removeModel(clothingModels[type]);
    }

    return loadModel(itemUrl).then((clothingModel) => {
        clothingModel.name = name;
        clothingModels[type] = clothingModel;
        scene.add(clothingModel);
    });
}
function removeModel(model) {
    scene.remove(model);
    model.traverse((child) => {
        if (child.material) {
            child.material.dispose();
        }
        if (child.geometry) {
            child.geometry.dispose();
        }
    });
}
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
initializeScene();
function initializeSecondRenderer(bodyModel, selectedClothing) {
    scene2 = new THREE.Scene();
    camera2 = new THREE.PerspectiveCamera(75, 600 / 700, 0.5, 1000);
    camera2.position.set(0, 1.7, 0.5);
    camera2.lookAt(0, 1.7, 0);

    const canvas2 = document.querySelector('.model2');
    renderer2 = new THREE.WebGLRenderer({
        canvas: canvas2,
        alpha: true,
        antialias: true
    });
    renderer2.setSize(600, 700);

    addLighting(scene2);

    const clonedBody = bodyModel.clone();
    setupModelMaterials(clonedBody);  
    scene2.add(clonedBody);

    const clonedClothing = selectedClothing.clone();
    scene2.add(clonedClothing);

    const controls2 = new OrbitControls(camera2, renderer2.domElement);
    configureControlsForSecondScene(controls2);  

    function animateSecondScene() {
        requestAnimationFrame(animateSecondScene);
        controls2.update();
        renderer2.render(scene2, camera2);
    }

    animateSecondScene();
}
function configureControlsForSecondScene(controls) {
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enablePan = false;
}
function createProduct(productName, productPrice, productImage, productColors, productType, productId) {
    const productArticle = document.createElement('article');
    productArticle.classList.add('product');
    productArticle.setAttribute('data-type', productType);

    const productColorsHTML = productColors.map(color => `
            <label>
                <input type="radio" data-color="${color}" name="color_product_${productId}" value="${color}" ${color === 'white' ? 'checked' : ''}>
                <span class="color"></span>
            </label>
    `).join('');

    productArticle.innerHTML = `
      <span class="bg"></span>
        <button class="botton_add_to_cart" data-id="${productId}" data-name="${productName}" data-price="${productPrice}" data-image="${productImage}">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <g clip-path="url(#clip0_102_2152)">
                <path d="M22.9986 4.077C22.7174 3.73944 22.3652 3.46795 21.9672 3.28182C21.5692 3.09568 21.135 2.99946 20.6956 3H4.52764L4.48564 2.649C4.39969 1.91942 4.04903 1.24673 3.50013 0.758478C2.95124 0.270223 2.24227 0.000341793 1.50764 0L1.28564 0C1.02043 0 0.766074 0.105357 0.578538 0.292893C0.391001 0.48043 0.285645 0.734784 0.285645 1C0.285645 1.26522 0.391001 1.51957 0.578538 1.70711C0.766074 1.89464 1.02043 2 1.28564 2H1.50764C1.75258 2.00003 1.98898 2.08996 2.17202 2.25272C2.35505 2.41547 2.47199 2.63975 2.50064 2.883L3.87664 14.583C4.0195 15.7998 4.60412 16.9218 5.51955 17.736C6.43498 18.5502 7.6175 19 8.84264 19H19.2856C19.5509 19 19.8052 18.8946 19.9928 18.7071C20.1803 18.5196 20.2856 18.2652 20.2856 18C20.2856 17.7348 20.1803 17.4804 19.9928 17.2929C19.8052 17.1054 19.5509 17 19.2856 17H8.84264C8.2237 16.9983 7.62044 16.8051 7.11558 16.4471C6.61071 16.089 6.22896 15.5836 6.02264 15H17.9426C19.1149 15.0001 20.25 14.5882 21.1495 13.8364C22.049 13.0846 22.6557 12.0407 22.8636 10.887L23.6486 6.533C23.727 6.10101 23.7094 5.65707 23.5971 5.23264C23.4847 4.80821 23.2804 4.41368 22.9986 4.077ZM21.6856 6.178L20.8996 10.532C20.7748 11.225 20.4101 11.852 19.8695 12.3032C19.3289 12.7544 18.6468 13.0011 17.9426 13H5.70464L4.76364 5H20.6956C20.8425 4.99912 20.9878 5.03062 21.1212 5.09226C21.2545 5.15389 21.3727 5.24415 21.4672 5.35661C21.5617 5.46907 21.6303 5.60097 21.668 5.74294C21.7058 5.8849 21.7118 6.03345 21.6856 6.178Z" fill="white"/>
                <path d="M7.28515 24C8.38972 24 9.28515 23.1046 9.28515 22C9.28515 20.8954 8.38972 20 7.28515 20C6.18058 20 5.28516 20.8954 5.28516 22C5.28516 23.1046 6.18058 24 7.28515 24Z" fill="white"/>
                <path d="M17.2856 24C18.3902 24 19.2856 23.1046 19.2856 22C19.2856 20.8954 18.3902 20 17.2856 20C16.1811 20 15.2856 20.8954 15.2856 22C15.2856 23.1046 16.1811 24 17.2856 24Z" fill="white"/>
                </g>
                <defs>
                    <clipPath id="clip0_102_2152">
                    <rect width="24" height="24" fill="white" transform="translate(0.285645)"/>
                    </clipPath>
                </defs>
                </svg>
        </button>
        
           <div class="image_product_container">
                <img src="${productImage}" alt="${productName}">
            </div>
            <div class="product_colors">
                ${productColorsHTML}
            </div>
              <p class="product_name">
                     ${productName}
                </p>
         
                    <button class="button_buy" data-id="${productId}" data-name="${productName}" data-price="${productPrice}" data-image="${productImage}">
                <span class="text">$ ${productPrice}</span>
                  </button>
    `;
    return productArticle;
};
function updatePreviewProduct(productPrice) {
    const previewContainer = document.querySelector(".scene_catalog");
    let previewDetailsContainer = document.querySelector(".preview_product");
    
    if(previewDetailsContainer){
        previewDetailsContainer.remove();
    }
    previewDetailsContainer = document.createElement("div");
    previewDetailsContainer.classList.add("preview_product");
    previewDetailsContainer.innerHTML = `
            <p class="price">$ ${productPrice}</p>
            <div class="buttons">
            <div class="buttons">
                  <button class="button" id="btn_details">
                     <span class="text">Details</span>
                  </button>
                  <button class="button">
                     <span class="text">ADD TO CART</span>
                     <span class="arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13" fill="none">
                           <path d="M0 11.7432C0 12.3818 0.762138 12.7323 1.26738 12.326L7.674 7.17424C8.10867 6.82471 8.10867 6.17536 7.674 5.82583L1.26727 0.674002C0.762074 0.267758 0 0.618208 0 1.25677C0 1.37772 0.0297826 1.4969 0.0868429 1.60429L2.47453 6.09792C2.60849 6.35003 2.60849 6.64989 2.47453 6.902L0.08685 11.3956C0.029785 11.503 0 11.6222 0 11.7432Z" fill="white"/>
                         </svg>
                     </span>
                  </button>
               </div>
            </div>
    `;
    previewContainer.appendChild(previewDetailsContainer);
};
function updateSizingProduct(productName){
    let sizingContainer = document.querySelector(".preview_size");
    if(sizingContainer){
        sizingContainer.remove();
    }

    const sizingData = JSON.parse(localStorage.getItem('sizingData')) || {};
    const selectedSize = sizingData[productName]?.size || 'XS';

    

    sizingContainer = document.createElement("div");
    sizingContainer.classList.add("preview_size");
    
    sizingContainer.innerHTML = `
         <p class="title">Size</p>
         <span class="line_size"></span>
         <div class="container_sizes">

          ${['XS', 'S', 'M', 'L', 'XL', '2XL'].map(size => `
            <label>
                <input type="radio" name="${productName}_size" value="${size}" ${selectedSize === size ? 'checked' : ''}>
                <span class="name">${size}</span>
            </label>`).join('')}
         </div>
    `;

    document.body.appendChild(sizingContainer);
    updateSizing(productName)
};
function updateSizing(productName) {
    const sizingData = JSON.parse(localStorage.getItem('sizingData')) || {};
    sizingData[productName] = sizingData[productName] || {
        size: 'XS'
    };
    document.querySelectorAll(`input[name="${productName}_size"]`).forEach(input => {
        input.addEventListener('change', function() {
            sizingData[productName].size = this.value;
            localStorage.setItem('sizingData', JSON.stringify(sizingData));
        });
    });
};
function updateClothingColor(model, color) {
    if (!model) return;
    model.traverse((child) => {
        if (child.isMesh) {
            child.material.color.set(getColorHex(color));
        }
    });
};
function updateMerchPreview(modelUrl, productType, name) {
    if (clothingModels[productType]?.name === name) {
        return Promise.resolve();
    }
    return wearClothing(modelUrl, productType, name); 
};
function uploadModelDetails(productType) {
    const selectedClothing = clothingModels[productType];
    
    if (selectedClothing && model) {
        initializeSecondRenderer(model, selectedClothing);
    }
};
function generatePreviewProduct(productName, productPrice){
    let previewContainer = document.querySelector('.popup_preview');
    
    if(previewContainer){
        previewContainer.innerHTML = "";
    }
    previewContainer = document.createElement("div");
    previewContainer.classList.add("popup_preview");
    const sizingData = JSON.parse(localStorage.getItem('sizingData')) || {};
    const selectedSize = sizingData[productName] ? sizingData[productName].size : 'XS';

    const productSizing = `
        <div class="sizes_box">
                           <label>
                              <input type="radio" name="${productName}_size" value="XS" ${selectedSize === 'XS' ? 'checked' : ''}>
                              <span class="name">XS</span>
                           </label>
                           <label>
                              <input type="radio" name="${productName}_size" value="S" ${selectedSize === 'S' ? 'checked' : ''}>
                              <span class="name">S</span>
                           </label>
                           <label>
                              <input type="radio" name="${productName}_size" value="M" ${selectedSize === 'M' ? 'checked' : ''}>
                              <span class="name">M</span>
                           </label>
                           <label>
                               <input type="radio" name="${productName}_size" value="L" ${selectedSize === 'L' ? 'checked' : ''}>
                              <span class="name">L</span>
                           </label>
                           <label>
                              <input type="radio" name="${productName}_size" value="XL" ${selectedSize === 'XL' ? 'checked' : ''}>
                              <span class="name">XL</span>
                           </label>
                           <label>
                               <input type="radio" name="${productName}_size" value="2XL" ${selectedSize === '2XL' ? 'checked' : ''}>
                              <span class="name">2XL</span>
                           </label>
        </div>
    `;

   
    previewContainer.innerHTML = `
        <div class="mask" id="closePopupPreviewMask"></div>
         <div class="content">
            <span class="border border_t_left"></span>
            <span class="border border_t_right"></span>
            <span class="border border_b_left"></span>
            <span class="border border_b_right"></span>
            <div class="left_content">
               <button class="botton_close" id="closePopupPreviewBtn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                     <path d="M19.5698 2.50757C20.1434 1.93393 20.1434 1.00387 19.5698 0.43023C18.9961 -0.14341 18.0661 -0.14341 17.4924 0.43023L10.0011 7.9216L2.50969 0.43023C1.93605 -0.14341 1.006 -0.14341 0.432358 0.43023C-0.141282 1.00387 -0.141282 1.93393 0.432358 2.50757L7.92373 9.99894L0.430231 17.4924C-0.14341 18.0661 -0.14341 18.9961 0.43023 19.5698C1.00387 20.1434 1.93393 20.1434 2.50757 19.5698L10.0011 12.0763L17.4946 19.5698C18.0682 20.1434 18.9983 20.1434 19.5719 19.5698C20.1455 18.9961 20.1455 18.0661 19.5719 17.4924L12.0784 9.99894L19.5698 2.50757Z" fill="white"/>
                   </svg>
               </button>
               <canvas class="model2"></canvas>
               <span class="platform_bottom_preview"></span>
               <span class="bg"></span>
               <span class="floor"></span>
               <button class="button_buy">
                  <span class="text">ADD TO CART</span>
                  <span class="arrow">
                     <svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13" fill="none">
                        <path d="M0 11.7432C0 12.3818 0.762138 12.7323 1.26738 12.326L7.674 7.17424C8.10867 6.82471 8.10867 6.17536 7.674 5.82583L1.26727 0.674002C0.762074 0.267758 0 0.618208 0 1.25677C0 1.37772 0.0297826 1.4969 0.0868429 1.60429L2.47453 6.09792C2.60849 6.35003 2.60849 6.64989 2.47453 6.902L0.08685 11.3956C0.029785 11.503 0 11.6222 0 11.7432Z" fill="white"/>
                      </svg>
                  </span>
               </button>
            </div>
            <div class="right_content">
               <div class="inner_container">
                  <div class="product_header">
                     <p class="name">
                     ${productName}
                     </p>
                     <p class="price">
                     $ ${productPrice}
                     </p>
                  </div>
                  <div class="line"></div>
                  <div class="product_description">
                     <p class="title">
                        Description
                     </p>

                     <div class="product_sizing">
                        <p class="title_selector">Size</p>
                         ${productSizing}
                     </div>

                     <div class="product_colors">
                        <p class="title_selector">Color</p>
                        <div class="colors_box">
                           <label>
                              <input type="radio" name="color_product" value="white">
                              <span class="color white"></span>
                           </label>
                           <label>
                              <input type="radio" name="color_product" value="black">
                              <span class="color black"></span>
                           </label>
                           <label>
                              <input type="radio" name="color_product" value="yellow">
                              <span class="color yellow"></span>
                           </label>
                           <label>
                              <input type="radio" name="color_product" value="green">
                              <span class="color green"></span>
                           </label>
                           <label>
                              <input type="radio" name="color_product" value="orange">
                              <span class="color orange"></span>
                           </label>
                           <label>
                              <input type="radio" name="color_product" value="purple">
                              <span class="color purple"></span>
                           </label>
                        </div>
                     </div>

                     <div class="product_material">
                        <p class="title_selector">Material</p>
                        <div class="material_box">
                           <span class="material_bg"></span>
                           <p class="name_material">100% Pure Cotton</p>
                        </div>
                     </div>

                     <div class="product_benefis">
                        <p class="title_selector">Benefits</p>
                        <ul class="items">
                           <li class="item">
                              <span class="icon">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M9.82483 8.37557C9.97498 8.52325 10.1466 8.58654 10.3397 8.58654C10.5327 8.58654 10.7043 8.52325 10.8545 8.37557L13.1068 6.1604C13.3857 5.88614 13.3857 5.44311 13.1068 5.16885C12.828 4.89459 12.3775 4.89459 12.0986 5.16885L11.069 6.1815V0.696318C11.069 0.316575 10.7472 0.00012207 10.3611 0.00012207C9.97498 0.00012207 9.63177 0.295478 9.63177 0.675221V6.1604L8.60211 5.14775C8.32325 4.87349 7.87278 4.87349 7.59391 5.14775C7.31505 5.42201 7.31505 5.86505 7.59391 6.13931L9.82483 8.37557Z" fill="white"/>
                                    <path d="M18.9449 18.6071H1.74109C1.35497 18.6071 1.0332 18.9236 1.0332 19.3033C1.0332 19.6831 1.35497 19.9995 1.74109 19.9995H18.9449C19.331 19.9995 19.6527 19.6831 19.6527 19.3033C19.6527 18.9236 19.3524 18.6071 18.9449 18.6071Z" fill="white"/>
                                    <path d="M1.67437 16.7086C1.97468 16.7297 8.88193 17.1938 10.3406 17.1938C11.7993 17.1938 18.7065 16.7297 19.0068 16.7086C19.393 16.6875 19.6933 16.3499 19.6718 15.9491C19.6504 15.5694 19.3072 15.274 18.8996 15.2951C18.8352 15.2951 11.7349 15.7803 10.3406 15.7803C8.94628 15.7803 1.84597 15.2951 1.78162 15.2951C1.3955 15.274 1.05228 15.5694 1.00938 15.9491C0.987931 16.3499 1.28825 16.6875 1.67437 16.7086Z" fill="white"/>
                                    <path d="M18.8357 12.004C18.7714 12.004 13.1297 12.9744 10.3411 12.9744C7.57389 12.9744 1.9108 12.0251 1.84645 12.004C1.46033 11.9407 1.09566 12.1938 1.00986 12.5736C0.945502 12.9533 1.20292 13.312 1.58903 13.3964C1.825 13.4386 7.42373 14.3879 10.3196 14.3879C13.2155 14.3879 18.8143 13.4386 19.0502 13.3964C19.4363 13.3331 19.6938 12.9744 19.6294 12.5736C19.5865 12.1938 19.2218 11.9407 18.8357 12.004Z" fill="white"/>
                                    <path d="M1.50239 10.0632C1.674 10.1265 5.96421 11.5611 10.3402 11.5611C14.7163 11.5611 19.0065 10.1265 19.1781 10.0632C19.5427 9.93664 19.7573 9.5358 19.6286 9.15605C19.4998 8.79741 19.0923 8.58644 18.7062 8.71302C18.6633 8.73412 14.4803 10.1265 10.3402 10.1265C6.20018 10.1265 2.01721 8.71302 1.97431 8.71302C1.58819 8.58644 1.18062 8.77631 1.05192 9.15605C0.923209 9.5358 1.11627 9.93664 1.50239 10.0632Z" fill="white"/>
                                  </svg>
                              </span>
                              <span class="text">Soft & Comfortable</span>
                           </li>
                           <li class="item">
                              <span class="icon">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M9.44775 15.1105V19.153C9.44775 19.2859 9.55579 19.3934 9.68945 19.3934C9.82311 19.3934 9.93115 19.2859 9.93115 19.153V15.1978L9.68945 15.1543L9.44775 15.1105Z" fill="white"/>
                                    <path d="M7.15723 19.1531C7.15723 19.286 7.26526 19.3935 7.39892 19.3935C7.53258 19.3935 7.64062 19.286 7.64062 19.1531V14.7846L7.15723 14.6973V19.1531Z" fill="white"/>
                                    <path d="M11.8623 19.1532C11.8623 19.2862 11.9703 19.3937 12.104 19.3937C12.2377 19.3937 12.3457 19.2862 12.3457 19.1532V13.8901C12.1765 14.0007 12.0163 14.1216 11.8623 14.2539V19.1532Z" fill="white"/>
                                    <path d="M16.5064 10.1665C13.5734 10.6759 12.5634 11.1832 11.3585 12.7506C11.3353 12.7806 11.2998 12.7977 11.2626 12.7977C11.2555 12.7977 11.248 12.797 11.241 12.7958L2.3749 11.1965C0.650404 11.8651 0.132208 12.8277 0 13.1617L7.1571 14.453L7.64049 14.5403L9.44766 14.8663L9.68935 14.9098L9.93105 14.9533L10.746 15.1005C11.1154 14.6261 11.469 14.2489 11.8624 13.937C12.0159 13.8154 12.1766 13.7041 12.3458 13.6012C13.1889 13.0883 14.2666 12.7849 15.9991 12.4842C18.4881 12.0516 19.3289 10.6901 19.5348 10.2636L17.558 9.90706C17.2433 10.0104 16.8941 10.0992 16.5064 10.1665Z" fill="white"/>
                                    <path d="M2.58138 10.9898L2.83468 11.0354L11.2114 12.5467C12.4426 10.9648 13.4932 10.4464 16.4646 9.93021C16.6604 9.89632 16.8427 9.85472 17.0186 9.81C17.1112 9.78644 17.2033 9.76288 17.2905 9.73667C17.3737 9.71191 17.4512 9.68474 17.5296 9.65781C19.1953 9.08561 19.8249 8.06837 19.9999 7.70966L12.5874 6.37242V8.53119C12.5874 8.61269 12.5649 8.68843 12.5289 8.75574C12.5078 8.79517 12.4825 8.83196 12.4518 8.86393C12.4126 8.90433 12.3662 8.93678 12.3152 8.96155C12.2512 8.9928 12.1801 9.0118 12.104 9.0118C11.9655 9.0118 11.8412 8.95313 11.7533 8.86009C11.7148 8.81946 11.6827 8.77281 11.6602 8.72088C11.6428 8.68097 11.6329 8.63746 11.6269 8.59274C11.6242 8.5723 11.6206 8.55211 11.6206 8.53071V6.19763L10.1726 5.93653V8.33043V8.45257V8.53095C10.1726 8.54585 10.1694 8.5598 10.1682 8.57422C10.146 8.81922 9.94127 9.0118 9.68918 9.0118C9.42234 9.0118 9.20578 8.79638 9.20578 8.53095V8.40064V8.27826V8.15613V5.92139C9.03176 6.21134 8.64239 6.71911 7.88202 7.18313V8.53095C7.88202 8.79638 7.66546 9.0118 7.39862 9.0118C7.13179 9.0118 6.91523 8.79638 6.91523 8.53095V7.65003C6.41516 7.83877 5.82107 7.99648 5.10759 8.09097C1.52009 8.56653 0.643462 10.1584 0.465332 10.6082L2.34234 10.9467L2.58138 10.9898Z" fill="white"/>
                                    <path d="M8.40411 2.58865C8.47783 2.58865 8.55034 2.55523 8.59795 2.49224L9.20654 1.68201L9.44824 1.36008V1.76183V5.56125V5.68339V5.80552V8.19942V8.32156V8.44393V8.53073C9.44824 8.66368 9.55628 8.77115 9.68993 8.77115C9.82335 8.77115 9.93139 8.66392 9.93163 8.53121V8.53073V8.40883V8.2867V5.8928V5.77042V5.64829V1.70702V1.32763L10.1733 1.6207L10.8496 2.44079C10.9344 2.54321 11.0862 2.5586 11.1897 2.47445C11.2931 2.39006 11.3078 2.23883 11.2235 2.13617L10.1721 0.860964L9.9923 0.6429C9.91495 0.549134 9.80619 0.502732 9.67857 0.499847C9.55676 0.502732 9.44534 0.560194 9.37307 0.656844L9.20678 0.878515L8.21124 2.20421C8.13124 2.31048 8.15323 2.46123 8.26006 2.54057C8.30308 2.57302 8.35384 2.58865 8.40411 2.58865Z" fill="white"/>
                                    <path d="M4.90562 4.74535C4.95106 4.81964 5.03082 4.86051 5.11203 4.86051C5.15505 4.86051 5.19832 4.84921 5.23771 4.82541C5.35179 4.75641 5.3878 4.60854 5.3182 4.49506L4.75794 3.58097L4.60447 3.33045C4.60979 3.33069 4.61438 3.33358 4.61969 3.33358C4.7142 3.33358 4.80725 3.33959 4.8991 3.34969C6.16703 3.48865 7.15702 4.55974 7.15702 5.85731V7.2859V7.4215V7.55229V8.53058C7.15702 8.66353 7.26506 8.771 7.39872 8.771C7.53237 8.771 7.64041 8.66353 7.64041 8.53058V7.32197V7.1818V7.03971V5.85731C7.64041 4.41548 6.61369 3.20856 5.24955 2.91933C5.05668 2.87845 4.85728 2.85658 4.65281 2.85417L5.23481 2.67169L6.10927 2.39761C6.2364 2.3577 6.30722 2.22258 6.26709 2.09587C6.22697 1.96941 6.09138 1.89945 5.96377 1.93888L4.11189 2.5195C3.99588 2.55581 3.905 2.64188 3.86222 2.75512C3.81944 2.86836 3.83128 2.99266 3.89485 3.09604L4.90562 4.74535Z" fill="white"/>
                                    <path d="M12.1042 8.77104C12.1666 8.77104 12.222 8.74604 12.265 8.70757C12.314 8.66357 12.3459 8.60154 12.3459 8.53062V6.32834V6.2062V6.08406V5.85734C12.3459 4.55978 13.3357 3.48869 14.6039 3.34972C14.6957 3.33963 14.7888 3.33361 14.8833 3.33361C14.8886 3.33361 14.8934 3.33097 14.8987 3.33049L14.7453 3.58101L14.1853 4.4951C14.1156 4.60858 14.1517 4.75644 14.2657 4.82545C14.3049 4.84949 14.3484 4.86055 14.3914 4.86055C14.4729 4.86055 14.5524 4.81943 14.5978 4.74538L15.6084 3.09656C15.6719 2.99317 15.6838 2.86912 15.641 2.75564C15.5982 2.64216 15.5073 2.55632 15.3911 2.51978L13.5394 1.9394C13.4113 1.89997 13.2765 1.96993 13.2361 2.09639C13.196 2.2231 13.2668 2.35822 13.3939 2.39813L14.2684 2.67221L14.8504 2.85469C14.6459 2.85685 14.4465 2.87897 14.2536 2.91985C12.8895 3.20884 11.8628 4.416 11.8628 5.85783V5.99727V6.11941V6.24154V8.5311C11.8628 8.57125 11.8751 8.60755 11.8928 8.64097C11.9329 8.71719 12.0112 8.77104 12.1042 8.77104Z" fill="white"/>
                                  </svg>
                              </span>
                              <span class="text">Breathable</span>
                           </li>
                           <li class="item">
                              <span class="icon">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                    <path d="M10.5716 0.700033C10.2292 0.433363 9.75847 0.433363 9.41604 0.700033L8.13212 1.70003C6.63192 2.86843 4.8073 3.50003 2.93209 3.50003H2.29011C1.75829 3.50003 1.32715 3.94775 1.32715 4.50003V10.5557C1.32715 13.9647 3.18183 17.081 6.11797 18.6056L9.56318 20.3944C9.83425 20.5352 10.1534 20.5352 10.4245 20.3944L13.8696 18.6056C16.8058 17.081 18.6605 13.9647 18.6605 10.5557V4.50003C18.6605 3.94775 18.2294 3.50003 17.6975 3.50003H17.0555C15.1803 3.50003 13.3557 2.86843 11.8555 1.70003L10.5716 0.700033Z" fill="white"/>
                                  </svg>
                              </span>
                              <span class="text">Durable</span>
                           </li>
                           <li class="item">
                              <span class="icon">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                    <path d="M15.3004 0.500031H1.0402C0.646437 0.500031 0.327148 0.831628 0.327148 1.2407V5.68514C0.327148 6.09421 0.646437 6.42603 1.0402 6.42603H15.3004C15.6943 6.42603 16.0135 6.09421 16.0135 5.68514V4.20381H17.4394V8.64825H8.17036C7.77649 8.64825 7.45731 8.97985 7.45731 9.38892V11.6111H6.38779V18.648C6.38779 19.6708 7.18586 20.5 8.17036 20.5C9.15475 20.5 9.95282 19.6708 9.95282 18.648V11.6111H8.8833V10.1296H18.1525C18.5464 10.1296 18.8655 9.79799 18.8655 9.38892V3.46292C18.8655 3.05385 18.5464 2.72225 18.1525 2.72225H16.0135V1.2407C16.0135 0.831628 15.6943 0.500031 15.3004 0.500031Z" fill="white"/>
                                  </svg>
                              </span>
                              <span class="text">Versatile Style</span>
                           </li>
                        </ul>
                        <div class="line"></div>
                        <div class="designer_signature">
                            <span class="text">Art & Graphic Design: Musteață Anastasia</span>
                            <span class="signature">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="26" viewBox="0 0 34 26" fill="none">
                                        <path d="M7.43614 19.1604C7.44787 19.6741 7.04342 24.112 8.56385 24.0475C9.67237 24.0004 10.5444 21.5081 10.6909 21.1414C11.5373 19.0218 12.0516 16.7254 12.5521 14.5069C13.1859 11.6972 13.6102 8.83196 14.3215 6.04087C14.3612 5.88504 14.4957 5.21648 14.4957 5.81661C14.4957 6.34029 14.3513 8.72742 14.349 8.76942C14.1823 11.8285 14.0208 14.8876 13.8356 17.9456C13.7658 19.0984 13.5909 21.6615 13.5606 22.9355C13.5448 23.5967 13.3041 24.3706 13.6706 24.9165C13.9406 25.3187 14.2934 24.162 14.4957 23.7204C15.2327 22.1114 16.4519 19.0171 16.9895 17.5531C18.6869 12.931 20.2338 8.21215 21.1152 3.34969C21.1394 3.21646 21.257 0.906126 21.4178 2.62083C21.8941 7.69922 22.08 12.8017 22.5638 17.8802C22.568 17.924 22.8319 23.1567 23.7557 23.9727C24.8506 24.9398 26.046 22.0389 26.7171 20.7302C29.4653 15.3706 31.6152 9.34628 32.7682 3.40576C32.8763 2.84857 33.5527 0.0253279 31.9338 1.35C30.2007 2.76818 28.728 4.48958 27.0746 6.00349C24.2081 8.6283 20.6223 11.7801 17.4479 13.9836C13.4913 16.7301 8.12304 19.9266 3.0537 18.8987C1.13572 18.5098 1.28645 17.3048 1 15.7964" stroke="white" stroke-width="1.152" stroke-linecap="round"/>
                                    </svg>
                            </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
    `;  
    return previewContainer;
};
function closePreviewProduct(productName){
    const previewContainer = document.querySelector(".popup_preview");
    const closePopup = document.getElementById("closePopupPreviewBtn");
    const mask = document.getElementById("closePopupPreviewMask");
    if(closePopup && previewContainer && mask){
        closePopup.addEventListener('click', function(){
            previewContainer.remove();
            updateSizing(productName);
            updateSizingProduct(productName);
        });
        mask.addEventListener('click', function(){
            previewContainer.remove();
            updateSizing(productName);
            updateSizingProduct(productName);
        });
    }
};
function updateColorMerchPreview(colors, productType) {
    const selectedClothing = clothingModels[productType];  
    colors.forEach((input) => {
        const currentColor = input.value;
        input.addEventListener("click", function() {
            if (selectedClothing) {
                selectedClothing.traverse((child) => {
                    if (child.isMesh) { 
                        child.material.color.set(getColorHex(currentColor));
                    }
                });
            }
        });
    });
};
function generateCart() {
    const existingCart = document.getElementById("cart");

    if (!existingCart) {
        const cartPopup = document.createElement('div');
        cartPopup.classList.add('popup_cart');
        cartPopup.id = 'cart';

        cartPopup.innerHTML = `
            <div class="mask"></div>
            <div class="content">
                <div class="header_cart">
                    <p class="title">Billing & Payment</p>
                    <button class="button_close" id="btn_close_cart">
                        <img src="../../assets/images/catalog/icon_close.svg" alt="close" title="Close">
                    </button>
                </div>
                <div class="left_content">
                    <div class="container_cart_items">
                        <p class="title">Check your cart</p>
                        <div class="select_cart_items">
                            <p>All items <span>(0)</span></p>
                            <input type="checkbox" id="select_all_cart_items">
                        </div>
                    </div>
                    <ul class="cart_items"></ul>
                    <p class="title_address">Billing address</p>
                    <div class="content_address">
                        <button class="button" id="btn_add_address">
                            <span class="text">+ Add address</span>
                        </button>
                    </div>
                </div>
                <div class="right_content">
                    <form action="#" class="promocode">
                        <div class="header_promocode">
                            <p>Discount code</p>
                        </div>
                        <div class="container_promocode">
                            <div class="group">
                                <input type="text" placeholder="promocode">
                                <button class="button">Apply</button>
                            </div>
                        </div>
                    </form>
                    <div class="summary">
                        <div class="header_summary">
                            <p>Order Summary</p>
                        </div>
                        <ul class="items">
                            <li class="item">
                                <span>Subtotal</span>
                                <span>$0.00</span>
                            </li>
                            <li class="item">
                                <span>Service fee</span>
                                <span>$0.00</span>
                            </li>
                            <li class="item">
                                <span>Tax included</span>
                                <span>$0.00</span>
                            </li>
                        </ul>
                    </div>
                    <div class="total_summary">
                        <span>Total</span>
                        <span>$0.00</span>
                    </div>
                    <div class="checkout">
                        <button class="button">Checkout now</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(cartPopup);

        document.getElementById('btn_close_cart').addEventListener('click', function() {
            cartPopup.style.display = 'none';
        });

        cartPopup.querySelector('.mask').addEventListener('click', function() {
            cartPopup.style.display = 'none';
        });
    }
};
generateCart();
function addToCart(productId, productName, productPrice, productImage) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartVisuals();


}
function updateCartVisuals() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.querySelector(".cart_items");
    const cartCountElement = document.querySelector(".select_cart_items p span");

    cartItemsContainer.innerHTML = '';
    cartCountElement.textContent = `(${cart.length})`;

    cart.forEach(item => {
        const cartItem = document.createElement("li");
        cartItem.classList.add("cart_item");

        cartItem.innerHTML = `
            <div class="cart_item_select">
                <input type="checkbox" name="product" value="${item.id}">
            </div>
            <div class="cart_item_image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart_item_info">
                <p class="title">${item.name}</p>
                <div class="cart_item_actions">
                    <p class="price">$${item.price}</p>
                    <div class="quantity">
                        <button class="button increment">+</button>
                        <p class="value_qty">${item.quantity}</p>
                        <button class="button decrement">-</button>
                    </div>
                </div>
            </div>
        `;

        cartItem.querySelector(".increment").addEventListener("click", () => {
            item.quantity += 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartVisuals();
        });

        cartItem.querySelector(".decrement").addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart.splice(cart.indexOf(item), 1);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartVisuals();
        });

        cartItemsContainer.appendChild(cartItem);
    });

    updateCartTotal();
}
function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalSummaryElement = document.querySelector(".total_summary span:nth-child(2)");
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    totalSummaryElement.textContent = `$${total}`;
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
                const productType = product.type_product;
                const URL_3D_MODEL = `${window.location.origin}/assets/models/${product.model_url}`

                // create product
                const createdProduct = createProduct(productName, productPrice, productImage, productColors, productType, productId);
                productsContainer.appendChild(createdProduct);
                
                const ImageContainer = createdProduct.querySelector(".image_product_container");
                const colorInputs = createdProduct.querySelectorAll("input[data-color]");
                const selectedColorInput = Array.from(colorInputs).find(input => input.checked);
                let selectedColor = selectedColorInput ? selectedColorInput.getAttribute("data-color") : 'white';
                colorInputs.forEach((input) => {
                    input.addEventListener("click", function(){
                        selectedColor = input.getAttribute("data-color");
                        updatePreviewProduct(productPrice);
                        updateSizingProduct(productName);
                        updateMerchPreview(URL_3D_MODEL, productType, productName).then(() => {
                            updateClothingColor(clothingModels[productType], selectedColor);
                        }).catch((error) => {
                            console.error("Error loading model or applying color:", error);
                        });
                    });
                });

                ImageContainer.addEventListener("click", function(){
                    updatePreviewProduct(productPrice);
                    updateSizingProduct(productName);
                    updateMerchPreview(URL_3D_MODEL, productType, productName).then(() => {
                        updateClothingColor(clothingModels[productType], selectedColor);
                    }).catch((error) => {
                        console.error("Error loading model or applying color:", error);
                    });
                
                });
                createdProduct.addEventListener("click", function(){
                    const btnDetails = document.getElementById("btn_details");
                    if(btnDetails){
                        btnDetails.addEventListener("click", function(){
                            const previewProduct = generatePreviewProduct(productName, productPrice);
                            document.body.appendChild(previewProduct);
                            uploadModelDetails(productType);
                            closePreviewProduct(productName);
                            const colors = previewProduct.querySelectorAll('[name="color_product"]');
                            updateColorMerchPreview(colors, productType);
                            updateSizing(productName);
                        });
                    }
                })


                // cart 
                const addToCartBtn = createdProduct.querySelector(".botton_add_to_cart")
                addToCartBtn.addEventListener("click", function() {
                    const productId = this.getAttribute("data-id");
                    const productName = this.getAttribute("data-name");
                    const productPrice = parseFloat(this.getAttribute("data-price"));
                    const productImage = this.getAttribute("data-image");
                
                    addToCart(productId, productName, productPrice, productImage);
                });


       
            } else {
                return null;
            }
        });
       
    } catch (error) {
        console.error('Error data:', error);
    }
}

// Carousel functionality
const carousel = document.querySelector('.carousel');
const objects = document.querySelectorAll('.rotating_object');
const container = document.querySelector('.scene_3d');
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
                const clothingModel = clothingModels['upper']; 
                if (clothingModel) {
                    clothingModel.traverse((child) => {
                        if (child.isMesh) {
                            child.material.color.set(getColorHex(color));
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
        const x = Math.cos(offsetAngle) * 160;
        const y = Math.sin(offsetAngle) * 100;
        const z = Math.sin(offsetAngle) * 60;

        object.style.transform = `
            translateX(${x}px) 
            translateZ(${z}px) 
            translateY(${y}px)`; 
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
loadModel(URL_MAN_MANNEQUIN).then((loadedMannequin) => {
    model = loadedMannequin;
    const T_SHIRT_URL = `${window.location.origin}/assets/models/t_shirt.gltf`; ;
    const SHORT_S_URL = `${window.location.origin}/assets/models/short_s.gltf`;;
    wearClothing(T_SHIRT_URL, 'upper', 't-shirt' );
    wearClothing(SHORT_S_URL, 'lower', 'short_s' );
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

document.addEventListener('DOMContentLoaded', () => {


    fetchProducts();
    setInterval(positionObjects, 16);
    initCarousel();




  // Function to close all popups TEMP
function closeAllPopups() {
    const popupCategory = document.getElementById("popup_category");
    const popupSort = document.getElementById("popup_sort");
    const popupFilter = document.getElementById("popup_filter");
    const popupSearch = document.getElementById("popup_search");
    const popupSearchNav = document.querySelector(".popup_search_nav");
    const triggerElementSort = document.querySelector(".dropdown_sort");
    const triggerElementCategory = document.querySelector(".dropdown_category");

    if(popupCategory && popupSort && popupFilter && popupSearch && popupSearchNav && triggerElementSort && triggerElementCategory){
        popupCategory.style.display = "none";
        popupSort.style.display = "none";
        popupFilter.style.display = "none";
        popupSearch.style.display = "none";
        popupSearchNav.style.display = "none";
        const arrow1 = triggerElementCategory.querySelector('.arrow');
        const arrow2 = triggerElementSort   .querySelector('.arrow');
        arrow1.style.transform = "rotate(0)";
        arrow2.style.transform = "rotate(0)";
    } 
}

// Popup Category TEMP
const popupCategory = document.getElementById("popup_category");
const triggerElementCategory = document.querySelector(".dropdown_category");

if (popupCategory && triggerElementCategory) {
    const arrow = triggerElementCategory.querySelector('.arrow');

    triggerElementCategory.addEventListener("click", function(event) {
        closeAllPopups(); 
        popupCategory.style.display = "block";
        arrow.style.transform = "rotate(180deg)";
        event.stopPropagation();
    });

    window.addEventListener("click", function(event) {
        if (!popupCategory.contains(event.target)) {
            popupCategory.style.display = "none";
            arrow.style.transform = "rotate(0)";
        }
    });

    popupCategory.addEventListener("click", function(event) {
        event.stopPropagation();
    });
}

// Popup Sort TEMP
const popupSort = document.getElementById("popup_sort");
const triggerElementSort = document.querySelector(".dropdown_sort");

if (popupSort && triggerElementSort) {
    const arrow = triggerElementSort.querySelector('.arrow');
    triggerElementSort.addEventListener("click", function(event) {
        closeAllPopups(); 
        popupSort.style.display = "block";
        arrow.style.transform = "rotate(180deg)";
        event.stopPropagation();
    });

    window.addEventListener("click", function(event) {
        if (!popupSort.contains(event.target)) {
            popupSort.style.display = "none";
            arrow.style.transform = "rotate(0)";
        }
    });

    popupSort.addEventListener("click", function(event) {
        event.stopPropagation();
    });
}

// Popup Filter TEMP
const popupFilter = document.getElementById("popup_filter");
const triggerElementFilter = document.getElementById("btn_filters");

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
const triggerElementSearch = document.querySelector(".search_form");
if (popupSearch && triggerElementSearch) {
    triggerElementSearch.addEventListener("click", function(event) {
        closeAllPopups();
        popupSearch.style.display = "flex";
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

if(btnOpenCart && popupCart && btnCloseCart){
    btnCloseCart.addEventListener("click", function(){
        popupCart.style.display = "none";
    });
    btnOpenCart.addEventListener("click", function(){
        popupCart.style.display = "flex";
    });
}

// Popup search nav TEMP
const popupSearchNav = document.querySelector(".popup_search_nav");
const triggerElementSearchNav = document.getElementById("search_btn");
const btnCloseSearchNav = document.getElementById("close_nav_search");

if (popupSearchNav && triggerElementSearchNav && btnCloseSearchNav) {
    triggerElementSearchNav.addEventListener("click", function(event) {
        closeAllPopups(); 
        popupSearchNav.style.display = "flex";
        event.stopPropagation();
    });

    window.addEventListener("click", function(event) {
        if (!popupSearchNav.contains(event.target)) {
            popupSearchNav.style.display = "none";
        }
    });

    popupSearchNav.addEventListener("click", function(event) {
        event.stopPropagation();
    });
    btnCloseSearchNav.addEventListener("click", function(event) {
        popupSearchNav.style.display = "none";
    });
    
}


let rangeInput = document.querySelectorAll(".range-input input");
let rangeText = document.querySelectorAll(".text-range div");
let range = document.querySelector(".progress");
let priceMax = rangeInput[0].max;
let priceGap = 300;


rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minVal = parseInt(rangeInput[0].value),
      maxVal = parseInt(rangeInput[1].value);

    if (maxVal - minVal < priceGap) {
      if (e.target.className === "range-min") {
        minVal = rangeInput[0].value = maxVal - priceGap;
      } else {
        maxVal = rangeInput[1].value = minVal + priceGap;
      }
    }
    range.style.left = (minVal / priceMax) * 100 + "%";
    range.style.right = 100 - (maxVal / priceMax) * 100 + "%";

    rangeText[0].style.left = (minVal / priceMax) * 100 + "%";
    rangeText[1].style.right = 100 - (maxVal / priceMax) * 100 + "%";

    rangeText[0].innerText  = minVal.toLocaleString();
    rangeText[1].innerText  = maxVal.toLocaleString();
  });
});


});