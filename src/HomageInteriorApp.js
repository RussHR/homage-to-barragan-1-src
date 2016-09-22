import throttle from 'lodash/throttle';

const THREE = require('three');

const cameraDistance = 10;
const colorDayR = 216 / 255;
const colorDayG = 230 / 255;
const colorDayB = 1;
const colorEveningR = 240 / 255;
const colorEveningG = 196 / 255;
const colorEveningB = 146 / 255;

export default {
    init() {
        this.findDomElements();

        this.scene = new THREE.Scene();

        this.initializeLights();
        this.initializeCamera();
        this.initializeRenderer();
        this.initializeMeshes();

        this.attachListeners();

        this.renderAnim(0);
    },

    findDomElements() {
        this.appEl = document.getElementById('homage-to-barragan-interior-app');
    },

    initializeMeshes() {
        // center shape
        const centerGeometry =  new THREE.TorusGeometry(0.75, 0.4, 20, 5, 3.4);
        const color = new THREE.Color(0xffffff);
        const material = new THREE.MeshPhongMaterial({ color });
        this.centerMesh = new THREE.Mesh(centerGeometry, material);
        this.centerMesh.castShadow = true;
        this.centerMesh.receiveShadow = true;
        this.scene.add(this.centerMesh);

        // ground plane
        const planeColor = new THREE.Color(0x90C3D4);
        const planeMaterial = new THREE.MeshPhongMaterial({ color: planeColor });
        const planeGeometry =  new THREE.PlaneGeometry(20, 20);
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.rotation.x = -Math.PI / 2;
        planeMesh.position.y = -0.5;
        planeMesh.receiveShadow = true;
        this.scene.add(planeMesh);

        // back plane
        const backPlaneColor = new THREE.Color(0xeeeeee);
        const backPlaneMaterial = new THREE.MeshLambertMaterial({ color: backPlaneColor });
        const backPlaneGeometry =  new THREE.PlaneGeometry(20, 7);
        const backPlaneMesh = new THREE.Mesh(backPlaneGeometry, backPlaneMaterial);
        backPlaneMesh.position.y = 3;
        backPlaneMesh.position.z = -10;
        backPlaneMesh.castShadow = true;
        backPlaneMesh.receiveShadow = true;
        this.scene.add(backPlaneMesh);

        // front plane
        const frontPlaneColor = new THREE.Color(0xaaaaaa);
        const frontPlaneMaterial = new THREE.MeshLambertMaterial({ color: frontPlaneColor });
        const frontPlaneGeometry =  new THREE.PlaneGeometry(20, 7);
        const frontPlaneMesh = new THREE.Mesh(frontPlaneGeometry, frontPlaneMaterial);
        frontPlaneMesh.position.y = 3;
        frontPlaneMesh.position.z = 10;
        frontPlaneMesh.rotation.y = Math.PI;
        frontPlaneMesh.castShadow = true;
        frontPlaneMesh.receiveShadow = true;
        this.scene.add(frontPlaneMesh);

        // left plane
        const leftPlaneColor = new THREE.Color(0xcccccc);
        const leftPlaneMaterial = new THREE.MeshLambertMaterial({ color: leftPlaneColor });
        const leftPlaneGeometry =  new THREE.PlaneGeometry(20, 7);
        const leftPlaneMesh = new THREE.Mesh(leftPlaneGeometry, leftPlaneMaterial);
        leftPlaneMesh.position.x = -10;
        leftPlaneMesh.position.y = 3;
        leftPlaneMesh.rotation.y = Math.PI / 2;
        leftPlaneMesh.castShadow = true;
        leftPlaneMesh.receiveShadow = true;
        this.scene.add(leftPlaneMesh);

        // right plane
        const rightPlaneColor = new THREE.Color(0xbbbbbb);
        const rightPlaneMaterial = new THREE.MeshLambertMaterial({ color: rightPlaneColor });
        const rightPlaneGeometry =  new THREE.PlaneGeometry(20, 7);
        const rightPlaneMesh = new THREE.Mesh(rightPlaneGeometry, rightPlaneMaterial);
        rightPlaneMesh.position.x = 10;
        rightPlaneMesh.position.y = 3;
        rightPlaneMesh.rotation.y = -Math.PI / 2;
        rightPlaneMesh.castShadow = true;
        rightPlaneMesh.receiveShadow = true;
        this.scene.add(rightPlaneMesh);
    },

    initializeLights() {
        const ambientLight = new THREE.AmbientLight(0x4B4B4B);
        this.scene.add(ambientLight);


        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
        this.directionalLight.position.set(1, 0, 0);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);
    },

    initializeCamera() {
        const { innerHeight, innerWidth } = window;
        this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
        this.camera.position.z = cameraDistance;
        this.camera.lookAt(this.scene.position);
    },

    initializeRenderer() {
        const { innerHeight, innerWidth } = window;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(innerWidth, innerHeight);

        while (this.appEl.hasChildNodes()) {
            this.appEl.removeChild(this.appEl.firstChild);
        }

        this.appEl.appendChild(this.renderer.domElement);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        this.renderer.render(this.scene, this.camera);
    },

    attachListeners() {
        this._onWindowResize = throttle(() => this.onWindowResize(), 16.667);
        window.addEventListener('resize', this._onWindowResize);
    },

    onWindowResize() {
        const { innerHeight, innerWidth } = window;
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    },

    renderAnim(time) {
        // move the light
        const lightAngle = time / 11111;
        this.directionalLight.position.set(50 * Math.cos(lightAngle), 50 * Math.abs(Math.sin(lightAngle)), 0);

        // move the camera
        const cameraAngle = time / 6666;
        this.camera.position.set(cameraDistance * Math.sin(cameraAngle), 0, cameraDistance * Math.cos(cameraAngle));
        this.camera.lookAt(this.scene.position);

        // rotate center shape
        this.centerMesh.rotation.y = cameraAngle;

        // change sky color
        const angleFromCenter = Math.abs((lightAngle % Math.PI) - (0.5 * Math.PI));
        const eveningRatio = angleFromCenter / (0.5 * Math.PI);
        const dayRatio = 1 - eveningRatio;
        this.renderer.setClearColor(new THREE.Color(
            colorDayR * dayRatio + colorEveningR * eveningRatio,
            colorDayG * dayRatio + colorEveningG * eveningRatio,
            colorDayB * dayRatio + colorEveningB * eveningRatio
        ));

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame((timestamp) => this.renderAnim(timestamp));
    }
};