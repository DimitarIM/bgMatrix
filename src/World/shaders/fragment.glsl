#define PI 3.1415926535897932384626433832795

precision mediump float;
varying vec2 vUv;

void main() {
    float str = 1.0 - step(0.49, vUv.x) + step(0.51, vUv.x);
    // if(str < 0.5) {
    //     str = 1.0 - step(0.49, str);
    // }
    // else {
    //     str = step(0.51, str);
    // }

    vec3 blackColor = vec3(0.0);
    
    
    gl_FragColor = vec4(str, str, str, 1.0);
}