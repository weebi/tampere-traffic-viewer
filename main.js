window.onload = async () => {
	let data = await fetchData()
	let imgcontainer = document.getElementById('img-container')

	// Lazy code by Turtleb01: outdated-ness is not checked when updating
	let responseTs = Date.parse(data.meta.responseTs)

	data.results.map(item => imgcontainer.appendChild(buildCard(item, responseTs)))

	// Set interval to update images every two minutes
	setInterval(() => updateImages(), 121000)
}

const fetchData = async () => {
	let url = "https://traffic-cameras.tampere.fi/api/v1/cameras"
	let data = await fetch(url)

	if(data.ok) {
		return await data.json() 
	} else {
		alert("Error fetching data" + data.status)
	}
}

const buildCard = (item, ts) => {
	// Initialize card
	let card = document.createElement('div')
	let templateCard = document.getElementById("imgCardTemplate").content.cloneNode(true)
	card.append(templateCard)

	// Card elements
	let cardImg = card.getElementsByTagName("img")[0]
	let cardText = card.getElementsByTagName("a")[0]

	let location = item.location.geometry.coordinates
	let cameraPresets = item.cameraPresets[0]
	let cameraTs = Date.parse(cameraPresets.latestPictureTimestamp)
	let tsDifference = (ts - cameraTs)
	let outdated

	// Fill out the blanks
	card.id = item.cameraId
        card.className = "img-card"

	cardImg.alt = item.cameraPresets[0].directionDescription
	cardImg.src = item.cameraPresets[0].imageUrl

	cardText.innerText = item.cameraName
	cardText.href = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`
	cardText.target = "_blank"

	// Check if the images are outdated
	// if tsDifference > 10 minutes, mark as yellow
	// if tsDifference > week, mark as red
	if(tsDifference > 600000) {
		outdated = true
		card.className += (tsDifference > 604800000) ? " img-card-red" : " img-card-yellow"

		if(outdated) {
			card.className += " outdated" // currently completely hidden, but append required data anyway for later use
	                let imgTime = new Date(cameraPresets.latestPictureTimestamp).toLocaleDateString()
	                cardText.innerText += ` ${imgTime}`
		}
	} else {
		card.className += " img-card-green"
	}

	// Hide image if it errors
	cardImg.addEventListener("error", (event) =>  {
		event.target.parentNode.style.display = "none"
	})

	return card
}

// Update only the image elements in the cards
const updateImages = async () => {
	let data = await fetchData()

	data.results.map((item) => {
		let element = document.getElementById(item.cameraId)
		element.children[0].src = item.cameraPresets[0].imageUrl
	})
}
