"use strict"

var tex_vert=`#version 300 es
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
in vec3 position_in;
in vec2 texcoord_in;
out vec2 tc;

void main()
{
	gl_Position = projectionMatrix * viewMatrix * vec4(position_in,1);;
	tc = texcoord_in;
}`;

var tex_color_frag=`#version 300 es
precision highp float;
uniform sampler2D TU_mask;
uniform sampler2D TU_chaton;
uniform sampler2D TU_espace;
in vec2 tc;
out vec4 frag_out;

void main()
{
	vec3 col1 = texture(TU_chaton,tc).rgb;
	vec3 col2 = texture(TU_espace,tc).rgb;
	float k = texture(TU_mask,tc).r;

	vec3 melangee = mix(col2,col1, k);
	frag_out = vec4(melangee,1.0);
}`;


var mesh_rend = null;
var prg_tex = null;
var vao1 = null;
var tex1 = null;
var tex2 = null;
var tex3 = null;
var sl=null;


function param_texture(t,p,v)
{
	t.bind();
	gl.texParameteri(gl.TEXTURE_2D, gl["TEXTURE_"+p], gl[v]);
	update_wgl();
}


function init_wgl()
{

	prg_tex = ShaderProgram(tex_vert,tex_color_frag,'texture');

	let vbo_p = VBO([-1,-1,0, 1,-1,0, 1,1,0, -1,1,0], 3);
	let vbo_t = VBO([0,1, 1,1, 1,0, 0,0], 2);
	vao1 = VAO([prg_tex.in.position_in, vbo_p], [prg_tex.in.texcoord_in,vbo_t] );

	scene_camera.set_scene_radius(3);
	scene_camera.set_scene_center(Vec3(0,0,0));

	tex1 = Texture2d([gl.TEXTURE_MAG_FILTER,gl.NEAREST]);
	tex2 = Texture2d();
	tex3 = Texture2d([gl.TEXTURE_WRAP_S,gl.REPEAT],[gl.TEXTURE_WRAP_T,gl.REPEAT]);

	const data = new Uint8Array([
		255,  0,255,  0,
		  0,255,  0,255,
		255,  0,255,  0,
		  0,255,  0,255]);
	tex1.alloc(4,4,gl.R8,gl.RED,data);
	
	Promise.all([tex2.load("chaton.png",gl.RGB8,gl.RGB),
	             tex3.load("space.jpg",gl.RGB8,gl.RGB)]).then(update_wgl);

	//let m = Mesh.Tore(32);
	//mesh_rend = m.renderer(true,false,true);
}



function draw_wgl()
{
	gl.clearColor(0,0,0,1);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const projection_matrix = scene_camera.get_projection_matrix();
	const view_matrix = scene_camera.get_view_matrix();

	vao1.bind();

	prg_tex.bind();
	prg_tex.uniform.projectionMatrix = projection_matrix;
	prg_tex.uniform.viewMatrix = view_matrix;
	prg_tex.uniform.TU_mask   = tex1.bind(0);
	prg_tex.uniform.TU_chaton = tex2.bind(1);
	prg_tex.uniform.TU_espace = tex3.bind(2);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	// prg_tex.uniform.viewMatrix = mmult(view_matrix,translate(-1,1,1),scale(0.6));
	// mesh_rend.draw(gl.TRIANGLES);

	unbind_shader();
	unbind_vao();
}

launch_3d();
