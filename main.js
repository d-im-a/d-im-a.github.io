const tl = gsap.timeline({
  scrollTrigger: {
    trigger: 'section',
    scrub: 1.5,
    start: '50% bottom',
    end: '90% bottom',
  }
});

const wiggleTl = gsap.timeline({paused: true, yoyo: true, repeat: -1})

tl.from(".stem", .8, {drawSVG:0}, 0);
tl.from(".petal1", 1, {drawSVG:1}, '-=.0');
tl.from(".petal2", 1, {drawSVG:1}, '-=.0');
tl.from(".petal3", 1, {drawSVG:0}, '-=.6');
tl.from(".petal4", 1, {drawSVG:0}, '-=.6');
tl.add(function() {
  // wiggleTl.play();
}), '<';
tl.from(".petal5", 1, {drawSVG:0}, '-=.6');

wiggleTl.to('svg', {rotate: 20, duration: 4, ease: Power2.easeInOut});

