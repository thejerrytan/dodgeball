import { Players } from "@rbxts/services"

export class TrampolineManager {
    launcher: Part
    lastTriggered: number

    constructor () {
        this.lastTriggered = tick()
        const launcher = game.Workspace.FindFirstChild("Launcher")
        if (launcher === undefined) {
            throw "Launcher is not found!"
        }
        
        if (!launcher.IsA("Part")) {
            throw "Launcher is not a part"
        }
        this.launcher = launcher
        this.start()
    }

    private start() {
        this.launcher.Touched.Connect(part => this.onPlayerTouchTrampoline(part))
    }

    private onPlayerTouchTrampoline(part: BasePart) {
        if (tick() - this.lastTriggered < 0.1) {
            return
        }

        if (part.Parent!.IsA("Model") && part.Parent!.FindFirstChildOfClass("Humanoid") !== undefined){
            const associatedPlayer = Players.GetPlayerFromCharacter(part.Parent!)
            if (associatedPlayer !== Players.LocalPlayer) {
                return
            }
            const currVelocity = Players.LocalPlayer!.Character!.PrimaryPart!.Velocity
            const jumpVelocity = new Vector3(0, 100, 0)
            Players!.LocalPlayer!.Character!.PrimaryPart!.Velocity = currVelocity.add(jumpVelocity)
            this.lastTriggered = tick()
        }
    }
}