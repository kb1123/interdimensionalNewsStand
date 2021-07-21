function grabTiles(){
	var url = new URL(window.location.href)
	var params = new URLSearchParams(url.search)
	//console.log(params.get('query'))

    var xhp = new XMLHttpRequest();
    xhp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var products = JSON.parse(this.responseText)
            products.forEach(product => addProduct(product));
        }
    }
    xhp.open("POST", "", true);
    xhp.setRequestHeader("Content-type", "application/json")
    xhp.send(JSON.stringify({query: params.get('query')}));
    start() //start the dots animation while waiting on server
}

function addProduct(p){
	console.log(p)
    var productGrid = document.getElementById("productGrid")

    var container = document.createElement("DIV")
    container.className = "tilecontainer"

    var lnk = document.createElement("A")
    lnk.href = "https://kamstuff.ddns.net/webshop/product?productId=" + p._id

    var productImage = document.createElement("IMG")
    productImage.src = "https://kamstuff.ddns.net/public/images/" + p.splash // + ".jpg"
    productImage.className = "productimage"
    productImage.href = "https://www.kamstuff.ddns.net"
    lnk.appendChild(productImage)
    container.appendChild(lnk)

    var descriptionBox = document.createElement("DIV")
    descriptionBox.className = "descriptionbox"
    descriptionBox.innerHTML = p.name
    container.appendChild(descriptionBox)

    var priceBox = document.createElement("DIV")
    priceBox.className = "pricebox"
    priceBox.innerHTML = "$" + parseFloat(p.price).toFixed(2) 
    container.appendChild(priceBox)
    
    productGrid.appendChild(container)
}

//part of the code that powers the canvas animation//

var dots = []
var ctx = {}
var canvas = {}
var vWidth = 0
var vHeight = 0

function start(){
	vWidth = window.innerWidth
	vHeight = window.innerHeight
	var canvas = document.getElementById('dot-canvas')
	canvas.width = vWidth
    canvas.height = vHeight
	ctx = canvas.getContext('2d')
	for (var i = 0; i<100; i++){
		dots[i] = new Dot()
    }
    for(var j = 0; j<1000; j++){
        dots.forEach((dot) =>{
            dot.update();
        })
    }
	setInterval(loop, 40)
}

function loop(){
	var img = ctx.getImageData(0,0,vWidth,vHeight)
	
	for(var i=0; i<img.data.length; i++){
		img.data[i+4] = img.data[i+4]*0.9
	}

	ctx.clearRect(0,0,vWidth,vHeight)
	ctx.putImageData(img, 0, 0)
	dots.forEach((dot) => {
		dot.update()
		ctx.beginPath(); 
		ctx.arc(dot.x, dot.y, 2, 0, 2*Math.PI, false);
		ctx.fillStyle = 'white';
		ctx.fill();
		ctx.lineWidth = 0;
		ctx.strokeStyle = 'white';
		ctx.stroke();
	})
}

function Dot(){
	this.update = () =>{
		this.x += this.dx
		this.y += this.dy
		if(this.x > vWidth + 200 || this.x < - 200 || this.y > vHeight + 200 || this.y < - 200){
		this.generate()	
		}
	}

	this.generate = () => {
		if(plusMinus() == 1){
			this.x = vWidth/2 + plusMinus()*Math.random()*(vWidth/2+50)
			if(this.x > (vWidth+50) || this.x < -50){
				this.y = vHeight/2 + plusMinus()*Math.random()*(vHeight/2+50) 
			}else{
				this.y = vHeight/2 + plusMinus()*(Math.floor(Math.random()*40)+(vHeight/2+50))
			}
			this.dx = Math.random()*2 - 1
			this.dy = Math.random()*2 - 1
		}else{
			this.y = vHeight/2 + plusMinus()*Math.random()*(vHeight/2+50)
			if(this.y > (vHeight+50) || this.y < -50){
				this.x = vWidth/2 + plusMinus()*Math.random()*(vWidth/2+50) 
			}else{
				this.x = vWidth/2 + plusMinus()*(Math.floor(Math.random()*40)+(vWidth/2+50))
			}
			this.dx = Math.random()*2 - 1
			this.dy = Math.random()*2 - 1
		}
	}
	this.generate()
}

function canvasResize(){
    vHeight = window.innerHeight
	vWidth = window.innerWidth
	
	var c = document.getElementById("dot-canvas");
	c.setAttribute('width', vWidth)
	c.setAttribute('height', vHeight)
}

function plusMinus(){
	var temp = Math.random()*2-1
	if(temp > 0){
		return 1
	}
	return -1;
}


