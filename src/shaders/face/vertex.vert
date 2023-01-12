uniform float time;
varying vec3 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
float PI = 3.14159265;
void main(){
  vUv = position;
  vec3 newPosition = position;
  newPosition.z += 0.1 * sin(10. * newPosition.x + time);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}