<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    {{ greetingMsg }}

    <html>
      <head>
        <title>iPhone X</title>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
      </head>
      <body>
        <div class="video-wrapper">
          <video
            muted=""
            playsinline=""
            autoplay=""
            loop=""
            id="video-studiomeal"
            src="https://images.apple.com/media/us/iphone-x/2017/01df5b43-28e4-4848-bf20-490c34a926a7/overview/primary/hero/large_2x.mp4"
          ></video>
        </div>
        <canvas id="cover-canvas"></canvas>
      </body>
    </html>
  </div>
</template>

<script>
import img from "@/assets/phone.png";
import Vue from "vue";
export default {
  name: "MainPage",
  props: {
    msg: String,
  },
  data() {
    return {
      greetingMsg: "hi",
    };
  },
  mounted() {
    //for phone element
    var elemPhone;

    // for current user's local browser window size
    var windowWidth = 0;
    var windowHeight = 0;

    // canvas size (generally bigger than local browser window size and resize displayed
    //size by css)
    var canvasWidth = 0;
    var canvasHeight = 0;

    //mouse pos Y
    var scrollY = 0;
    var relativeScrollY = 0;

    var prevDurations = 0;
    var totalScrollHeight = 0;
    var currentKeyframe = 0;
    var phoneWidth = 1380;
    var phoneHeight = 3000;
    var resizeHandler;
    var scrollHandler;
    var render;
    var drawCanvas;
    var calcAnimationValue;
    var pixelDuration = 0;
    var keyframes = [
      {
        animationValues: {
          videoScale: [1, 2],
          triangleMove: [0, 200],
          rectangleMove: [0, 500],
        },
      },
      {
        animationValues: {
          videoScale: [2, 0.5],
          triangleMove: [200, 1000],
          rectangleMove: [500, 500],
        },
      },
    ];
    var elemBody = document.body;
    var elemCanvas = document.getElementById("cover-canvas");
    var context = elemCanvas.getContext("2d");
    var elemVideo = document.getElementById("video-studiomeal");

    var init = function () {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      resizeHandler();
      render();
      window.addEventListener("resize", function () {
        requestAnimationFrame(resizeHandler);
      });
      window.addEventListener("scroll", function () {
        requestAnimationFrame(scrollHandler);
      });
      elemPhone = document.createElement("img");
      elemPhone.src = img;
      elemPhone.addEventListener("load", function () {
        drawCanvas();
      });
    };
    resizeHandler = function () {
      var i;
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      totalScrollHeight = 0;
      pixelDuration = 0.5 * windowHeight;
      for (i = 0; i < keyframes.length; i++) {
        totalScrollHeight += pixelDuration;
      }
      totalScrollHeight += windowHeight;
      elemBody.style.height = totalScrollHeight + "px";
      elemCanvas.width = canvasWidth = windowWidth * 2;
      elemCanvas.height = canvasHeight = windowHeight * 2;
      elemCanvas.style.width = windowWidth + "px";
      elemCanvas.style.height = windowHeight + "px";
    };
    scrollHandler = function () {
      scrollY = window.pageYOffset;
      if (scrollY < 0 || scrollY > totalScrollHeight - windowHeight) {
        return;
      }
      if (scrollY > pixelDuration + prevDurations) {
        prevDurations += pixelDuration;
        currentKeyframe++;
      } else if (scrollY < prevDurations) {
        currentKeyframe--;
        prevDurations -= pixelDuration;
      }
      relativeScrollY = scrollY - prevDurations;
      render();
    };
    render = function () {
      var videoScale, triangleMove, rectangleMove;
      if (keyframes[currentKeyframe]) {
        videoScale = calcAnimationValue(
          keyframes[currentKeyframe].animationValues.videoScale
        );
        triangleMove = calcAnimationValue(
          keyframes[currentKeyframe].animationValues.triangleMove
        );
        rectangleMove = calcAnimationValue(
          keyframes[currentKeyframe].animationValues.rectangleMove
        );
      } else {
        return;
      }
      elemVideo.style.transform = "scale(" + videoScale + ")";
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      if (elemPhone) {
        drawCanvas(videoScale, triangleMove, rectangleMove);
      }
    };
    calcAnimationValue = function (values) {
      return (
        (relativeScrollY / pixelDuration) * (values[1] - values[0]) + values[0]
      );
    };
    drawCanvas = function (videoScale, triangleMove, rectangleMove) {
      var vs = videoScale || 1,
        tm = triangleMove || 0,
        rm = rectangleMove || 0;
      context.save();
      Vue.$log.debug(vs, tm, rm);
      context.translate(
        (canvasWidth - phoneWidth * vs) * 0.5,
        (canvasHeight - phoneHeight * vs) * 0.5
      );
      context.drawImage(elemPhone, 0, 0, phoneWidth * vs, phoneHeight * vs);
      context.restore();
      context.fillStyle = "#ff9a00";
      context.beginPath();
      context.moveTo(canvasWidth * 0.5 - 1500, -tm - 1700);
      context.lineTo(canvasWidth * 0.5, canvasHeight * 0.5 - 150 - tm);
      context.lineTo(canvasWidth * 0.5 + 1500, -tm - 1700);
      context.lineTo(canvasWidth * 0.5 - 1500, -tm - 1700);
      context.fill();
      context.closePath();
      context.beginPath();
      context.moveTo(canvasWidth * 0.5 - 1500, canvasHeight + tm + 1700);
      context.lineTo(canvasWidth * 0.5, canvasHeight * 0.5 + 150 + tm);
      context.lineTo(canvasWidth * 0.5 + 1500, canvasHeight + tm + 1700);
      context.lineTo(canvasWidth * 0.5 - 1500, canvasHeight + tm + 1700);
      context.fill();
      context.closePath();
      context.beginPath();
      context.moveTo(canvasWidth * 0.5 - 1700 - tm, -1700);
      context.lineTo(canvasWidth * 0.5 - 130 - tm, canvasHeight * 0.5);
      context.lineTo(canvasWidth * 0.5 - 1700 - tm, canvasHeight + 1700);
      context.lineTo(canvasWidth * 0.5 - 1700 - tm, -1700);
      context.fill();
      context.closePath();
      context.beginPath();
      context.moveTo(canvasWidth * 0.5 + 1700 + tm, -1700);
      context.lineTo(canvasWidth * 0.5 + 130 + tm, canvasHeight * 0.5);
      context.lineTo(canvasWidth * 0.5 + 1700 + tm, canvasHeight + 1700);
      context.lineTo(canvasWidth * 0.5 + 1700 + tm, -1700);
      context.fill();
      context.closePath();
      context.fillRect(0, canvasHeight * 0.5 - 2600 - rm, canvasWidth, 2000);
      context.fillRect(0, canvasHeight * 0.5 + 600 + rm, canvasWidth, 2000);
    };
    init();
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
html {
  height: 100%;
  font-family: sans-serif;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
body {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
html,
body,
div,
span,
applet,
object,
iframe,
figure,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
font,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td {
  margin: 0;
  padding: 0;
  border: 0;
}
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
main,
nav,
section,
summary {
  display: block;
}
div,
article,
section,
p,
ul,
li,
span,
label {
  box-sizing: border-box;
}
body {
  background: #000;
}
#cover-canvas {
  position: fixed;
  top: 0;
  left: 0;
}
.video-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
#video-studiomeal {
  transform: scale(1);
}
</style>

