#define PI 3.1415926535897932384626433832795

precision mediump float;

uniform vec3 uColor;
uniform float uIncreaseX;
uniform float uIncreaseY;

varying vec2 vUv;

void main() {
    float str = 1.0 - step(0.50 - uIncreaseY, vUv.y) + step(0.50 + uIncreaseY, vUv.y)
     + 1.0 - step(0.50 - uIncreaseX, vUv.x) + step(0.50 + uIncreaseX, vUv.x);
    
    // if(str < 0.5) {
    //     str = 1.0 - step(0.49, str);
    // }
    // else {
    //     str = step(0.51, str);
    // }

    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(0.3,0,0.4);
    vec3 mixedColor = mix(blackColor,   uColor, str);
    
    gl_FragColor = vec4(mixedColor, 1.0);
}