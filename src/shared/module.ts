import { PLAYER_THROW_BALL_VELOCITY_FACTOR, PROJECTILE_MAX_SPEED, PLAYER_MAX_POWER_LEVEL, PROJECTILE_MIN_SPEED } from "./constants";

// Returns true if magnitude of vector is less than diff
export function compare(v: Vector3, diff: number): boolean {
	return v.Magnitude < diff
}

export function decelerate(v: Vector3, factor: number): Vector3 {
	return new Vector3(factor * v.X, factor * v.Y, factor * v.Z)
}

export function calculateNewSpeed(power: number) {
	// return PLAYER_THROW_BALL_VELOCITY_FACTOR * math.exp(power)
	const exponent = power * (math.log(PROJECTILE_MAX_SPEED) / PLAYER_MAX_POWER_LEVEL)
	return math.min(math.max(PROJECTILE_MIN_SPEED, math.exp(exponent)), PROJECTILE_MAX_SPEED)
}

export function waitForNamedChildWhichIsA<T extends keyof Instances>(
	parent: Instance,
	name: string,
	className: T,
): Instances[T] {
	for (const child of parent.GetChildren()) {
		if (child.Name === name && child.IsA(className)) {
			return child;
		}
	}
	while (true) {
		const [newChild] = parent.ChildAdded.Wait();
		if (newChild.Name === name && newChild.IsA(className)) {
			return newChild;
		}
	}
}

export function assertFindFirstNamedChildWhichIsA<T extends keyof Instances>(
	parent: Instance,
	name: string,
	className: T,
): Instances[T] {
	for (const child of parent.GetChildren()) {
		if (child.Name === name && child.IsA(className)) {
			return child;
		}
	}
	throw `Could not find a child of ${parent.Name} with name ${name} which is a ${className}`;
}
