var canvas = document.getElementById("drawing");
var ctx = canvas.getContext("2d")

var brush = function(x, y) { 

    /**
     * Функция представляет собой аналог кисточки,
     * которая закрашивает пиксель своим цветом.
     */

    if(isFinite(x) && isFinite(y)){
        setPixelPoint(x, y, brush.color);
    }
};

function setPixelPoint(x, y, color) { 

    /**
     * Функция ставит на холст пиксель в точке (x;y),
     * который имеет цвет color.
     */

    if(!color) color = {r : 0, 
                        g : 0, 
                        b : 0, 
                        a : 255};

    var p = ctx.createImageData(1,1);

    p.data[0] = color.r;
    p.data[1] = color.g;
    p.data[2] = color.b;
    p.data[3] = color.a;

    var data = ctx.getImageData(x, y, 1,1).data;

    if(data[3] <= p.data[3])
        ctx.putImageData(p, x, y);
  }

function createLine(x1, y1, x2, y2, color) {

    /**
     * Функция строит прямую линию по алгоритму
     * Брезенхема из точки (x1;y1) в точку (x2;y2)
     * и имеет цвет color.
     */

    if(color){
        brush.color = color;
    } else {
        brush.color = {r:0,
                       g:0,
                       b:0,
                       a:255};
    }

    var deltaX = Math.abs(x2 - x1);
    var deltaY = Math.abs(y2 - y1);
    var signX = x1 < x2 ? 1 : -1;
    var signY = y1 < y2 ? 1 : -1;
   
    var d = deltaX - deltaY;
    
    brush(x2, y2);

    while(x1 != x2 || y1 != y2){
        brush(x1, y1);
        var d2 = d * 2;
      
        if(d2 > -deltaY){
            d -= deltaY;
            x1 += signX;
        }

        if(d2 < deltaX){
            d += deltaX;
            y1 += signY;
        }
    }
}

function circle(center_x, center_y, radius, color) {

    /**
     * Функция строит окружность используя алгоритм
     * Мичнера. Ее центр устанавливается в точке
     * (center_x; center_y). Окружность имеет цвет
     * обводки color, а ее радиус задается с 
     * помощью radius.
     */

    function setPixel8() {
        setPixelPoint(x + center_x, y + center_y, color);
        setPixelPoint(x + center_x, -y + center_y, color);
        setPixelPoint(-x + center_x, -y + center_y, color);
        setPixelPoint(-x + center_x, y + center_y, color);
        setPixelPoint(y + center_x, x + center_y, color);
        setPixelPoint(y + center_x, -x + center_y, color);
        setPixelPoint(-y + center_x, -x + center_y, color);
        setPixelPoint(-y + center_x, x + center_y, color);    
    }
    x = 0;
    y = radius;
    d = 3 - 2 * y;
    while(x <= y) {
       setPixel8();
       if (d < 0) { d = d + 4 * x + 6;}
       else {
       d = d + 4 * (x - y) + 10;
       y--;
       }
    x++;
    }
}


function star(center_x, center_y, borderColor){

    /**
     * Функция star отрисовывает на холсте звезду
     * используя прямые линии, построенные по
     * алгоритму Брезенхема.
     */

    let start_x = center_x - 23;
    let start_y = center_y;

    createLine(start_x, start_y, start_x+20, start_y-3, borderColor)
    createLine(start_x+20, start_y-3, start_x+23, start_y-23, borderColor)
    createLine(start_x+23, start_y-23, start_x+26, start_y-3, borderColor)
    createLine(start_x+26, start_y-3, start_x+56, start_y, borderColor)

    createLine(start_x+56, start_y, start_x+26, start_y+3, borderColor)
    createLine(start_x+26, start_y+3, start_x+23, start_y+23, borderColor)
    createLine(start_x+23, start_y+23, start_x+20, start_y+3, borderColor)
    createLine(start_x+20, start_y+3, start_x, start_y, borderColor)
}



function fill(x, y, fillColor, borderColor) {

    /**
     * Функция рекурсивной заливки фигур указанным 
     * цветом borderColor
     */

    let data = ctx.getImageData(x, y, 1, 1).data;  
    let color = {r: data[0], g:data[1], b: data[2] };

    if ( !eqColor(color, borderColor) && !eqColor(color, fillColor) ) { 
      setPixelPoint(x, y, fillColor); 
      fill(x+1,y, fillColor, borderColor);  
      fill(x,y+1, fillColor, borderColor); 
      fill(x-1,y, fillColor, borderColor); 
      fill(x,y-1, fillColor, borderColor);
    }
  }
  
function eqColor (color1, color2) {

    /**
     * Функция сравнивает два цвета с точностью до eps,
     * представляющую из себя предел погрешности 
     * несовпадения двух цветов.
     */
    let  eps=2;
    if ( Math.abs(color1.r-color2.r) < eps && Math.abs(color1.g-color2.g) < eps && Math.abs(color1.b-color2.b) < eps) 
      return 1; 
    else 
      return 0;
}

function square(x, y, width, height, borderColor){
    createLine(x, y, x+width, y, borderColor);
    createLine(x+width, y, x+width, y+height, borderColor);
    createLine(x+width, y+height, x, y+height, borderColor);
    createLine(x, y, x, y+height, borderColor);
}

function drawBackground(){
    circle(575, 80, 50, colors.moon);
    fill(575, 80, colors.moon, colors.moon);

    circle(585, 70, 20, colors.moon_crater);
    fill(585, 70, colors.moon_crater, colors.moon_crater);

    circle(595, 80, 15, colors.moon_crater);
    fill(600, 85, colors.moon_crater, colors.moon_crater);

    circle(595, 95, 10, colors.moon_crater);
    fill(600, 96, colors.moon_crater, colors.moon_crater);

    circle(565, 110, 10, colors.moon_crater);
    fill(565, 110, colors.moon_crater, colors.moon_crater);
}

