import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer, EffectPass, GodRaysEffect, RenderPass } from 'postprocessing';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 50000);
var renderer = new THREE.WebGLRenderer({ antialias: true });
var directionalLight, controls, composer;


function init() {

    scene.background = new THREE.Color(0x020202);

    directionalLight = new THREE.DirectionalLight(0xffccaa, 3);
    directionalLight.position.set(0, 0, -1);
    scene.add(directionalLight);

    camera.position.y = 210;
    camera.position.z = 500;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let circleGeo = new THREE.CircleGeometry(220, 50);
    let circleMat = new THREE.MeshBasicMaterial({ color: 0xffccaa });
    let circle = new THREE.Mesh(circleGeo, circleMat);
    circle.position.set(0, 100, -500);
    circle.scale.setX(1.2);
    scene.add(circle);

    const godraysEffect = new GodRaysEffect(camera, circle, {
        resolutionScale: 1,
        density: 0.6,
        decay: 0.95,
        weight: 0.9,
        samples: 100
    });

    let renderPass = new RenderPass(scene, camera);
    let effectPass = new EffectPass(camera, godraysEffect);
    effectPass.renderToScreen = true;

    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(effectPass);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', renderer);

    objectSetup();
}


function objectSetup() {

    const loader = new GLTFLoader();
    loader.load('./scene.gltf', function (gltf) {
        const logo = gltf.scene.children[0];
        logo.scale.set(100, 100, 100);
        scene.add(gltf.scene);
        animate();
    });
}

function animate() {
    composer.render(0.1);
    requestAnimationFrame(animate);
}

init();