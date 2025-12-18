import * as THREE from "three";
import World from "../World";
import { gsap } from "gsap";

export default class Background {
    constructor(bgParams) {
        const { squareScale, squareOutlineWidth, boundRows, boundCols } = bgParams;

        this.world = new World();
        this.scene = this.world.scene;
        this.debug = this.world.debug;

        this.squareScale = squareScale;
        this.squareOutlineWidth = squareOutlineWidth;
        this.boundRows = boundRows;
        this.boundCols = boundCols;
        this.squareDefaultColor = new THREE.Color("black");
        this.squareOutlineColor = new THREE.Color("red");

        this.background = new THREE.Group();
        this.setBackground();

        this.waveParams = {
            startRow: Math.floor(this.boundRows / 2),
            startCol: 0,
            timeInterval: 20,
            colorChange: new THREE.Color("red"),
        }

        this.waveActive = false;
        this.waveT0 = 0;
        this.waveColor = this.waveParams.colorChange;
        this.waveAnimResolve = null;

        //DEBUG
        if (this.debug.active) {
            this.debug.ui.addColor(this, 'waveColor').name("waveColor");
        }
    }

    setBackground() {
        const geometry = new THREE.PlaneGeometry(this.squareScale, this.squareScale, this.squareScale);
        const outlineMaterial = new THREE.MeshBasicMaterial({ color: this.squareOutlineColor });

        for (let boundNum = 0; boundNum < 2; boundNum++) {

            const bound = new THREE.Group();

            for (let row = 0; row < this.boundRows; row++) {
                for (let col = 0; col < this.boundCols; col++) {
                    const planeMaterial = new THREE.MeshStandardMaterial({ color: this.squareDefaultColor });

                    const plane = new THREE.Mesh(geometry, planeMaterial);
                    const planeOutline = new THREE.Mesh(geometry, outlineMaterial);
                    const square = new THREE.Group();

                    const gap = plane.geometry.parameters.width + this.squareOutlineWidth;

                    plane.rotation.x = - Math.PI * 0.5;

                    planeOutline.position.copy(plane.position);
                    planeOutline.position.y -= 0.1
                    planeOutline.rotation.copy(plane.rotation);
                    planeOutline.scale.multiplyScalar(1 + this.squareOutlineWidth);

                    square.add(plane, planeOutline);
                    square.position.set(col * gap, 0, row * gap);

                    square.userData = { row, col };

                    bound.add(square);
                }
            }
            if (boundNum === 0) {
                this.background.add(bound);
            }
            else if (boundNum === 1) {
                bound.position.y = this.boundCols + 1;
                bound.position.z = this.boundRows * this.squareScale - 2;

                bound.rotation.z = Math.PI;
                bound.rotation.y = Math.PI;

                this.background.add(bound);
            }

        }
        this.scene.add(this.background);

        //DEBUG

        if (this.debug.active) {
            this.debug.ui.addColor(outlineMaterial, 'color').name("squareOutlineColor");
        }
    };

    startAnim(action, state) {
        if (state.name === "initial") {
            if (this.waveActive) return;

            return new Promise((resolve) => {
                const { startRow, startCol, timeInterval, colorChange } = this.waveParams;

                this.waveStartRow = startRow;
                this.waveStartCol = startCol;
                this.timeInterval = timeInterval;
                this.waveColor = colorChange;

                this.waveStartTime = performance.now();

                this.waveActive = true;
                this.waveStep = 0;

                // Calc max distance to the corners 
                const d1 = Math.abs(startRow - 0) + Math.abs(startCol - 0);
                const d2 = Math.abs(startRow - 0) + Math.abs(startCol - (this.boundCols - 1));
                const d3 = Math.abs(startRow - (this.boundRows - 1)) + Math.abs(startCol - 0);
                const d4 = Math.abs(startRow - (this.boundRows - 1)) + Math.abs(startCol - (this.boundCols - 1));

                this.maxDistance = Math.max(d1, d2, d3, d4);
                this.waveAnimResolve = resolve;
            })
        }

    }

    waveAnim() {
        const now = Date.now();
        if (!this.waveActive) return;

        if (now - this.waveT0 >= this.timeInterval) {
            this.waveT0 = now;

            const step = this.waveStep;
            const prevStep = step - 1;

            // Start waving
            this.background.children.forEach(bound => {
                bound.children.forEach(square => {
                    const { row, col } = square.userData;
                    const distance = Math.abs(row - this.waveStartRow) + Math.abs(col - this.waveStartCol);
                    const squareMaterial = square.children[0].material;
                    if (distance === prevStep) {
                        squareMaterial.color.set(this.squareDefaultColor);
                        gsap.to(square.position, {
                            y: 0,
                            ease: "power2.in",
                            duration: 0.2,
                        })
                    }

                    if (distance === step) {
                        squareMaterial.color.set(this.waveColor);
                        gsap.to(square.position, {
                            y: 1,
                            ease: "power2.out",
                            duration: 0.4,
                        })
                    }
                });
            });

            this.waveStep++;

            if (this.waveStep > this.maxDistance + 1) {
                this.waveActive = false;
                this.waveAnimResolve();
            }
        }

    }

    update() {
        this.waveAnim();
    }
}