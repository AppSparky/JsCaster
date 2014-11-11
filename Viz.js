window.Viz = function (canvasCtx) {

    this.ctx = canvasCtx;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;

    this.crossCol = 0xAA6644;
    
    this.keyMap = [];
    this.crossPosX = this.ctx.canvas.width / 2;
    this.crossPosY = this.ctx.canvas.height / 2;

    this.posX = 2.5;
    this.posY = 5;
    this.dirX = 0.0;
    this.dirY = 1.0;
    this.rayX = 0.0;
    this.rayY = 0.0;
    this.cposX = 0.0;
    this.cposY = 0.0;
    this.planeY = 0;//Math.abs(((this.width/2))/Math.tan(30));
    this.planeX = 0.66;

    this.mapHeight = 24;
    this.mapWidth = 24;
    this.worldMap = 
    [
      [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7,7,7,7,7,7,7,7],
      [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,7],
      [4,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,7],
      [4,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7],
      [4,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,7],
      [4,0,4,0,0,0,0,5,5,5,5,5,5,5,5,5,7,7,0,7,7,7,7,7],
      [4,0,5,0,0,0,0,5,0,5,0,5,0,5,0,5,7,0,0,0,7,7,7,1],
      [4,0,6,0,0,0,0,5,0,0,0,0,0,0,0,5,7,0,0,0,0,0,0,8],
      [4,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,1],
      [4,0,8,0,0,0,0,5,0,0,0,0,0,0,0,5,7,0,0,0,0,0,0,8],
      [4,0,0,0,0,0,0,5,0,0,0,0,0,0,0,5,7,0,0,0,7,7,7,1],
      [4,0,0,0,0,0,0,5,5,5,5,0,5,5,5,5,7,7,7,7,7,7,7,1],
      [6,6,6,6,6,6,6,6,6,6,6,0,6,6,6,6,6,6,6,6,6,6,6,6],
      [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
      [6,6,6,6,6,6,0,6,6,6,6,0,6,6,6,6,6,6,6,6,6,6,6,6],
      [4,4,4,4,4,4,0,4,4,4,6,0,6,2,2,2,2,2,2,2,3,3,3,3],
      [4,0,0,0,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,0,0,0,2],
      [4,0,0,0,0,0,0,0,0,0,0,0,6,2,0,0,5,0,0,2,0,0,0,2],
      [4,0,0,0,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,2,0,2,2],
      [4,0,6,0,6,0,0,0,0,4,6,0,0,0,0,0,5,0,0,0,0,0,0,2],
      [4,0,0,5,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,2,0,2,2],
      [4,0,6,0,6,0,0,0,0,4,6,0,6,2,0,0,5,0,0,2,0,0,0,2],
      [4,0,0,0,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,0,0,0,2],
      [4,4,4,4,4,4,4,4,4,4,1,1,1,2,2,2,2,2,2,3,3,3,3,3]
    ];

    this.texWidth = 64;
    this.texHeight = 64;
    this.textures = new Array(8);
    this.pixels; 

    this.init = function() {

        for(var i = 0; i < 8; i++) {
            this.textures[i] = new Array(64*64);
        }

        //generate some textures
        for(var x = 0; x < this.texWidth; x++) {
          for(var y = 0; y < this.texHeight; y++)
          {
            var xorcolor = (x * 256 / this.texWidth) ^ (y * 256 / this.texHeight);
            //var xcolor = x * 256 / this.texWidth;
            var ycolor = y * 256 / this.texHeight;
            var xycolor = y * 128 / this.texHeight + x * 128 / this.texWidth;
            this.textures[0][this.texWidth * y + x] = 65536 * 254 * (x != y && x != this.texWidth - y); //flat red this.textures with black cross
            this.textures[1][this.texWidth * y + x] = xycolor + 256 * xycolor + 65536 * xycolor; //sloped greyscale
            this.textures[2][this.texWidth * y + x] = 256 * xycolor + 65536 * xycolor; //sloped yellow gradient
            this.textures[3][this.texWidth * y + x] = xorcolor + 256 * xorcolor + 65536 * xorcolor; //xor greyscale
            this.textures[4][this.texWidth * y + x] = 256 * xorcolor; //xor green
            this.textures[5][this.texWidth * y + x] = 65536 * 192 * (x % 16 && y % 16); //red bricks
            this.textures[6][this.texWidth * y + x] = 65536 * ycolor; //red gradient
            this.textures[7][this.texWidth * y + x] = 128 + 256 * 128 + 65536 * 128; //flat grey texture
          }
        }

        this.pixels = this.ctx.createImageData(this.width,this.height);
    }

    this.debugOutput = function() {
        console.log("fps:"+viz.fps);
        console.log("x:"+this.posX+", y:"+this.posY);
        console.log("xdir:"+this.dirX+", ydir:"+this.dirY);
    }



    this.draw = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.drawWalls();
        this.drawCross(this.crossCol);
        this.drawInfo();
    }

    this.drawInfo = function() {
        this.ctx.fillStyle    = '#00f';
        this.ctx.font         = '12px sans-serif';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText  ("fps:"+viz.fps, 0, 0);
        //this.ctx.fillText  ("x:"+this.posX+", y:"+this.posY, 0, 13);
        //this.ctx.fillText  ("xdir:"+this.dirX+", ydir:"+this.dirY, 0, 25);
    }

    this.drawWalls = function() {
        for(var x = 0; x < this.width; x++) {

            // Kameraebene. So gewählt dass immer zwischen -1 und 1 - 0 ist Bildschrimmitte.
            var camX = 2 * x / this.width - 1;
            
            var mapX = (this.posX) | 0;
            var mapY = (this.posY) | 0;
            var rayPosX = this.posX;
            var rayPosY = this.posY;

            // Richtungsvektor des aktuellen Strahls
            var rayX = this.dirX + this.planeX * camX;
            var rayY = this.dirY + this.planeY * camX;

            // Schnittpunkt-Distanzen am Grid in X und Y-Richtung (Herleitung über Winkel der Strahlrichtung - tan)
            // Math.pow(a,b) => a << b
            var deltaDistX = Math.sqrt(1+Math.pow(rayY,2)/Math.pow(rayX,2));
            var deltaDistY = Math.sqrt(1+Math.pow(rayX,2)/Math.pow(rayY,2));
            var distX, distY;
            var stepX, stepY;

            if(rayX > 0) {
                // Ähnliche Dreiecke: 1/H = x/h => h = x * H
                distX = (mapX + 1 - rayPosX) * deltaDistX;
                stepX = 1;
            }
            else {
                distX = (rayPosX - mapX) * deltaDistX;
                stepX = -1;
            }
            if(rayY > 0) {
                distY = (mapY + 1 - rayPosY) * deltaDistY;
                stepY = 1;
            }
            else {
                distY = (rayPosY - mapY) * deltaDistY;
                stepY = -1;
            }

            var hit = false;
            var side = 0;
            while(!hit) {
                // Abwechselnd den nächsten x- oder y-Schnittpunkt summieren
                if(distX < distY) {
                    distX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                }
                else {
                    distY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                } 

                // Aktueller Schnittpunkt eine Wand?
                if(this.worldMap[mapX][mapY] != 0) {
                    hit = true;
                }
            }

            var dist;
            if(side == 0) {
                // Fishbowl korrektur -> funktioniert nicht richtig
                //dist = distX * Math.cos(Math.atan(rayY/rayX));

                // x-Distanz zur Wand / x-Komponente der Richtung => 
                // (1 - stepX) / 2 => 1 wenn rayX<0, 0 wenn rayX > 0
                dist = Math.abs((mapX - rayPosX + (1 - stepX) / 2) / rayX);
            }
            else {
                //dist = distY * Math.cos(Math.atan(rayY/rayX));
                dist = Math.abs((mapY - rayPosY + (1 - stepY) / 2) / rayY);
            }

            var hWall = 1/dist * (this.height+300);

            this.texCaster(x, side, rayX, rayY, rayPosX, rayPosY, stepX, stepY, hWall, mapX, mapY);

        }

        // Draw screen buffer
        this.ctx.putImageData(this.pixels, 0, 0);
    }



    this.texCaster = function(x, side, rayX, rayY, rayPosX, rayPosY, stepX, stepY, hWall, mapX, mapY) {
        var texNum = this.worldMap[mapX][mapY] - 1;

        var wallX;
        if(side == 1)
            wallX = rayPosX + ((mapY - rayPosY + (1 - stepY) / 2) / rayY) * rayX;
        else
            wallX = rayPosY + ((mapX - rayPosX + (1 - stepX) / 2) / rayX) * rayY;

        wallX -= wallX | 0;

        //x coordinate on the texture
        var texX = (wallX * this.texWidth) | 0;
        if(side == 0 && rayX > 0) texX = this.texWidth - texX - 1;
        if(side == 1 && rayY < 0) texX = this.texWidth - texX - 1;


        //var vCenter = this.height/2;
        //var drawStart =  parseInt(vCenter - hWall * 2);
        //var drawEnd = parseInt(vCenter + hWall * 2);


        var factor = 2;
        var drawStart = (-hWall / factor + this.height / factor) | 0;
        if(drawStart < 0) 
            drawStart = 0;
        var drawEnd = (hWall / factor + this.height / factor) | 0;
        if(drawEnd >= this.height)
            drawEnd = this.height - 1;

        var r,g,b;

        for(var y = 0; y<this.height; y++) {
            if(y >= drawStart && y < drawEnd) {
                var d = (y - this.height / 2 + hWall / 2) | 0;  
                var texY = ((d * this.texHeight) / hWall) | 0;
                var col = this.textures[texNum][(this.texHeight * texY + texX) | 0];
                //make color darker for y-sides: R, G and B byte each divided through two with a "shift" and an "and"
                if(side == 1) col = (col >> 1) & 8355711; 

                r = col >> 16 & 0xFF;
                g = col >> 8 & 0xFF;
                b = col & 0xFF;

                var texelPos0 = (x + y * this.width) * 4;
                this.pixels.data[texelPos0 + 0] = r; // red channel
                this.pixels.data[texelPos0 + 1] = g; // green channel
                this.pixels.data[texelPos0 + 2] = b; // blue channel
                this.pixels.data[texelPos0 + 3] = 255; // alpha channel                
            }
            else {
                var texelPos0 = (x + y * this.width) * 4;

                if(y < drawStart) {
                    r = 100;
                    g = 100;
                    b = 255;
                }
                else {
                    r = 100;
                    g = 100;
                    b = 100;
                }

                var texelPos0 = (x + y * this.width) * 4;
                this.pixels.data[texelPos0 + 0] = r; // red channel
                this.pixels.data[texelPos0 + 1] = g; // red channel
                this.pixels.data[texelPos0 + 2] = b; // red channel
                this.pixels.data[texelPos0 + 3] = 255; // alpha channel           
            }
        }
    }

    this.drawVLine = function(x, start, end, color) {
        this.ctx.save();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = color; // conv to rgb string

        this.ctx.beginPath();
        this.ctx.moveTo(x, start);
        this.ctx.lineTo(x, end);
        this.ctx.stroke();

        this.ctx.restore();
    }


    this.drawCross = function (color) {
        this.ctx.save();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "#" + color.toString(16); // conv to rgb string

        this.ctx.beginPath();
        this.ctx.moveTo(this.crossPosX, 0);
        this.ctx.lineTo(this.crossPosX, this.height);
        this.ctx.moveTo(0, this.crossPosY);
        this.ctx.lineTo(this.width, this.crossPosY);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    }

    
    this.update = function () {
        var crossSpeed = 3;
        var moveSpeed = viz.ticks * 8.0;
        var rotSpeed = viz.ticks * 3.0;

        for (var i = 0; i < this.keyMap.length; i++) {
            // A
            if (this.keyMap[i] === 65) {
                this.crossPosX -= crossSpeed;
            }
            // D
            if (this.keyMap[i] === 68) {
                this.crossPosX += crossSpeed;
            }
            // W
            if (this.keyMap[i] === 87) {
                this.crossPosY -= crossSpeed;
            }
            // S
            if (this.keyMap[i] === 83) {
                this.crossPosY += crossSpeed;
            }
            // left
            if (this.keyMap[i] === 37) {
                // rotate left direction
                var oldDirX = this.dirX;
                this.dirX = this.dirX * Math.cos(rotSpeed) - this.dirY * Math.sin(rotSpeed);
                this.dirY = oldDirX * Math.sin(rotSpeed) + this.dirY * Math.cos(rotSpeed);    
                var oldPlaneX = this.planeX;
                this.planeX = this.planeX * Math.cos(rotSpeed) - this.planeY * Math.sin(rotSpeed);
                this.planeY = oldPlaneX * Math.sin(rotSpeed) + this.planeY * Math.cos(rotSpeed);
            }
            // right
            if (this.keyMap[i] === 39) {
                // rotate right direction
                var oldDirX = this.dirX;
                this.dirX = this.dirX * Math.cos(-rotSpeed) - this.dirY * Math.sin(-rotSpeed);
                this.dirY = oldDirX * Math.sin(-rotSpeed) + this.dirY * Math.cos(-rotSpeed);
                var oldPlaneX = this.planeX;
                this.planeX = this.planeX * Math.cos(-rotSpeed) - this.planeY * Math.sin(-rotSpeed);
                this.planeY = oldPlaneX * Math.sin(-rotSpeed) + this.planeY * Math.cos(-rotSpeed);
            }
            // up
            if (this.keyMap[i] === 38) {
                // move forward in direction 
                if(this.worldMap[(this.posX + this.dirX * moveSpeed) | 0][(this.posY) | 0] == 0)
                    this.posX = (this.posX + this.dirX * moveSpeed);
                if(this.worldMap[(this.posX) | 0][(this.posY + this.dirY * moveSpeed) | 0] == 0)
                    this.posY = (this.posY + this.dirY * moveSpeed);
            }
            // down
            if (this.keyMap[i] === 40) {
                // move backward in direction
                if(this.worldMap[(this.posX - this.dirX * moveSpeed) | 0][(this.posY) | 0] == 0)
                    this.posX -= this.dirX * moveSpeed;
                if(this.worldMap[(this.posX) | 0][(this.posY - this.dirY * moveSpeed) | 0] == 0)
                    this.posY -= this.dirY * moveSpeed;
            }
            // space
            if (this.keyMap[i] === 32) {
            }
        }
    }


    // Input ...
    this.input = function (evt) {
        console.log(evt.keyCode);

        var mapIndex = $.inArray(evt.keyCode, this.keyMap);

        if (evt.type === "keydown") {
            if(mapIndex === -1)
                this.keyMap.push(evt.keyCode);
        }

        if (evt.type === "keyup") {
            if (mapIndex != -1)
                this.keyMap.splice(mapIndex, 1);
        }
    }


};

