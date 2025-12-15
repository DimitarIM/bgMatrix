#define PI 3.1415926535897932384626433832795

precision mediump float;

uniform vec3 uColor;
uniform float uOpacity;
uniform float uIncreaseX;
uniform float uIncreaseY;

varying vec2 vUv;

void main() {
    float str = step(uIncreaseX, vUv.x);
    str -= step(1.0 - uIncreaseX, vUv.x);
    
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(0.3,0,0.4);
    vec3 mixedColor = mix(blackColor, uColor, str);
    
    gl_FragColor = vec4(mixedColor, uOpacity);
}