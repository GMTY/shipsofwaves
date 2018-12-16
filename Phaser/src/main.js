//this game will have only 1 state
require('waves-transactions');

const writeData = async (p1shipX, p1shipY, p1finishX, p1finishY, p1timeStart, p1timeEnd) => {
    await Waves.signAndPublishTransaction({
        type: 12,
        data: {
            fee: {
                assetId: 'WAVES',
                tokens: '0.001'
            },
            data: [
                {type: 'integer', key: 'p1shipX', value: p1shipX},
                {type: 'integer', key: 'p1shipY', value: p1shipY},
                {type: 'integer', key: 'p1finishX', value: p1finishX},
                {type: 'integer', key: 'p1finishY', value: p1finishY},
                {type: 'integer', key: 'p1timeStart', value: p1timeStart},
                {type: 'integer', key: 'p1timeEnd', value: p1timeEnd},
                {type: 'integer', key: 'state', value: 0}
            ]
        }
    });
};


var GameState = {
  expload: false,
  pl: 1,
  rotation: {
    side: 0,
    rotation: 0,
  },
  rotation_two: {
    side: 0,
    rotation: 0,
  },
  position: {
    x: -1000,
    y: -1000
  },
  ajax: {
    start_x: 100,
    start_y: 100,
    end_x: 400,
    end_y: 400,
    start_time: +new Date() / 1000,
    end_time: (+new Date()/1000),
    two_start_x: 300,
    two_start_y: 300,
    two_end_x: 100,
    two_end_y: 100,
    two_start_time: +new Date() / 1000,
    two_end_time: (+new Date()/1000 + 40)
  },
  click: false,
  //initiate game settings
  init: function() {
    //adapt to screen size, fit all the game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // console.log(this.position.start_time)
  },

  //load the game assets before the game starts
  preload: function() {
    this.load.image('water', 'assets/images/water.jpg');
    this.load.image('ship_1', 'assets/images/ship_1.png');
    this.load.image('ship_2', 'assets/images/ship_2.png');
    this.load.spritesheet('exp', 'assets/images/expload_spritesheet.png', 100, 100, 81);
  },
  //executed after everything is loaded
  create: function() {
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'water');
    this.player_two = this.add.sprite(400, 400, 'ship_2');
    this.player_two.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this.player_two);

    this.player = this.add.sprite(100, 100, 'ship_1');
    this.player.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this.player);

    this.rotation.degree = 0;
    this.rotation.side = 0;

    var self = this
    setInterval(() => {
      // $.get("http://185.178.47.157/get_data.php", function( data ) {
      // let some = JSON.parse(data);

      $.get("https://nodes.wavesplatform.com/addresses/data/3P2iPJFwLKGfFzDnW56cGaEAR8f76sm34H6", function( data ) {
            let some =data;
            let result = [];

            for (let data1 of some) {
                result[data1.key] = data1.value;
            }
            some = result;
      // console.log(data)
      // self.position.x = some.shipX
      // self.position.y = some.shipY

      self.ajax.start_time_prev = self.ajax.start_time
      self.ajax.two_start_time_prev = self.ajax.start_time

      self.ajax.start_x = some.p1shipX
      self.ajax.start_y = some.p1shipY
      self.ajax.end_x = some.p1finishX
      self.ajax.end_y = some.p1finishY
      self.ajax.start_time = some.p1timeStart
      self.ajax.end_time = some.p1timeEnd


      self.ajax.two_start_x = some.p2shipX
      self.ajax.two_start_y = some.p2shipY
      self.ajax.two_end_x = some.p2finishX
      self.ajax.two_end_y = some.p2finishY
      self.ajax.two_start_time = some.p2timeStart
      self.ajax.two_end_time = some.p2timeEnd

      // self.get_vel(some.shipX, some.shipY, some.finishX, some.finishY, some.timeStart, some.timeEnd);
      // self.get_vel(100, 100, 400, 400, 1544895256, (1544895256 + (600)));
      // self.ajax.s
      // if(self.ajax.start_time_prev !== self.ajax.start_time) {


      //   // console.log(this.rotation.degree)
      // }

      if(self.ajax.start_time_prev !== self.ajax.start_time) {
        self.rotation.degree = self.get_deg(self.ajax.end_x - self.ajax.start_x,self.ajax.end_y - self.ajax.start_y);

        if(self.rotation.degree > 180)
          self.rotation.degree -= 360
        if(self.player.body.rotation - self.rotation.degree < 0)
          self.rotation.side = 0.2;
        else
          self.rotation.side = -0.12;
      }

    });
    }, 1000)

    // setInterval(() => {
    //   $.get("http://185.178.47.157/get_data.php", function( data ) {
    //     data = JSON.parse(data);
    //     console.log(data)
    //   })
    // }, 3000)


  },
  update: function() {
    // this.game.physics.arcade.overlap(this.player, this.player_two, () => {
    //   console.log('Boom!')
    // });

    this.get_vel(this.ajax.start_x, this.ajax.start_y, this.ajax.end_x, this.ajax.end_y, this.ajax.start_time, this.ajax.end_time, 1);

    this.get_vel(this.ajax.two_start_x, this.ajax.two_start_y, this.ajax.two_end_x, this.ajax.two_end_y, this.ajax.two_start_time, this.ajax.two_end_time, 2);
    // debugger;
    if(this.game.input.activePointer.isDown && this.click === false) {
      console.log('click')
      console.log(this.pl);
    if(this.pl === 1) {
    var targetX = this.game.input.activePointer.position.x;
    var targetY = this.game.input.activePointer.position.y;
    var body_x = this.player.body.position.x;
    var body_y = this.player.body.position.y;
    let diff_x = Math.abs(targetX - body_x)
    let diff_y = Math.abs(targetY - body_y)
    let s = (Math.sqrt(diff_x*diff_x + diff_y*diff_y)) / 10;
    console.log('Scorost',s)
    console.log(targetX, targetY, body_x, body_y)
    this.click = true;
    var now = +new Date() / 1000;

        writeData(body_x, body_y, targetX, targetY, now+8, now + s)
            .then(console.log('POST'));

    /*$.post( "http://185.178.47.157/set_data_1.php", {
      p1shipX: body_x,
      p1shipY: body_y,
      p1finishX: targetX,
      p1finishY: targetY,
      p1timeStart: now+8,
      p1timeEnd: now + s,} )
    .done(() => {
        console.log('POST!')
      });*/

        // this.ajax.start_x = body_x
        // this.ajax.start_y = body_y
        // this.ajax.end_x = targetY
        // this.ajax.end_y = targetX
        // this.ajax.start_time = now
        // this.ajax.end_time = now + 20


        this.rotation.degree = this.get_deg(targetX - this.player.body.position.x,targetY - this.player.body.position.y);

        if(this.rotation.degree > 180)
          this.rotation.degree -= 360
        if(this.player.body.rotation - this.rotation.degree < 0)
          this.rotation.side = 0.2;
        else
          this.rotation.side = -0.12;



    // this.rotation.degree = this.get_deg(targetX - this.player.body.position.x,targetY - this.player.body.position.y);


    // if(this.rotation.degree > 180)
    //   this.rotation.degree -= 360
    // if(this.player.body.rotation - this.rotation.degree < 0)
    //   this.rotation.side = 1;
    // else
    //   this.rotation.side = -1;

    // console.log(this.rotation.degree)
      } else if (this.pl === 2) {
        var targetX = this.game.input.activePointer.position.x;
    var targetY = this.game.input.activePointer.position.y;
    var body_x = this.player_two.body.position.x;
    var body_y = this.player_two.body.position.y;

    console.log(targetX, targetY, body_x, body_y)
    this.click = true;
    var now = +new Date() / 1000;
    // $.post( "http://185.178.47.157/set_data.php", { p1shipX: body_x, p1shipY: body_y, p1finishX: targetY, p1finishY: targetX, p1timeStart: now+8, p1timeEnd: now + 60,
    //   p2shipX: body_x, p2shipY: body_y, p2finishX: targetX, p2finishY: targetY, p2timeStart: now, p2timeEnd: now + 120,} ).done(() => {
    //     console.log('POST!')
    //   });

        // this.ajax.two_start_x = body_x
        // this.ajax.two_start_y = body_y
        // this.ajax.two_end_x = targetY
        // this.ajax.two_end_y = targetX
        // this.ajax.two_start_time = now
        // this.ajax.two_end_time = now + 20


        this.rotation_two.degree = this.get_deg(targetX - this.player_two.body.position.x,targetY - this.player_two.body.position.y);

        if(this.rotation_two.degree > 180)
          this.rotation_two.degree -= 360
        if(this.player_two.body.rotation - this.rotation_two.degree < 0)
          this.rotation_two.side = 0.2;
        else
          this.rotation_two.side = -0.12;
      }
    }

    if(this.game.input.activePointer.isUp)
      this.click = false
    // console.log()

    if(Math.round(this.player.body.rotation) !== Math.round(this.rotation.degree)) {
      this.player.body.rotation += this.rotation.side
      // console.log(this.player.body.rotation, this.rotation.degree)
    }

    if(Math.round(this.player_two.body.rotation) !== Math.round(this.rotation_two.degree)) {
      this.player_two.body.rotation += this.rotation_two.side
      // console.log(this.player.body.rotation, this.rotation.degree)
    }

    // if(this.position.x != -1000){
    //   this.player.body.position.x = this.position.x
    //   this.player.body.position.y = this.position.y
    // }
    // this.game.physics.arcade.overlap(this.player, this.player_two, () => {
    //   if(!this.expload){
    //   this.explode();
    //   this.expload = true
    // }
    // });

      var self = this
      this.game.physics.arcade.overlap(this.player, this.player_two, function() {
          if(!self.expload)
              self.explode();
          self.expload = true
      });
  },

  get_deg: function(x, y) {
    var deg
    var arc = Math.atan(x/y);

    if(y > 0){
        deg = 180 - ((arc * 180) / Math.PI)
        deg %= 360
      }
    else {
        deg = 360 - ((arc * 180) / Math.PI)
        deg %= 360
      }

    if(x > 0) {
      deg -= 18
    } else {
      deg += 22
    }


    return  deg;
  },
  get_vel: function(start_x,start_y,end_x,end_y,start_time,end_time, player) {
    let x = end_x - start_x;
    let y = end_y - start_y;
    // console.log('X',start_x, end_x)
    // console.log('Y',start_y, end_y)
    let way_time = end_time - start_time;
    // console.log('total way time',way_time)
    let date = +new Date()/1000;
    // console.log('end time', end_time)
    // console.log('current time', date)
    let time_pass = date - start_time;
    // console.log('that is time pass',time_pass)

    distancePassed = time_pass/way_time;
    if(distancePassed > 1)
      distancePassed = 1
    // console.log('distancePassed', distancePassed)
    // console.log('Done!', procent)
    // console.log(end_x,end_y);

    // console.log('X Y',x,y)
    // console.log('Dist', x*distancePassed,y*distancePassed)
    let current_x = start_x + x*distancePassed;
    let current_y = start_y + y*distancePassed;
    // console.log('CUrrent', current_x, current_y)
    if(player == 1) {
      // console.log(this.player.body.position)
      this.player.body.position.x = current_x;
      this.player.body.position.y = current_y;

      this.position.x = current_y;
      this.position.y = current_x;
    } else if (player == 2) {
      // console.log(this.player_two.body.position)
      this.player_two.body.position.x = current_x;
      this.player_two.body.position.y = current_y;

      this.position.x = current_y;
      this.position.y = current_x;
      // debugger;
    }

  },
    explode: function () {
        let x = this.player_two.body.position.x;
        let y = this.player_two.body.position.y + 80;
        // this.add.sprite(x, y, 'ship_2_dest');
        this.exp = this.add.sprite(x, y - 50, 'exp');
        this.walk = this.exp.animations.add('walk');
        this.exp.animations.play('walk', 30, false);
    }

};

//initiate the Phaser framework
var game = new Phaser.Game(600, 600, Phaser.AUTO);
game.state.add('GameState', GameState);
game.state.start('GameState');

