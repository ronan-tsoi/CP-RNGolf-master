class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 300
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1200

        this.counter = 0
        this.score = 0
        this.ratio = 0

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {

        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10,  'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        // creating an object group
        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        //removes collision detection from "down" side of detection
        this.oneWay.body.checkCollision.down = false

        // draw text
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '36px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        this.shotCounter = this.add.text(width / 2, height / 60, this.counter, textConfig)
        this.totalScore = this.add.text(width / 10, height / 60, this.score, textConfig)
        this.successfulShotPercentage = this.add.text(width - (width / 5), height / 60, this.ratio, textConfig)

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            // ternary operator
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1

            //this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            if (pointer.x < this.ball.x) {
                this.ball.body.setVelocityX(Phaser.Math.Between(0, this.SHOT_VELOCITY_X))
            } else {
                this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, 0))
            }
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
            
            this.counter += 1
            this.ratio = this.score / this.counter

            this.shotCounter.text = this.counter
            this.successfulShotPercentage.text = Phaser.Math.RoundTo(this.ratio, -3)

        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.ball.setX(width/2)
            this.ball.setY(height - height/10)
            this.ball.body.setVelocityX(0)
            this.ball.body.setVelocityY(0)

            this.score += 1
            this.ratio = this.score / this.counter

            this.totalScore.text = this.score
            this.successfulShotPercentage.text = Phaser.Math.RoundTo(this.ratio, -3)

            //as a bonus: randomize wall placements for every ball
            wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
            wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
            this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        })

        // ball/wall collision (with group definition)
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

    }

    update() {

    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/