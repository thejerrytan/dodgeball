import { Workspace, RunService, PhysicsService, Players } from "@rbxts/services"
import { compare, decelerate } from "shared/module"
import { VELOCITY_DIFF, AIR_RESISTANCE_FACTOR } from "shared/constants"

const replicatedStorage = game.GetService("ReplicatedStorage")
const shootBallEvent = new Instance("RemoteEvent", replicatedStorage)

const freeBalls:BasePart[] = []


shootBallEvent.Name = "ShootBallEvent"

function onShootBallEventFired(player: Player, ball: unknown, direction: unknown){
    print(`${player.Name} just shot a ball`)
    
    if (!typeIs(ball, "Instance") || !ball.IsA("Tool")){
        return
    }

    if (!typeIs(direction, "Vector3")){
        return
    }

    const handle = ball.FindFirstChild("Handle")

    if (handle === undefined){
        return
    }

    if (!handle.IsA("Part")){
        return 
    }
    const newHandle = handle.Clone()

    ball.Destroy()
    newHandle.Parent = Workspace
    // newHandle.CanCollide = true
    newHandle.Velocity = direction.mul(100)
    PhysicsService.SetPartCollisionGroup(newHandle, projectilesCollisionGroupName)
    freeBalls.push(newHandle)
    print(newHandle.Velocity)
}

RunService.Heartbeat.Connect((step: number) => {
    // print(step)
    // Wrap a tool around balls that have stopped moving
    const ballsToRemove: number[] = []
    freeBalls.forEach((ball, idx) => {
        if (compare(ball.Velocity, VELOCITY_DIFF)) {
            const tool = new Instance("Tool")
            ball.Parent = tool
            tool.Parent = Workspace
            ball.Velocity = new Vector3(0,0,0)
            ball.RotVelocity = new Vector3(0,0,0)
            ballsToRemove.insert(0, idx)
            print("new Tool created")
        }
    })
    ballsToRemove.forEach(idx => {
        freeBalls.remove(idx)
    })
    
})

RunService.Stepped.Connect((step: number) =>{
    // attenuate the velocity of the balls over time to simulate air resistance
    freeBalls.forEach(ball => {
        ball.Velocity = decelerate(ball.Velocity, AIR_RESISTANCE_FACTOR)
    })
})

const projectilesCollisionGroupName = "Projectiles"
const playersCollisionGroupName = "Players"
const projectilesCollisionGroupId = PhysicsService.CreateCollisionGroup("Projectiles")
const playersCollisionGroupId = PhysicsService.CreateCollisionGroup("Players")
PhysicsService.CollisionGroupSetCollidable(playersCollisionGroupName, projectilesCollisionGroupName, false)


shootBallEvent.OnServerEvent.Connect(onShootBallEventFired)

Players.PlayerAdded.Connect(player => {
    player.CharacterAdded.Connect(char => {
        char.ChildAdded.Connect(child => {
            if (!child.IsA("BasePart")){
                return
            }
            PhysicsService.SetPartCollisionGroup(child, playersCollisionGroupName)
        })
    })
})

export {}