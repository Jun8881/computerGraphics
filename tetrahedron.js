var canvas;
var gl;

var numVertices  = 12;
//사면체 = 삼각형 4개 = 4*3 = 12

var program;

var pointsArray = []; //정점 저장하는 배열
var colorsArray = []; //색상 저장하는 배열
var texCoordsArray = [];

var texture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 0)
];


//사면체 꼭짓점 4개
var vertices = [
    vec4( -0.5, -0.5, -0.5, 1.0 ), //0
    vec4(  0.0, -0.5,  0.5, 1.0 ), //1
    vec4(  0.5, -0.5, -0.5, 1.0 ), //2
    vec4(  0.0,  0.5,  0.0, 1.0 )  //3
];

var vertexColors = [
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

//x, y, z 축
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
    
//x, y, z만큼 각도
var theta = [90.0, 90.0, 90.0];

var thetaLoc;

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


function triple(a, b, c){
    pointsArray.push(vertices[a]); 
    colorsArray.push(vertexColors[a]); 
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[b]); 
    colorsArray.push(vertexColors[b]);
    texCoordsArray.push(texCoord[1]); 

    pointsArray.push(vertices[c]); 
    colorsArray.push(vertexColors[c]);
    texCoordsArray.push(texCoord[2]); 
}


function colorCube()
{  
    //삼각형 4개
    triple(1, 0, 3);
    triple(0, 2, 3);
    triple(2, 1, 3);
    triple(1, 0, 2);
}



window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();

    //색상을 넣을 cbuffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    //vertex 정보 넣을 vbuffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    //텍스쳐 이미지 변수
    var image = document.getElementById("texImage");
 
    configureTexture( image );

    //theta 값 가져오기
    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    //x, y, z축 버튼
    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
       
    render();
 
}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, flatten(theta));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimFrame(render);
}
