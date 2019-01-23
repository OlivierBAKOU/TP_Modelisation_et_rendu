"use strict";

var vertex_shader=`#version 300 es
in vec2 point_in;
in vec3 color_in;
out vec3 colorout;
void main(){
    //gl_PointSize=1000.0;
    	colorout = color_in;
    	gl_Position=vec4(point_in,0.0,1.0);
}
`;
var frag_shader=`#version 300 es
precision highp float;
in vec3 colorout;
out vec4 color;

void main(){

color=vec4(colorout,1.0);

}
`;
var prg=null;
var vao1=null;
function init_wgl(){
	prg=ShaderProgram(vertex_shader,frag_shader,'prg1');

let vbo1=VBO([-0.5,0,0.5,0],2);
let vbo2=VBO([0,0,1 , 1,0,0 ],3);
vao1=VAO([prg.in.point_in,vbo1] , [prg.in.color_in,vbo2]);
}
function draw_wgl(){
gl.clearColor(0.24,0.29,0.8,1);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

prg.bind();
vao1.bind();
//prg.uniform.color_in = [1,1,1];
gl.drawArrays(gl.LINES,0,2);



}
launch_2d();