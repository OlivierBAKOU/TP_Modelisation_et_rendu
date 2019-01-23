
"use strict"

var vertex_shader_1=`#version 300 es
uniform mat4 orthoMatrix;
in vec2 position_in;
in vec3 color_in;
out vec3 Col;
void main()
{
	gl_PointSize = 8.0;
	gl_Position = orthoMatrix*vec4(position_in,0, 1.0);
	Col = color_in;
}
`;

var frag_shader_1=`#version 300 es
precision highp float;
// uniform vec3 color;
in vec3 Col;
out vec4 frag_out;

void main()
{
	frag_out = vec4(Col, 1);
}
`;

var prg1 = null;
var vao1 = null;
var ebo1 = null;
var b=0;
var animation = null;
var mode;
var sl_r;
var sl_g;
var sl_b;

function init_wgl()
{
/*	UserInterface.begin(); // name of html id
	UserInterface.use_field_set('H',"Color");
	sl_r  = UserInterface.add_slider('R ',0,100,50,update_wgl);
	set_widget_color(sl_r,'#ff0000','#ffcccc');
	sl_g  = UserInterface.add_slider('G ',0,100,50,update_wgl);
	set_widget_color(sl_g,'#00bb00','#ccffcc');
	sl_b  = UserInterface.add_slider('B ',0,100,50,update_wgl);
	set_widget_color(sl_b,'#0000ff','#ccccff');
	UserInterface.end_use();
	// UserInterface.add_br();
	mode = UserInterface.add_radio('H','Mode',['points','lines ','both  '],0, update_wgl);
	// UserInterface.add_br();
	UserInterface.add_check_box('Animate ',false,update_wgl);
	UserInterface.adjust_width();*/
	
	/// programs shader
	prg1 = ShaderProgram(vertex_shader_1,frag_shader_1,'shader_prg_1');

	/// data
	let vbo1 = VBO([-0.5,-0.5, 0.5,-0.5, 0.5,0.5, -0.5,0.5],2);
	let vbo2 = VBO([1,0,0,     0,1,0,    0,0,1,    1,1,1  ],3)
	vao1 = VAO([prg1.in.position_in, vbo1], [prg1.in.color_in,vbo2] );

	ebo1 = EBO([ 0,1, 1,2, 2,3, 3,0, 0,2, 1,3]);
	ewgl_continuous_update = true;
}

function draw_wgl()
{
	gl.clearColor(0,0,0,1);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	prg1.bind();
	
	vao1.bind();
	ebo1.bind();

	prg1.uniform.orthoMatrix = mmult(ortho2D,translate(-0.5,-0.5,0),rotateZ(ewgl_current_time*25),scale(0.2),translate(0.5,0.5,0));
	gl.drawElements(gl.TRIANGLES,12,gl.UNSIGNED_INT,0);

	prg1.uniform.orthoMatrix = mmult(ortho2D,translate(0.5,0.5,0),rotateZ(ewgl_current_time*25),scale(0.2),translate(-0.5,-0.5,0));
	gl.drawElements(gl.POINTS,12,gl.UNSIGNED_INT,0);


	unbind_vao();	// pour debug
	unbind_shader();
}

launch_2d();
