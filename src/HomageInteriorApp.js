import throttle from 'lodash/throttle';

const THREE = require('three');

const cameraDistance = 10;

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
        const boxGeometry =  new THREE.TorusGeometry(0.75, 0.4, 5, 5, 3.4);
        const color = new THREE.Color(0xffffff);
        const material = new THREE.MeshBasicMaterial({ color });
        const boxMesh = new THREE.Mesh(boxGeometry, material);
        boxMesh.castShadow = true;
        this.scene.add(boxMesh);

        // ground plane
        const planeColor = new THREE.Color(0x90C3D4);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: planeColor });
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

        // directional light helper, comment out before resolving
        const directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight);
        this.scene.add(directionalLightHelper);
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
        this.renderer.setClearColor(new THREE.Color(0xd8e6ff));

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
        const lightAngle = time / 2500;
        this.directionalLight.position.set(Math.cos(lightAngle), Math.sin(lightAngle), 0);

        // move the camera
        const cameraAngle = time / 2500;
        this.camera.position.set(cameraDistance * Math.sin(cameraAngle), 0, cameraDistance * Math.cos(cameraAngle));
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame((timestamp) => this.renderAnim(timestamp));
    }
};