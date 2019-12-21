import { StarterGui, Players } from "@rbxts/services"
import { assertFindFirstNamedChildWhichIsA, waitForNamedChildWhichIsA } from "shared/module"
import { PLAYER_MIN_POWER_LEVEL, PLAYER_MAX_POWER_LEVEL } from "shared/constants"

export class PlayerGuiW {
    ScreenGui: ScreenGui
    PowerBar: ImageLabel
    PowerBarFill: ImageLabel

    constructor () {
        const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui")
        this.ScreenGui = waitForNamedChildWhichIsA(playerGui, "ScreenGui", "ScreenGui")
        this.PowerBar = waitForNamedChildWhichIsA(this.ScreenGui, "PowerBar", "ImageLabel")
        this.PowerBarFill = waitForNamedChildWhichIsA(this.PowerBar, "PowerBarFill", "ImageLabel")
    }

    private init() {

    }

    public updatePowerBar(powerLevel: number){
        const newXScale = (powerLevel - PLAYER_MIN_POWER_LEVEL) / (PLAYER_MAX_POWER_LEVEL - PLAYER_MIN_POWER_LEVEL)
        const xOffset = this.PowerBarFill.Size.X.Offset
        const yScale = this.PowerBarFill.Size.Y.Scale
        const yOffset = this.PowerBarFill.Size.Y.Offset
        this.PowerBarFill.Size = new UDim2(newXScale, xOffset, yScale, yOffset)
    }
}