import { Players } from "@rbxts/services"
import { LAUNCHER_VELOCTY } from "shared/constants"

export class Launcher {
    lastTriggered: number
    part: Part
    debounceInterval: number = 0.1
    
    constructor (part: Part) {
        this.lastTriggered = tick()
        this.part = part
    }
}

export class LauncherManager {
    launchers: Map<string, Launcher> = new Map<string, Launcher>()

    constructor () {
        this.initLauncher("Launcher1")
        this.initLauncher("Launcher2")
        this.initLauncher("Launcher3")
        this.initLauncher("Launcher4")
    }

    private initLauncher(name: string){
        
        const part = game.Workspace.FindFirstChild(name)
        if (part === undefined) {
            throw "Launcher is not found!"
        }
        
        if (!part.IsA("Part")) {
            throw "Launcher is not a part"
        }
        const launcher = new Launcher(part)
        this.launchers.set(name, launcher)
        this.start(launcher)
    }

    private start(launcher: Launcher) {
        launcher.part.Touched.Connect(part => this.onPlayerTouch(part, launcher))
    }

    private onPlayerTouch(part: BasePart, launcher: Launcher) {
        if (tick() - launcher.lastTriggered < launcher.debounceInterval) {
            return
        }

        if (part.Parent!.IsA("Model") && part.Parent!.FindFirstChildOfClass("Humanoid") !== undefined){
            const associatedPlayer = Players.GetPlayerFromCharacter(part.Parent!)
            if (associatedPlayer !== Players.LocalPlayer) {
                return
            }
            const currVelocity = Players.LocalPlayer!.Character!.PrimaryPart!.Velocity
            const jumpVelocity = new Vector3(0, LAUNCHER_VELOCTY, 0)
            Players!.LocalPlayer!.Character!.PrimaryPart!.Velocity = currVelocity.add(jumpVelocity)
            launcher.lastTriggered = tick()
        }
    }
}