let video = document.createElement('video');
document.body.append(video);

let c = document.createElement('canvas');
let ctx = c.getContext("2d");
document.body.append(c);

let c2 = document.createElement('canvas');
let ctx2 = c.getContext("2d");

let ctxData;
let ctxDataS;

let aktualizowanie = true;
let guzik = document.createElement("button");
guzik.innerHTML = "Zatrzymaj";
guzik.onclick = () =>
{
	aktualizowanie = !aktualizowanie;
};
document.body.append(guzik);

(async () =>
{
	let stream = await navigator.mediaDevices.getUserMedia({video: {width: { ideal: 1280 }, height: { ideal: 720 }}});

	video.srcObject = stream;
	video.play();

	video.addEventListener('play', () =>
	{

		let i = window.setInterval(function()
		{
			c2.width  = video.videoWidth;
			c2.height = video.videoHeight;
			c.width  = video.videoWidth;
			c.height = video.videoHeight;

			ctx2.drawImage(video, 0, 0);

			if (aktualizowanie)
				ctxDataS = ctxData;
			
			ctxData = ctx2.getImageData(0, 0, c2.width, c2.height);

			if (ctxDataS == undefined)
				return;

			let obrazek = new ImageData(ctxData.width, ctxData.height);

			for(let x = 0; x < c.width;  x++)
			for(let y = 0; y < c.height; y++)
			{
				let i = (y * c.width + x) * 4;

				obrazek.data[i    ] = Math.abs(ctxDataS.data[i    ] - ctxData.data[i    ]);
				obrazek.data[i + 1] = Math.abs(ctxDataS.data[i + 1] - ctxData.data[i + 1]);
				obrazek.data[i + 2] = Math.abs(ctxDataS.data[i + 2] - ctxData.data[i + 2]);
				obrazek.data[i + 3] = 255;
			}
			ctx.putImageData(obrazek, 0, 0);

		} ,20);

	}, false);

})();