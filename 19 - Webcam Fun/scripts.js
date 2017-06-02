//grab DOM elements
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//project video
function getVideo() {
	//access webcam
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
		.then(localMediaStream => {
			console.log(localMediaStream); //a bunch of text (base 64)
			video.src = window.URL.createObjectURL(localMediaStream); //create URL for the video
			video.play(); //project video continuously
		}) 
		.catch(error => {
			console.error('Enable webcam to avoid error!', error);
		})
}

//project video to the canvas
function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;

	//feed video to canvas every 16ms
	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height); //set to canvas; start point (0, 0)
		/*grab pixels from canvas */
		let pixels = ctx.getImageData(0, 0, width, height);

		/*manipulate the pixels*/
		//pixels = redEffect(pixels);
		pixels = rgbSplit(pixels);
		//pixels = greenScreen(pixels);
		// ctx.globalAlpha = 0.8; //ghosting effect

		/*put manipulated pixels back into canvas*/
		ctx.putImageData(pixels, 0, 0);
	}, 16);
}

//screenshot video
function takePhoto() {
	//audio
	snap.currentTime = 0;
	snap.play(); 
	
	const data = canvas.toDataURL('images/jpeg'); //create URL for captured img 
	const link = document.createElement('a'); //create link elem
	link.href = data; //set src path
	link.setAttribute('download', 'purdy'); //attr shown when download
	//link.textContent = 'Download Image';
	link.innerHTML = `<img src="${data}", alt="Purdy" />`; //insert src tag
	strip.insertBefore(link, strip.firstChild); //insert img to strip - latest to oldest
}

//1. red filter - [r,g,b,a]
function redEffect(pixels) {
	for(let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i + 0] = pixels.data[i + 0] + 100; //add 100 to red
		pixels.data[i + 1] = pixels.data[i + 1] - 50; //subtract 50 from green
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //multiply 0.5 of blue
	} 
	return pixels;
}

//2. trippy filter
function rgbSplit(pixels) {
	for(let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i - 150] = pixels.data[i + 0]; //move current color to 150 pixel backward
		pixels.data[i + 100] = pixels.data[i + 1]; //move current color to 100 pixel forward
		pixels.data[i - 150] = pixels.data[i + 2]; //move current color to 150 pixel backward
		//essentially splitting the colors to different directions
	} 
	return pixels;
}

//3. green screen filter
function greenScreen(pixels) {
	const levels = {}; //contain min & max range of green

	//grab input elements and store min & max values
	document.querySelectorAll('.rgb input').forEach((input) => {
		levels[input.name] = input.value;
	});

	for (i = 0; i < pixels.data.length; i += 4) {
		red = pixels.data[i + 0];
		green = pixels.data[i + 1];
		blue = pixels.data[i + 2];
		alpha = pixels.data[i + 3];

		//if r,g,b is anywhere in between the range
		if (red >= levels.rmin 
			&& green >= levels.gmin 
			&& blue >= levels.bmin
			&& red <= levels.rmax 
			&& green <= levels.gmax 
			&& blue <= levels.bmax) {
			//take it out
			pixels.data[i + 3] = 0; //alpha set to 0 is full transparent
		}
	}
	return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);









