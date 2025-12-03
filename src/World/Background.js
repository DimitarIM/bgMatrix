import * as THREE from "three";
import World from "./World";

export default class Background {
    constructor(squareScale, squareOutlineWidth, squareDefaultColor, squareOutlineColor, boundRows, boundCols) {
        this.squareScale = squareScale;
        this.squareOutlineWidth = squareOutlineWidth;

        this.squareDefaultColor = squareDefaultColor;
        this.squareOutlineColor = squareOutlineColor;

        this.boundRows = boundRows;
        this.boundCols = boundCols;

        this.background = new THREE.Group();
        this.world = new World();
        this.scene = this.world.scene;

        this.setBounds();

        this.time = this.world.time;


        this.waveActive = false;
        this.waveStep = 0;
        this.waveStartTime = 0;

        this.setBoundEffects(Math.floor(this.boundCols / 2), 0, 20, 'red');
    }

    setBounds() {
        const geometry = new THREE.PlaneGeometry(this.squareScale, this.squareScale, this.squareScale);
        const outlineMaterial = new THREE.MeshBasicMaterial({ color: this.squareOutlineColor });

        for (let boundNum = 0; boundNum < 2; boundNum++) {

            const bound = new THREE.Group();

            for (let row = 0; row < this.boundRows; row++) {
                for (let col = 0; col < this.boundCols; col++) {
                    const planeMaterial = new THREE.MeshBasicMaterial({ color: this.squareDefaultColor });

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
                bound.position.y = this.boundRows + 1;
                bound.position.z = this.boundCols * this.squareScale

                bound.rotation.z = Math.PI;
                bound.rotation.y = Math.PI;

                this.background.add(bound);
            }

        }
        this.scene.add(this.background);
    };

    setBoundEffects(startRow, startCol, timeInterval, colorChange) {
        window.addEventListener('click', () => {
            if (this.waveActive) return; 

            // Calc max distance to corners
            const d1 = Math.abs(startRow - 0) + Math.abs(startCol - 0);
            const d2 = Math.abs(startRow - 0) + Math.abs(startCol - (this.boundCols - 1));
            const d3 = Math.abs(startRow - (this.boundRows - 1)) + Math.abs(startCol - 0);
            const d4 = Math.abs(startRow - (this.boundRows - 1)) + Math.abs(startCol - (this.boundCols - 1));

            this.maxDistance = Math.max(d1, d2, d3, d4);

            this.waveActive = true;
            this.waveStep = 0;
            this.timeInterval = timeInterval;
            this.waveColor = colorChange;
            this.waveStartRow = startRow;
            this.waveStartCol = startCol;
            this.waveStartTime = performance.now();
        });
    }

    update() {
        if (!this.waveActive) return;
        const now = performance.now();

        if (now - this.waveStartTime >= this.timeInterval) {
            this.waveStartTime = now;

            const step = this.waveStep;
            const prevStep = step - 1;

            // Simulate the wave
            this.background.children.forEach(bound => {
                bound.children.forEach(square => {

                    const { row, col } = square.userData;
                    const distance = Math.abs(row - this.waveStartRow) + Math.abs(col - this.waveStartCol);

                    if (distance === prevStep) {
                        square.children[0].material.color.set(this.squareDefaultColor);
                    }

                    if (distance === step) {
                        square.children[0].material.color.set(this.waveColor);
                    }
                });
            });

            this.waveStep++;

            if (this.waveStep > this.maxDistance + 1) {
                this.waveActive = false;
            }
        }
    }
}