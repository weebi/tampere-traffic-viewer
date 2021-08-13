window.onload = async () => {
	let data = await fetchData()
	let imgcontainer = document.getElementById('img-container')

	// trensi90-ipcam3 has a broken link so we'll ignore it for now.
	data.results.map(item => imgcontainer.appendChild(buildCards(item)))

	// Set interval to update images every five minutes
	setInterval(() => {
		updateImages();
	}, 300000)
}

const fetchData = async () => {
	let url = "https://traffic-cameras.tampere.fi/api/v1/cameras"
	let data = await fetch(url)

	if(data.ok) { 
		return await data.json() 
	} else {
		alert("Error in fetchData()" + data.status)
	}
}

const buildCards = (item) => {
	let card = document.createElement('div')
	let templateCard = document.getElementById("imgCardTemplate").content.cloneNode(true)
	let location = item.location.geometry.coordinates
	card.append(templateCard)

	// Fill out the blanks
	card.className = "img-card"
	card.childNodes[1].alt = item.cameraPresets[0].directionDescription
	card.childNodes[1].src = item.cameraPresets[0].imageUrl
	card.childNodes[3].childNodes[0].innerText = item.cameraName
	card.childNodes[3].childNodes[0].href = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`
	card.childNodes[3].childNodes[0].target = "_blank"

	return card
}

// Update only the image elements in the cards
const updateImages = async () => {
	let data = await fetchData()
	let cards = document.getElementsByClassName("img-card")

	data.results.map((item, index) => {
		cards.item(index).children[0].src = item.cameraPresets[0].imageUrl
	})
}