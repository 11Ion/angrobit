import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


window.addEventListener('load', (e) => {


    // load preview elements animation
    {
        const contentElement = document.querySelector(".preview_content");
        const lightElement = document.querySelector(".preview_light_element");
        function animatePreview(content, light){
            if(content && light){
                light.style.opacity = 1;
                setTimeout(function(){
                    content.style.opacity = 1;
                }, 500);
            }
        };
        animatePreview(contentElement, lightElement);
    }

    //open popup

    {
        const handleDetails = document.getElementById("handleDetails");
        const popup = document.querySelector(".preview_product");
        const handleClose = document.querySelector(".button_close");
        const mask = document.querySelector(".mask");
        if(handleDetails && popup && handleClose && mask){
        handleDetails.addEventListener("click", function(){
            popup.style.display = "flex";

            handleClose.addEventListener("click", function(){
                popup.style.display = "none";
            });
            mask.addEventListener("click", function(){
                popup.style.display = "none";
            });
        });
    }

    }

    const colorUpdate = (color) => {
        switch (color) {
            case 'white':
                return 0xffffff;
            case 'black':
                return 0x000000;
            case 'yellow':
                return 0xffff00;
            case 'green':
                return 0x00ff00;
            case 'purple':
                return 0x800080;
            case 'burlywood':
                return 0xdeb887;
            default:
                return 0x000000;
        }
    };

    // Functie pentru animatie lina de rotire (pentru oricare axa)
    function animateRotation(child, startRotation, endRotation, duration, axis = 'x') {
    const startTime = performance.now();

    function update() {
        const currentTime = performance.now();
        const elapsed = (currentTime - startTime) / duration;
        if (elapsed < 1) {
            const currentRotation = startRotation + (endRotation - startRotation) * easeInOut(elapsed);
            if (axis === 'x') {
                child.rotation.x = currentRotation;
            } else if (axis === 'y') {
                child.rotation.y = currentRotation;
            }
            requestAnimationFrame(update); 
        } else {
            if (axis === 'x') {
                child.rotation.x = endRotation; 
            } else if (axis === 'y') {
                child.rotation.y = endRotation; 
            }
        }
    }
    
    update();
    }

    function resetOtherParts() {
        model.traverse((child) => {
            if (child.name === 'RightHand_38_43') { 
                // child.rotation.y = 0;
                const startRotation = 2; 
                const endRotation = 0;  
                const duration = 1000;  
                animateRotation(child, startRotation, endRotation, duration, 'y');

            }
            if (child.name === 'RightArm_40_45') { 
                // child.rotation.x = Math.PI / 3;
                const startRotation = Math.PI / 4.5; 
                const endRotation = Math.PI / 3;
                const duration = 1000;
    
                animateRotation(child, startRotation, endRotation, duration, 'x');
            }
            if (child.name === 'RightForeArm_39_44') { 
                // child.rotation.x  =  0;
                const startRotation = -1.5; 
                const endRotation = 0;
                const duration = 1000;
    
                animateRotation(child, startRotation, endRotation, duration, 'x');
            }

        });
    }

    // Functie de easing pentru animatie lina
    function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
        
    // Set up the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 900, 0.5, 1000);
    camera.position.z = 4;
    camera.position.x = 21;
    const canvas = document.querySelector('.model');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(400, 900);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // Load the GLTF model
    let model;
    const loader = new GLTFLoader();
    loader.load(
        'assets/models/mannequin/scene.gltf',
        (gltf) => {
            model = gltf.scene;
            model.position.set(0, -5.5, 0);
            model.scale.set(2.5, 2.5, 2.5);

            model.traverse((child) => {
                // console.log(child.name)

                if (child.name === 'Object_68') { 
                    // console.log(child.material)
                    child.material.emissive.set(colorUpdate()); 
                }
                if (child.name === 'LeftArm_21_26') { 
                    child.rotation.x = Math.PI / 3;
                }
                if (child.name === 'RightArm_40_45') { 
                    child.rotation.x = Math.PI / 3;
                }
                if (child.name === 'Object_66') { 
                    child.visible = false;
                }
                if (child.name === 'HololensOpaque_opaque_0001_62') { 
                    child.visible = false;
                }
            });
            scene.add(model);

            let clicked = false;

            canvas.addEventListener("click", () => {
                if (clicked) return; 
            
                clicked = true; 
            
                model.traverse((child) => {
                    if (child.name === 'RightForeArm_39_44') {
                        const startRotation = -1.5;
                        const endRotation = -2.2; 
                        const duration = 1000; 
                        const cycles = 2; 
                        const totalDuration = duration * cycles * 2; 
                        let startTime = performance.now();
                        
                        function animate() {
                            const elapsed = performance.now() - startTime;
                            const progress = (elapsed % duration) / duration;
                            const oscillation = Math.sin(progress * Math.PI * 2);
                            child.rotation.x = startRotation + (endRotation - startRotation) * (0.5 * (oscillation + 1));
            
                            if (elapsed < totalDuration) {
                                requestAnimationFrame(animate);
                            } else {
                                child.rotation.x = startRotation; 
                                resetOtherParts(); 
                                clicked = false; 
                            }
                        }
            
                        animate();
                    }
            
                    if (child.name === 'RightHand_38_43') { 
                        const startRotationY = child.rotation.y; 
                        const endRotationY = 2;  
                        const duration = 1000;  
            
                        animateRotation(child, startRotationY, endRotationY, duration, 'y'); 
                    }
            
                    if (child.name === 'RightArm_40_45') { 
                        const startRotation = child.rotation.x; 
                        const endRotation = Math.PI / 4.5; 
                        const duration = 1000;
            
                        animateRotation(child, startRotation, endRotation, duration, 'x');
                    }
                });
            });
            
        },
        undefined,
        (error) => {
            console.error('An error happened:', error);
        }
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableZoom = false;  
    // controls.enableRotate = false; //
    controls.minDistance = 10;  
    controls.maxDistance = 10;

    

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = 400 / 900;
        camera.updateProjectionMatrix();
        renderer.setSize(400, 900);
    });

    const objects = document.querySelectorAll('.rotating_object');
    const carousel = document.querySelector('.carousel');

    let angle = 0;
    let isAnimating = true;
    let targetAngle = null;
    let rotationSpeed = 0.005;
    let clickActive = false;
    // let clickTimeout;
    let currentIndex = 0;

    function updateCarousel(currentIndex) {
        const offset = -currentIndex * 100;
        carousel.style.transform = `translateX(${offset}%)`;
    }


    function rotateHorizontal() {
        if (isAnimating) {
            if (targetAngle !== null) {
                const delta = targetAngle - angle;
                angle += delta * 0.09;
                if (Math.abs(delta) < 0.001) {
                    targetAngle = null;
                }
            } else {
                angle += rotationSpeed;
            }
        }

        objects.forEach((object, index) => {
            const offsetAngle = angle + (index * (Math.PI / 3));
            const x = Math.cos(offsetAngle) * 165.2;
            const y = Math.sin(offsetAngle) * 100;
            const z = Math.sin(offsetAngle) * 300;

            object.style.transform = `translateX(${x}px) translateZ(${z}px) translateY(${y}px)`;
            object.style.zIndex = Math.round(z + 5);

            if (Math.abs(x) < 1 && z > 0 && !clickActive) {
                const color = object.getAttribute('data-color');
                if (model) {
                    model.traverse((child) => {
                        if (child.name === 'Object_68') { 
                            child.material.emissive.set(colorUpdate(color)); 
                        }
                       // if (child.name === 'LeftArm_21_26') { 
                            // child.rotation.x = Math.PI / 2.7;
                            // animateRotation(child, Math.PI / 3); 
    
                        //}
                        //if (child.name === 'RightArm_40_45') { 
                            // child.rotation.x = Math.PI / 2.7;
                            // animateRotation(child, Math.PI / 3); 
                        //}

                    });
                }
                currentIndex = object.getAttribute('data-index');
                updateCarousel(currentIndex);
            }
        });

        requestAnimationFrame(rotateHorizontal);
    }

    objects.forEach(object => {
        object.addEventListener('click', () => {
            clickActive = true;
            const objectIndex = Array.from(objects).indexOf(object);
            targetAngle = -((objectIndex - 1.45) * (Math.PI / 3));
            const color = object.getAttribute('data-color');
            if (model) {
                model.traverse((child) => {
                    if (child.name === 'Object_68') { 
                        child.material.emissive.set(colorUpdate(color)); 
                    }
                    //if (child.name === 'LeftArm_21_26') { 
                        // child.rotation.x = Math.PI / 2.7;
                        // animateRotation(child, Math.PI / 2.7); 

                    //}
                    //if (child.name === 'RightArm_40_45') { 
                        // child.rotation.x = Math.PI / 2.7;
                        // animateRotation(child, Math.PI / 2.7); 
                    //}
                });
            }
            currentIndex = object.getAttribute('data-index');
            updateCarousel(currentIndex);
            // clickTimeout = setTimeout(() => {
            //     clickActive = false;
            // }, 3000);
        });
    });

    const resetClickActive = () => {
        if (clickActive) {
            clickTimeout = setTimeout(() => {
                clickActive = false;
            }, 3000);
        }
    };

    window.addEventListener('mousemove', resetClickActive);
    window.addEventListener('click', resetClickActive);

    rotateHorizontal();
});
