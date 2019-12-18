export function makeHello(name: string) {
	return `Hello from ${name}!`;
}

// Returns true if magnitude of vector is less than diff
export function compare(v: Vector3, diff: number): boolean {
	return v.Magnitude < diff
}

export function decelerate(v: Vector3, factor: number): Vector3 {
	return new Vector3(factor * v.X, factor * v.Y, factor * v.Z)
}