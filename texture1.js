"use strict"

var tex_vert=`#version 300 es
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
in vec3 position_in;
in vec2 texcoord_in;
uniform float a;
out vec2 tc;

void main()
{
	gl_Position = projectionMatrix * viewMatrix * vec4(position_in,1);;
	tc = a*texcoord_in - (a-1.0)/2.0;
}`;

var tex_color_frag=`#version 300 es
precision highp float;
uniform sampler2D TU0;
in vec2 tc;
out vec4 frag_out;

void main()
{
	vec3 col = texture(TU0,tc).rgb;
	frag_out = vec4(col,1.0);
}`;


var mesh_rend = null;
var prg_tex_c = null;
var vao1 = null;
var tex1 = null;
var tex2 = null;
var tex3 = null;
var sl=null;


function param_textures(t,p,v)
{
	t.bind();
	gl.texParameteri(gl.TEXTURE_2D, gl["TEXTURE_"+p], gl[v]);
	update_wgl();
}


function init_wgl()
{
	UserInterface.begin(); // name of html id
	sl  = UserInterface.add_slider('A ',0,100,50,update_wgl);
	UserInterface.adjust_width();

	prg_tex_c = ShaderProgram(tex_vert,tex_color_frag,'texture');

	let vbo_p = VBO([-1,-1,0, 1,-1,0, 1,1,0, -1,1,0], 3);
	let vbo_t = VBO([0,1, 1,1, 1,0, 0,0], 2);
	vao1 = VAO([prg_tex_c.in.position_in, vbo_p], [prg_tex_c.in.texcoord_in,vbo_t] );

	scene_camera.set_scene_radius(3);
	scene_camera.set_scene_center(Vec3(0,0,0));

	tex1 = Texture2d();
	tex2 = Texture2d();
	tex3 = Texture2d();

	const data = new Uint8Array([
		255,255,255,   0,  0,  0, 255,128,128,   64,  0, 64,
		64,   0,  0,  128,255,128,   0,  0,  0, 128,128,255,
		255,255,255,   0,  0,  0, 128,128,128,   0,  64,  0,
		64  ,64  ,0  , 128,255,255,  0, 64, 64, 255,128,255]);
	tex1.alloc(4,4,gl.RGB8,gl.RGB,data);
	
	Promise.all([tex2.load("chaton.png",gl.RGB8,gl.RGB),
	             tex3.load("space.png",gl.R8,gl.RED)]).then(param_textures);

}



function draw_wgl()
{
	gl.clearColor(0,0,0,1);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const projection_matrix = scene_camera.get_projection_matrix();
	const view_matrix = scene_camera.get_view_matrix();

	vao1.bind();

	// couleur
	prg_tex_c.bind();
	prg_tex_c.uniform.projectionMatrix = projection_matrix;
	prg_tex_c.uniform.viewMatrix = view_matrix;
	prg_tex_c.uniform.a = 1+0.01*sl.value ;
	prg_tex_c.uniform.TU0 = tex1.bind();
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	unbind_shader();
	unbind_vao();
}

launch_3d();