var colors = {
    blue_dark: {r: 187, g: 222, b: 214, a: 250},
    black: {r: 10, g: 1, b: 1, a: 255},
    white: {r: 255, g: 255, b: 255, a: 255},
    purple1: {r: 67, g: 31, b: 101, a: 240},            // Самый темный
    purple2: {r: 86, g: 42, b: 129, a: 240},            // Средний
    purple3: {r: 101, g: 50, b: 150, a: 240},            // Самый светлый
    granit_gray: {r: 48, g: 56, b: 65, a: 255},
    blue_light: {r: 27, g: 184, b: 227, a: 255},
    orange: {r: 251, g: 162, b: 33, a: 255},
    off_light: {r: 51, g: 51, b: 51, a: 255},
    moon: {r: 189, g: 208, b: 228, a: 255},
    moon_crater: {r: 120, g: 128, b: 127, a: 255}
}

drawBackground();

// Дом 1-------------------------------------
for(let y = 150; y < 350; y+=50){
    square(0, y, 100, 50, colors.black);
    fill(10, y+10, colors.black, colors.black);
}

for(let y = 200; y < 350; y+=50){
    square(100, y, 30, 50, colors.black);
    fill(110, y+10, colors.black, colors.black)
}

square(0, 350, 100, 49, colors.black);
fill(10, 360, colors.black, colors.black);

square(100, 350, 30, 49, colors.black);
fill(110, 360, colors.black, colors.black);

// окна

for (let y = 230; y <= 350; y+=30){
    square(100, y, 10, 20, colors.orange);
    fill(105, y+5, colors.orange, colors.orange);
}

square(80, 350, 10, 20, colors.off_light);
fill(85, 355, colors.off_light, colors.off_light);

square(60, 290, 10, 20, colors.off_light);
fill(65, 295, colors.off_light, colors.off_light);

square(80, 290, 10, 20, colors.off_light);
fill(85, 295, colors.off_light, colors.off_light);

square(80, 260, 10, 20, colors.off_light);
fill(85, 265, colors.off_light, colors.off_light);
//----------------------------------------------

// Дом 2
for(let y = 150; y < 350; y+=50){
    square(250, y, 100, 50, colors.black);
    fill(260, y+10, colors.black, colors.black)
}

square(260, 100, 80, 50, colors.black);
fill(270, 110, colors.black, colors.black);

square(280, 30, 40, 70, colors.black);
fill(290, 40, colors.black, colors.black);

square(250, 350, 100, 49, colors.black);
fill(260, 360, colors.black, colors.black);

for(let y = 170; y <= 350; y+=30){
    square(260, y, 10, 20, colors.orange);
    fill(265, y+5, colors.orange, colors.orange);
}

for(let y = 230; y <= 350; y+=30){
    square(280, y, 10, 20, colors.off_light);
    fill(285, y+5, colors.off_light, colors.off_light);
}

for(let y = 290; y <= 350; y+=30){
    square(320, y, 10, 20, colors.off_light);
    fill(325, y+5, colors.off_light, colors.off_light);
}

for(let y = 200; y < 290; y+=30){
    square(320, y, 10, 20, colors.orange);
    fill(325, y+5, colors.orange, colors.orange);
}

square(270, 110, 10, 20, colors.orange);
fill(275, 115, colors.orange, colors.orange);

square(290, 110, 10, 20, colors.off_light);
fill(295, 115, colors.off_light, colors.off_light);

square(310, 110, 10, 20, colors.off_light);
fill(315, 115, colors.off_light, colors.off_light);

//---------------------------------------------------

// Дом 3

for(let y = 200; y < 350; y+=50){
    square(450, y, 100, 50, colors.black);
    fill(460, y+10, colors.black, colors.black)
}

square(450, 350, 100, 49, colors.black);
fill(460, 360, colors.black, colors.black);

square(470, 170, 100, 30, colors.black);
fill(480, 180, colors.black, colors.black);

for(let y = 200; y < 350; y+=50){
    square(550, y, 100, 50, colors.black);
    fill(560, y+10, colors.black, colors.black)
}

square(550, 350, 100, 49, colors.black);
fill(560, 360, colors.black, colors.black);

square(570, 170, 60, 30, colors.black);
fill(580, 180, colors.black, colors.black);

square(490, 160, 120, 10, colors.black);
fill(500, 165, colors.black, colors.black);

square(520, 120, 60, 40, colors.black);
fill(530, 130, colors.black, colors.black);

square(540, 70, 20, 50, colors.black);
fill(550, 75, colors.black, colors.black);

for (let y = 220; y <= 350; y+=30){
    square(470, y, 10, 20, colors.blue_light);
    fill(475, y+5, colors.blue_light, colors.blue_light);

    square(490, y, 10, 20, colors.blue_light);
    fill(495, y+5, colors.blue_light, colors.blue_light);

    square(510, y, 10, 20, colors.off_light);
    fill(515, y+5, colors.off_light, colors.off_light);

    square(580, y, 10, 20, colors.off_light);
    fill(585, y+5, colors.off_light, colors.off_light);

    square(600, y, 10, 20, colors.blue_light);
    fill(605, y+5, colors.blue_light, colors.blue_light);

    square(620, y, 10, 20, colors.blue_light);
    fill(625, y+5, colors.blue_light, colors.blue_light);
}

for (let x = 480; x < 620; x+=25){
    square(x, 180, 10, 10, colors.off_light);
    fill(x+5, 185, colors.off_light, colors.off_light);
}

//----------------------------------------------------