varying vec2 vUv;


void main(){
    gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);

    vUv = uv;
}