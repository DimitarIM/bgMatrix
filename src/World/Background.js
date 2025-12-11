import * as THREE from "three";
import World from "./World";
import doorVertexShader from './shaders/doorVertex.glsl';
import doorFragmentShader from './shaders/doorFragment.glsl';
import { gsap}  from "gsap";


export default class Background {
    constructor(squareScale, squareOutlineWidth, squareDefaultColor, squareOutlineColor, boundRows, boundCols) {
        this.squareScale = squareScale;
        this.squareOutlineWidth = squareOutlineWidth;

        this.squareDefaultColor = squareDefaultColor;
        this.squareOutlineColor = squareOutlineColor;

        this.boundRows = boundRows;
        this.boundCols = boundCols;

        this.background = new THREE.Group();
        this.clock = new THREE.Clock();
        this.world = new World();
        this.scene = this.world.scene;

        this.time = this.world.time;

        this.door = this.setDoor();
        
        this.setBounds();
        this.setWaveEffect(Math.floor(this.boundRows / 2), 0, 20, 'red');
    }

    setDoor() {
        this.doorEffect1Duration = 300;
        this.doorEffect2Duration = 600;
        this.newElapsed = 0;
        this.doorOpeningX = 0.00;
        this.doorOpeningY = 0.00;
        this.doorHasOpened = false;
        this.doorEffectsFinished = false;
        const geometry = new THREE.PlaneGeometry(this.boundRows * 3 + 1, this.boundRows + 1, 32, 32)

        const material = new THREE.RawShaderMaterial({
            vertexShader: doorVertexShader,
            fragmentShader: doorFragmentShader,
            uniforms: {
                uColor: { value: new THREE.Color("red") },
                uIncreaseX: { value: this.doorOpeningX },
                uIncreaseY: { value: this.doorOpeningY },
            }

        })

        const door = new THREE.Mesh(geometry, material);
        door.position.y = door.geometry.parameters.height / 2;
        door.position.x -= 1.5;
        door.position.z = door.geometry.parameters.width / 2 - 1.5;
        door.rotation.y = Math.PI * 0.5;
        this.scene.add(door);

        window.addEventListener('click', () => {
            if (!this.doorHasOpened) this.doorEffectT0 = Date.now();
            this.doorHasOpened = true;
        })
        return door;
    }

    doorEffect() {
        if (!this.doorHasOpened || this.doorEffectsFinished) return;
        const now = Date.now();
        const elapsed = now - this.doorEffectT0;
        const nt1 = Math.min(elapsed / this.doorEffect1Duration, 1);
        const nt2 = Math.min((elapsed - this.newElapsed) / this.doorEffect2Duration, 1);
        if(nt1 < 1) this.newElapsed = elapsed;
        

        this.doorOpeningY = THREE.MathUtils.lerp(0, 1, nt1 * nt1);
        this.doorOpeningX = THREE.MathUtils.lerp(0, 0.01, nt1 * nt1);
        
        if(nt1 >= 1) {
            this.doorOpeningX = THREE.MathUtils.lerp(0.01, 1, nt2 * nt2);
        }
        
        this.door.material.uniforms.uIncreaseX.value = this.doorOpeningX;
        this.door.material.uniforms.uIncreaseY.value = this.doorOpeningY;
        if(nt2 >= 1) this.doorEffectsFinished = true;

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
                bound.position.z = this.boundCols * this.squareScale - 2;

                bound.rotation.z = Math.PI;
                bound.rotation.y = Math.PI;

                this.background.add(bound);
            }

        }
        this.scene.add(this.background);
    };

    setWaveEffect(startRow, startCol, timeInterval, colorChange) {
        this.waveActive = false;
        this.waveT0 = 0;

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

    waveEffect() {
        const now = Date.now();
        if (!this.waveActive) return;

        if (now - this.waveT0 >= this.timeInterval) {
            this.waveT0 = now;

            const step = this.waveStep;
            const prevStep = step - 1;

            // Simulate the wave
            this.background.children.forEach(bound => {
                bound.children.forEach(square => {

                    const { row, col } = square.userData;
                    const distance = Math.abs(row - this.waveStartRow) + Math.abs(col - this.waveStartCol);

                    if (distance === prevStep) {
                        square.children[0].material.color.set(this.squareDefaultColor);
                        gsap.to(square.position, {
                            y:0,
                            ease: "power2.in",
                            duration: 0.2,
                        })
                    }

                    if (distance === step) {
                        square.children[0].material.color.set(this.waveColor);
                        gsap.to(square.position, {
                            y:1,
                            ease: "power2.out",
                            duration: 0.4,
                        })
                        console.log(square.position.y);
                    }
                });
            });

            this.waveStep++;

            if (this.waveStep > this.maxDistance + 1) {
                this.waveActive = false;
            }
        }
    }

    update() {
        this.waveEffect();
        this.doorEffect();
    }
}