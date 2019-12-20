import { Players } from "@rbxts/services"
import { assertFindFirstNamedChildWhichIsA } from "shared/module"
import { LEADERBOARD_SCORE_NAME, LEADERBOARD_KILL_NAME, LEADERBOARD_DEATH_NAME } from "shared/constants"

export class PlayerW {
    player: Player

    constructor (p: Player) {
        this.player = p 
    }
}

export class PlayersController {
    players: Map<string, PlayerW> = new Map()

    constructor () {
        Players.PlayerAdded.Connect(player => this.onPlayerAdded(player))
        Players.PlayerRemoving.Connect(player => this.onPlayerLeft(player))
    }

    private onPlayerAdded(player: Player) {
        this.initPlayerStats(player)
        this.players.set(player.Name, new PlayerW(player))
    }
    
    private onPlayerLeft(player: Player){
        this.players.delete(player.Name)
    }
    
    private initPlayerStats(player: Player) {
        const f = new Instance("Folder")
        f.Name = "leaderstats"
        f.Parent = player
    
        const kills = new Instance("IntValue")
        kills.Name = LEADERBOARD_KILL_NAME
        kills.Value = 0
        kills.Parent = f

        const death = new Instance("IntValue")
        death.Name = LEADERBOARD_DEATH_NAME
        death.Value = 0
        death.Parent = f

        const score = new Instance("IntValue")
        score.Name = LEADERBOARD_SCORE_NAME
        score.Value = 0
        score.Parent = f

    }

    public updatePlayerStats(playerName: string, statName: string, statClass: string , diff: number) {
        const playerW = this.players.get(playerName)
        if (playerW === undefined) { return }
        print("1")
        const leaderstats = playerW.player.FindFirstChildOfClass("Folder")
        if (leaderstats === undefined) { return }
        print("2")
        const stat = assertFindFirstNamedChildWhichIsA(leaderstats, statName, "IntValue")
        stat.Value += diff
        print("3")
    }
}