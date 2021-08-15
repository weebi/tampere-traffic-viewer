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
		alert("Error in fetchData()" + data.status)
	}
}

const buildCard = (item, ts) => {
	let card = document.createElement('div')
	let templateCard = document.getElementById("imgCardTemplate").content.cloneNode(true)
	let location = item.location.geometry.coordinates
	card.append(templateCard)

	let camerats = Date.parse(item.cameraPresets[0].latestPictureTimestamp)
	let tsdifference = ts - camerats
	let outdated

	card.className = "img-card"

	if(tsdifference > 604800000) { // one week, camera is dead
		card.className += " img-card-red"
		outdated = true
	} else if(tsdifference > 600000) { // 10 minutes
		card.className += " img-card-yellow"
		outdated = true
	} else {
		card.className += " img-card-green"
		outdated = false
	}

	// Fill out the blanks
	card.childNodes[1].alt = item.cameraPresets[0].directionDescription
	card.childNodes[1].src = item.cameraPresets[0].imageUrl
	card.childNodes[3].childNodes[0].innerText = item.cameraName
	
	if(outdated) {
		card.childNodes[3].childNodes[0].innerText += " " + new Date(item.cameraPresets[0].latestPictureTimestamp).toLocaleDateString()
	}

	card.childNodes[3].childNodes[0].href = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`
	card.childNodes[3].childNodes[0].target = "_blank"

	// Replace image if it errors
	card.childNodes[1].addEventListener("error", (event) =>  {
		event.target.src = "https://via.placeholder.com/640x360?text=404"
		event.target.parentNode.className = "img-card img-card-red" // not the best solution
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