const THREE = require('three');

export default {
    init() {
        this.findDomElements();
        this.scene = new THREE.Scene();
        this.initializeLights();
        this.initializeCamera();
        this.initializeRenderer();

        this.renderAnim(0);
    },

    findDomElements() {
        this.appEl = document.getElementById('homage-to-barragan-interior-app');
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

        while (this.appEl.hasChildNodes()) {
            this.appEl.removeChild(this.appEl.firstChild);
        }

        this.appEl.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
    },

    renderAnim(timestamp) {
        // console.log(Math.sin(time / 1000));
        requestAnimationFrame((timestamp) => this.renderAnim(timestamp));
    }
};