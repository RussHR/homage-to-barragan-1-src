export default {
    init() {
        this.findDomElements();
        this.renderAnim();
    },

    findDomElements() {
        this.appEl = document.getElementById('homage-to-barragan-interior-app');
    },

    renderAnim(timestamp) {
        const time = timestamp || 0;
        console.log(Math.sin(time / 1000));
        requestAnimationFrame((time) => this.renderAnim(time));
    }
};