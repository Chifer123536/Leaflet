class Panel {
	constructor() {
		this.updateFunctions = []
	}

	addUpdateFunction(updateFunction) {
		this.updateFunctions.push(updateFunction)
	}

	update() {
		this.updateFunctions.forEach(func => func())
	}
}

export default Panel
