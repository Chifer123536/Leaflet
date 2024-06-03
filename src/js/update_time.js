function update_time(data) {
	const timeElement = document.getElementById('time')
	timeElement.textContent = data.time_usec
	console.log(`Time: ${data.time_usec}`)
}

export default update_time 
