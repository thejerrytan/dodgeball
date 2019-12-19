import { BallManager } from "./BallManager";
import { RunService } from "@rbxts/services";
import { TrampolineManager } from "./TrampolineManager";

const ballManager = new BallManager()
const trampolineManager = new TrampolineManager()

let ranCount = 0

function onTick(step: number) {
    ranCount += 1
    if (ballManager.isCharging && (ranCount % 30) === 0) {
        print("Power level: ", ballManager.getPowerLevel())
    }
}

RunService.Heartbeat.Connect(onTick)