import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


window.addEventListener('load', (e) => {

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

    // Set up the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 300 / 600, 0.5, 1000);
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
        'assets/models/mannequin2/scene.gltf',
        (gltf) => {
            model = gltf.scene;
            model.position.set(0, -5.5, 0);
            model.scale.set(2.5, 2.5, 2.5);

            model.traverse((child) => {
                if (child.name === 'Object_68') { 
                    console.log(child.material)
                    child.material.emissive.set(colorUpdate()); 
                }
            });
            scene.add(model);
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
    let rotationSpeed = 0.01;
    let clickActive = false;
    let clickTimeout;
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
            object.style.zIndex = Math.round(z + 10);

            if (Math.abs(x) < 1 && z > 0 && !clickActive) {
                const color = object.getAttribute('data-color');
                if (model) {
                    model.traverse((child) => {
                        if (child.name === 'Object_68') { 
                            child.material.emissive.set(colorUpdate(color)); 
                        }
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
            targetAngle = -((objectIndex - 1.5) * (Math.PI / 3));
            const color = object.getAttribute('data-color');
            if (model) {
                model.traverse((child) => {
                    if (child.name === 'Object_68') { 
                        child.material.emissive.set(colorUpdate(color)); 
                    }
                });
            }
            currentIndex = object.getAttribute('data-index');
            updateCarousel(currentIndex);
            clickTimeout = setTimeout(() => {
                clickActive = false;
            }, 1500);
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
