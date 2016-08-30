import throttle from 'lodash/throttle';

const THREE = require('three');

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
        const vector = new THREE.Vector3();
        vector.x = 1;
        vector.y = 1;
        vector.unproject(this.camera);
        const direction = vector.sub(this.camera.position).normalize();
        const distance = -this.camera.position.z / direction.z;
        const position = this.camera.position.clone().add(direction.multiplyScalar(distance));
        console.log(position.x, position.y);

        const boxGeometry =  new THREE.BoxGeometry(5, 5, 5);
        const color = new THREE.Color(0xffffff);
        const material = new THREE.MeshBasicMaterial({ color });
        const boxMesh = new THREE.Mesh(boxGeometry, material);
        this.scene.add(boxMesh);
    },

    initializeLights() {
        const ambientLight = new THREE.AmbientLight(0x4B4B4B);
        this.scene.add(ambientLight);
    },

    initializeCamera() {
        const { innerHeight, innerWidth } = window;
        this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
        this.camera.position.z = 120;
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
        // console.log(Math.sin(time / 1000));
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame((timestamp) => this.renderAnim(timestamp));
    }
};