window.onload = async () => {
	let data = await fetchData()
	renderCards(data)
}

const fetchData = async () => {
	let url = "https://traffic-cameras.tampere.fi/api/v1/cameras"

	let data = await fetch(url)
	if(data.ok) {
		let json = await data.json()
		return json.results
	} else {
		alert("Error in fetchData()" + data.status)
	}
}

const buildCards = (item) => {
	let card = document.createElement('div')
	card.append(document.getElementById("imgCardTemplate").content.cloneNode(true))

	// Set data
	card.className = "img-card"
	card.childNodes[1].alt = item.cameraPresets[0].directionDescription
	card.childNodes[1].src = item.cameraPresets[0].imageUrl
	card.childNodes[3].innerText = item.cameraName

	return card
}

const renderCards = (items) => {
	return items.map(item => document.getElementById('img-container').appendChild(buildCards(item)))
}