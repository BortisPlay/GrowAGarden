const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: 0x9fe6b7,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);

function preload() {
  // simple SVG textures embedded as data URIs to avoid external assets
  this.textures.generate('pot', { data: ['  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="40" y="24" rx="6" ry="6" fill="#8B5A2B"/><rect width="44" height="20" x="10" y="12" fill="#C68642"/></svg>'], pixelWidth:64 });
  this.textures.generate('seed', { data: ['<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="#6b4"/></svg>'], pixelWidth:24 });
  this.textures.generate('sprout', { data: ['<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M24 40 C20 30, 22 24, 24 18 C26 24, 28 30, 24 40 Z" fill="#2a8"/><circle cx="24" cy="14" r="6" fill="#6f3"/></svg>'], pixelWidth:48 });
  this.load.audio('pluck', ['pluck.ogg','pluck.mp3']);
}

function create() {
  this.add.text(18, 18, 'Grow a Garden — демо', { font: '20px Arial', fill: '#184' });

  // create ground rows of pots
  this.pots = this.add.group();
  for (let i=0;i<6;i++){
    for (let j=0;j<3;j++){
      const x = 120 + i*100;
      const y = 200 + j*140;
      const pot = this.add.image(x,y,'pot').setScale(1.2);
      pot.plant = null;
      pot.x0 = x; pot.y0 = y;
      this.pots.add(pot);
    }
  }

  // sound (fallback silence if not loaded)
  this.pluckSound = this.sound.add('pluck', { volume: 0.5, loop: false });

  // UI
  document.getElementById('plantBtn').addEventListener('click', ()=> {
    plantSeed(this);
  });
  document.getElementById('visitBtn').addEventListener('click', ()=> {
    const status = document.getElementById('status');
    status.textContent = 'Посещение сада друга... (демо)';
    setTimeout(()=> status.textContent = '', 1500);
  });

  // simple growth timer
  this.time.addEvent({
    delay: 2000,
    loop: true,
    callback: ()=> {
      this.pots.getChildren().forEach(pot => {
        if (pot.plant) {
          pot.plant.growth += 1;
          updatePlantSprite(this, pot);
        }
      });
    }
  });

  // load fallback sound generated at runtime if external files absent
  // create a tiny beep buffer as fallback
  try {
    if (!this.cache.audio.exists('pluck')) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const duration = 0.06;
      const sr = ctx.sampleRate;
      const buffer = ctx.createBuffer(1, sr*duration, sr);
      const data = buffer.getChannelData(0);
      for (let i=0;i<data.length;i++){
        data[i] = Math.sin(2*Math.PI*440*(i/sr)) * Math.exp(-10*i/data.length);
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
    }
  } catch(e) {
    // ignore
  }
}

function plantSeed(scene){
  // find first empty pot
  const empty = scene.pots.getChildren().find(p=> p.plant===null);
  if (!empty) {
    const status = document.getElementById('status');
    status.textContent = 'Нет свободных горшков!';
    setTimeout(()=> status.textContent = '', 1200);
    return;
  }
  const seedSprite = scene.add.image(empty.x0, empty.y0-6, 'seed').setScale(1.6);
  empty.plant = { sprite: seedSprite, growth: 0 };
  if (scene.pluckSound) scene.pluckSound.play();
}

function updatePlantSprite(scene, pot){
  const g = pot.plant.growth;
  if (g < 2) {
    pot.plant.sprite.setTexture('seed').setScale(1.6).y = pot.y0-6;
  } else if (g < 6) {
    // sprout appears
    if (pot.plant.sprite.texture.key !== 'sprout') pot.plant.sprite.setTexture('sprout').setScale(1.0).y = pot.y0-8;
    pot.plant.sprite.setScale(1.0 + g*0.05);
  } else {
    // fully grown: animate gentle sway
    pot.plant.sprite.setScale(1.6);
    scene.tweens.add({
      targets: pot.plant.sprite,
      x: pot.x0 + Math.sin(performance.now()/500 + pot.x0)*2,
      duration: 800,
      ease: 'Sine.easeInOut',
      yoyo: true
    });
  }
}

function update() {
  // nothing heavy here
}
